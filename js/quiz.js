/* =========================================================
   EARLY INDIANS — QUIZ ENGINE
   Six quiz modules generated from the book’s own data
   (js/data.js + js/atlas-data.js):
     1. chronology — which of these events happened first?
     2. order      — rank five events, oldest → newest
     3. where      — which place matches this story?
     4. stops      — which atlas stop is this?
     5. truefalse  — is this fact true?
     6. match      — which chapter covers this event?
   Best score per module persists in localStorage ("ei-quiz-best").
   Vanilla DOM, consistent with the rest of the atlas.
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (html) e.innerHTML = html;
    return e;
  };
  const D = window.DATA, EV = window.EVENTS, ST = window.STORIES, SITES = window.SITES,
    CH = window.CHAPTERS, FACTS = window.FACTS;
  const fmtYa = ya => ya >= 12000 ? `${ya.toLocaleString("en-US")} ya` : ya > 2000 ? `${ya - 2000} BCE` : ya === 2000 ? "1 CE" : `${2000 - ya} CE`;
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };
  const BEST = "ei-quiz-best";
  const bestOf = id => (store.get(BEST) || {})[id] || 0;
  const saveBest = (id, n) => { const s = store.get(BEST) || {}; s[id] = Math.max(s[id] || 0, n); store.set(BEST, s); };
  const shuffle = a => a.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);

  /* per-module shell: head, panel, footer */
  function shell(id, title, tagline) {
    const card = el("article", { class: "q-card", "data-quiz": id });
    card.append(el("div", { class: "q-head" }, el("span", { class: "q-title" }, title), el("span", { class: "q-tag" }, tagline)));
    const panel = el("div", { class: "q-panel", role: "group", "aria-label": title });
    card.append(panel);
    const footer = el("div", { class: "q-footer" });
    card.append(footer);
    return { card, panel, footer };
  }

  /* score + "New quiz" button; New quiz re-invokes draw on the same shell */
  function showScore(mod, sh, state) {
    const btn = el("button", { class: "btn sm ghost", type: "button" }, "New quiz");
    btn.addEventListener("click", () => mod.draw(sh));
    sh.footer.replaceChildren(
      el("span", { class: "q-score", "aria-live": "polite" }, state.total > 0 ? `${state.correct} of ${state.total} correct · Best: ${bestOf(mod.id)}` : `Best: ${bestOf(mod.id) || "—"}`),
      btn
    );
  }

  /* pick-one: click the correct option */
  function drawPick(mod, sh, question, options) {
    sh.panel.replaceChildren(); sh.footer.replaceChildren();
    let answered = false;
    const state = { correct: 0, total: 0 };
    const opts = el("div", { class: "q-opts", role: "group", "aria-label": question });
    options.forEach(o => {
      const b = el("button", { class: "q-opt", type: "button" }, o.label);
      b.addEventListener("click", () => {
        if (answered) return; answered = true;
        const ok = o.correct;
        opts.querySelectorAll("button").forEach(x => {
          const sel = x === b;
          x.setAttribute("aria-pressed", sel);
          x.classList.toggle("on", sel && ok); x.classList.toggle("off", sel && !ok); x.classList.toggle("dim", !sel);
        });
        sh.panel.replaceChildren(el("p", { class: "q-q" }, question), opts,
          el("p", { class: "q-feedback " + (ok ? "q-good" : "q-bad") }, ok ? "Correct!" : `It was “${options.find(x => x.correct).label}”.`));
        state.total++; if (ok) state.correct++;
        saveBest(mod.id, state.correct); showScore(mod, sh, state);
      });
      opts.append(b);
    });
    sh.panel.replaceChildren(el("p", { class: "q-q" }, question), opts);
    showScore(mod, sh, state);
  }

  /* rank: click events to build the ordering, then score against the true order */
  function drawRank(mod, sh, question, items) {
    sh.panel.replaceChildren(); sh.footer.replaceChildren();
    const poolEl = el("div", { class: "q-opts q-rank", role: "group", "aria-label": question });
    const rankEl = el("div", { class: "q-rank-list" });
    const rank = [], expected = [...items].sort((a, b) => (a.ya || 0) - (b.ya || 0));
    const state = { correct: 0, total: 0 };
    const done = el("p", { class: "q-feedback" });
    const check = () => {
      if (rank.length < items.length) return;
      state.total = expected.length;
      state.correct = expected.reduce((n, e, i) => n + (rank[i] && rank[i].id === e.id ? 1 : 0), 0);
      done.textContent = state.correct === expected.length ? "A perfect ranking! ✓" : `Your ranking was in the right spot at ${state.correct} of ${state.total} events.`;
      saveBest(mod.id, state.correct);
      showScore(mod, sh, state);
    };
    shuffle(items).forEach(it => {
      const b = el("button", { class: "q-opt", type: "button" }, it.label);
      b.addEventListener("click", () => { if (rank.length >= items.length) return; b.remove(); rankEl.append(b); rank.push(it); check(); });
      poolEl.append(b);
    });
    sh.panel.replaceChildren(el("p", { class: "q-q" }, question), rankEl, poolEl, done);
    showScore(mod, sh, state);
  }

  const modules = [
    {
      id: "chronology", title: "Chronology quiz", tagline: "Which of these happened first?",
      draw(sh) {
        const evs = shuffle(EV).slice(0, 6);
        const oldest = [...evs].sort((a, b) => (b.ya || 0) - (a.ya || 0)).slice(-1)[0];
        drawPick(this, sh, "Which of these events happened first?", evs.map(e => ({ label: `${e.t} (${fmtYa(e.ya)})`, correct: e === oldest })));
      }
    },
    {
      id: "order", title: "Order the events", tagline: "Oldest → newest, five stops on the timeline.",
      draw(sh) {
        drawRank(this, sh, "Click the events in the order they happened — oldest first.",
          shuffle(EV).slice(0, 5).map(e => ({ label: e.t, ya: e.ya || 0, id: e.t })));
      }
    },
    {
      id: "where", title: "Where did it happen?", tagline: "Match the story to its place.",
      draw(sh) {
        const all = shuffle(SITES).slice(0, 4);
        const a = all[0];
        drawPick(this, sh, `Which of these places matches the story? — “${a.n}”, ${a.where}`,
          all.map(s => ({ label: s.n, correct: s === a })));
      }
    },
    {
      id: "stops", title: "The atlas tour", tagline: "Which stop is this?",
      draw(sh) {
        const stops = shuffle(ST).slice(0, 4);
        const a = stops[0];
        drawPick(this, sh, `Which of these stops is this? — ${a.text.slice(0, 110)}…`,
          stops.map(s => ({ label: s.title, correct: s === a })));
      }
    },
    {
      id: "truefalse", title: "True or False", tagline: "About the book’s facts.",
      draw(sh) {
        const f = shuffle(FACTS)[0];
        drawPick(this, sh, `True or False: “${f[0]}”`, [{ label: "True", correct: true }, { label: "False", correct: false }]);
      }
    },
    {
      id: "match", title: "Chapter quiz", tagline: "Which chapter covers this event?",
      draw(sh) {
        const evs = shuffle(EV).slice(0, 5);
        drawPick(this, sh, `Which chapter of the book covers “${evs[0].t}”?`,
          CH.map(c => ({ label: c.short, correct: c.id === evs[0].ch })));
      }
    }
  ];

  function render(host) {
    host.replaceChildren();
    modules.forEach(m => { const sh = shell(m.id, m.title, m.tagline); m.draw(sh); host.append(sh.card); });
  }
  window.Quiz = { render, modules };
})();
