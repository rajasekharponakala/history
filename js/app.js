/* =========================================================
   EARLY INDIANS — application layer
   ========================================================= */
(() => {
  "use strict";
  const D = window.DATA, V = window.Viz, IMG = window.IMAGES, CH = window.CHAPTERS, EV = window.EVENTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };
  const chColor = id => `var(--c-${id})`;
  const imgById = Object.fromEntries(IMG.map(i => [i.id, i]));
  const vt = fn => { if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) { const t = document.startViewTransition(fn); [t.ready, t.finished, t.updateCallbackDone].forEach(p => p && p.catch(() => {})); return t; } return fn(); };
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { } } };
  const fmt = n => n.toLocaleString("en-US");

  /* ---------- time formatting ---------- */
  function whenLabel(ya, end) {
    const one = y => y >= 12000 ? `${fmt(y)} years ago` : y > 2000 ? `${fmt(Math.round(y - 2000))} BCE` : y === 2000 ? "1 CE" : `${Math.round(2000 - y)} CE`;
    return end != null && end !== ya ? (ya >= 12000 ? `${fmt(ya)} – ${fmt(end)} years ago` : `${one(ya)} – ${one(end)}`) : one(ya);
  }

  /* =========================================================
     THEME, PROGRESS, NAV
     ========================================================= */
  const root = document.documentElement;
  const saved = store.get("ei-theme");
  if (saved) root.dataset.theme = saved;
  const isDark = () => (root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
  const syncTheme = () => {
    const d = isDark(), b = $("#themeBtn");
    b.setAttribute("aria-label", d ? "Switch to light theme" : "Switch to dark theme"); b.firstElementChild.textContent = d ? "☀" : "☾";
    $$('meta[name="theme-color"]').forEach(m => m.setAttribute("content", d ? "#121211" : "#fcfcfb"));
  };
  $("#themeBtn").addEventListener("click", () => { vt(() => { root.dataset.theme = isDark() ? "light" : "dark"; store.set("ei-theme", root.dataset.theme); syncTheme(); }); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTheme);
  syncTheme();

  const bar = $(".progress");
  const onScroll = () => { const h = document.documentElement; bar.style.setProperty("--p", (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4)); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // chapter nav + scroll spy
  const nav = $(".chapnav");
  const navItems = [["timeline", "Timeline"], ["atlas", "Atlas"], ...CH.map(c => [c.id, c.short]), ["research", "Research"], ["gallery", "Gallery"]];
  nav.innerHTML = navItems.map(([id, l]) => `<a href="#${id}" data-spy="${id}">${l}</a>`).join("");
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    $$("[data-spy]", nav).forEach(a => { const on = a.dataset.spy === e.target.id; a.setAttribute("aria-current", on); if (on && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" }); });
  }), { rootMargin: "-45% 0px -50% 0px" });
  navItems.forEach(([id]) => { const s = document.getElementById(id); s && spy.observe(s); });

  // chapter cards (hero)
  const ERA = { intro: "300,000 ya →", ch1: "65,000 ya", ch2: "7000 BCE", ch3: "2600–1900 BCE", ch4: "2000–1000 BCE", epi: "→ 100 CE" };
  $("#chapterCards").innerHTML = CH.map(c => `<a href="#${c.id}" style="--accent:${chColor(c.id)}"><span class="n">${c.n}</span><span class="era">${ERA[c.id]}</span><b>${c.title}</b><small>${c.blurb}</small></a>`).join("");
  $("#heroSearch").addEventListener("click", () => $("#searchBtn").click());
  const toTop = $("#toTop");
  toTop.addEventListener("click", () => scrollTo({ top: 0 }));
  addEventListener("scroll", () => toTop.classList.toggle("on", scrollY > innerHeight * 1.2), { passive: true });

  // hero 3D tilt
  const cover = $(".cover3d");
  cover?.addEventListener("pointermove", e => {
    const r = cover.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    cover.style.setProperty("--ry", `${x * 26}deg`); cover.style.setProperty("--rx", `${-y * 16}deg`); cover.style.setProperty("--sheen", `${x * 60}%`);
  });
  cover?.addEventListener("pointerleave", () => { cover.style.removeProperty("--ry"); cover.style.removeProperty("--rx"); });

  // count-up numbers
  const counter = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; counter.unobserve(e.target);
    const t = e.target, to = parseFloat(t.dataset.count), dec = (t.dataset.count.split(".")[1] || "").length, pre = t.dataset.pre || "", suf = t.dataset.suf || "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { t.textContent = pre + to.toLocaleString("en-US", { minimumFractionDigits: dec }) + suf; return; }
    const t0 = performance.now();
    (function tick(now) { const p = Math.min(1, (now - t0) / 1100), v = to * (1 - Math.pow(1 - p, 3)); t.textContent = pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: .6 });
  $$("[data-count]").forEach(n => counter.observe(n));

  /* =========================================================
     CHART REGISTRY
     ========================================================= */
  const E = window.ENTITY;
  const pct = v => v + "%";
  const CHARTS = {
    hominins: {
      title: "How long each human cousin lasted", sub: "Lifespans on a logarithmic time axis (years ago). Earlier hominins shown as single dates.",
      src: "Book: Introduction and Chapter 1 (species dates).",
      draw: e => V.gantt(e, D.hominins, { scale: "log", min: 10000, max: 8e6, ticks: [1e6, 1e5, 1e4], label: "Lifespans of hominin species", rowH: 46 }),
      table: () => ({ head: ["Species", "From (years ago)", "To (years ago)"], rows: D.hominins.map(h => [h.label, fmt(h.start ?? h.at), h.end != null ? fmt(h.end) : h.at ? "—" : "present"]) })
    },
    dna: {
      title: "How much DNA we share — and don’t", sub: "Percent of genome. Neanderthal and Denisovan figures apply to non-Africans / specific groups.",
      src: "Book: Introduction; Chapter 1 (0.1% ≈ 3 million differences between two genomes).",
      draw: e => V.ranges(e, D.dna.map((d, i) => ({ label: d.label, lo: d.lo ?? d.value, hi: d.hi ?? d.value, slot: [1, 2, 3, 4][i], note: d.note })), { min: 0, max: 100, step: 25, unit: "%", label: "Shared DNA percentages" }),
      table: () => ({ head: ["Comparison", "Share"], rows: D.dna.map(d => [d.label, d.lo ? `${d.lo}–${d.hi}%` : d.value + "%"]) })
    },
    cosmic: {
      title: "You’re not standing still", sub: "Speeds in km/h on a log scale — the Introduction’s opening thought experiment.",
      src: "Book: Introduction (Prof. Andrew Fraknoi’s speeds).",
      draw: e => V.hbar(e, D.cosmic, { log: true, min: 1000, max: 3e6, fmt: r => V.fmtN(r.value) + " km/h", label: "Cosmic speeds, log scale" }),
      table: () => ({ head: ["Motion", "km/h"], rows: D.cosmic.map(c => [c.label, fmt(c.value)]) })
    },
    evidence: {
      title: "The Out-of-Africa evidence on one axis", sub: "Fossils, tools and genetic estimates (years ago, log scale). Points are single dates; bars are ranges.",
      src: "Book: Chapter 1. Genetic estimate window 70,000–65,000; Australia 59,300–70,700; Sumatra teeth 63,000–73,000.",
      draw: e => V.gantt(e, D.evidence, { scale: "log", min: 10000, max: 400000, ticks: [3e5, 1e5, 5e4, 2e4], label: "Out of Africa evidence timeline", rowH: 46, fmtRange: r => `${fmt(r.start)} → ${fmt(r.end)} years ago`, nowLabel: "← older · younger →" }),
      table: () => ({ head: ["Evidence", "Years ago"], rows: D.evidence.map(d => [d.label, d.at ? fmt(d.at) : `${fmt(d.start)} – ${fmt(d.end)}`]) })
    },
    haplo: {
      title: "When the key lineages arose", sub: "Estimated ages of the mtDNA haplogroups that bracket the exodus (thousand years ago).",
      src: "Book: Chapter 1. If N existed ≈61k years ago and is absent from Africa, OoA can’t be much later.",
      draw: e => V.hbar(e, D.haplo, { style: "lollipop", max: 80, fmt: r => r.value + "k years ago", label: "Haplogroup ages" }),
      table: () => ({ head: ["Haplogroup", "Age (thousand years)"], rows: D.haplo.map(h => [h.label, h.value]) })
    },
    tree: {
      title: "Two family trees, one exodus", sub: "Only L3 (maternal) and C, D, F (paternal) lineages left Africa and populated the rest of the world.",
      src: "Book: Chapter 1 (mtDNA haplogroups L3 → M, N → R; Y-chromosome CT → C, D, F).",
      draw: e => V.tree(e), table: () => ({ head: ["Line", "Haplogroups outside Africa"], rows: [["mtDNA", "L3 → M and N (N → R)"], ["Y-chromosome", "C, D, F (from CT)"]] })
    },
    mis: {
      title: "Ice ages and green Arabias", sub: "Length of each Marine Isotope Stage in thousand years. Odd stages are warm and wet; even are cold and dry.",
      src: "Book: Chapter 1 (MIS table). Stage n lasts from the previous stage’s boundary to its own.",
      draw: e => {
        const m = D.mis, vals = m.map((s, i) => ({ v: s - (i ? m[i - 1] : 0), label: `MIS ${i + 1}`, tick: i + 1, slot: (i + 1) % 2 ? 2 : 1, note: (i + 1) % 2 ? "warm & wet" : "cold & dry" }));
        V.columns(e, vals, { step: 20, yLabel: "thousand years", label: "Marine isotope stage durations" });
        V.legend(e, [{ label: "Warm & wet (odd MIS)", color: V.col(2) }, { label: "Cold & dry (even MIS)", color: V.col(1) }]);
      },
      table: () => ({ head: ["Stage", "Ends (kya)", "Duration (ky)"], rows: D.mis.map((s, i) => [`MIS ${i + 1}`, s, s - (i ? D.mis[i - 1] : 0)]) })
    },
    firstShare: {
      title: "How First Indian are Indians today?", sub: "Share of ancestry from First Indians depends on which part of the genome you ask.",
      src: "Book: Chapter 1 and 4 (ranges across Indian population groups).",
      draw: e => V.ranges(e, D.firstShare, { min: 0, max: 100, step: 25, unit: "%", label: "First Indian ancestry ranges" }),
      table: () => ({ head: ["Measure", "Range"], rows: D.firstShare.map(d => [d.label, `${d.lo}–${d.hi}%`]) })
    },
    anatolian: {
      title: "Anatolian farmer ancestry fades eastwards", sub: "Share of ancestry related to Anatolian farmers.",
      src: "Book: Chapter 2. Zagros people of 7000–8000 BCE lacked it, so Iranian farmers weren’t Anatolian migrants.",
      draw: e => V.hbar(e, D.anatolian.map((a, i) => ({ ...a, slot: 3 })), { max: 100, unit: "%", label: "Anatolian ancestry cline" }),
      table: () => ({ head: ["Region", "Anatolian ancestry"], rows: D.anatolian.map(a => [a.label, a.value + "%"]) })
    },
    bmac: {
      title: "Who lived in the BMAC?", sub: "Ancestry mix of 69 ancient individuals from BMAC sites (most of them).",
      src: "Book: Chapter 2. The remainder is the unreported balance of 100%.",
      draw: e => V.donut(e, D.bmac, { center: { big: "69", small: "individuals" }, label: "BMAC ancestry composition" }),
      table: () => ({ head: ["Ancestry", "Share"], rows: D.bmac.map(a => [a.label, a.value + "%"]) })
    },
    outliers: {
      title: "The migrants from the Indus", sub: "Three outliers at Gonur and Shahr-i-Sokhta (3100–2200 BCE) carried both First Indian and Zagros ancestry.",
      src: "Book: Chapter 2. They show direction: from Zagros towards India and Harappan people travelling outwards.",
      draw: e => V.ranges(e, D.outliers, { min: 0, max: 100, step: 25, unit: "%", label: "Ancestry of Indus-periphery outliers" }),
      table: () => ({ head: ["Ancestry", "Range"], rows: D.outliers.map(a => [a.label, `${a.lo}–${a.hi}%`]) })
    },
    later: {
      title: "Mothers vs fathers: who came later?", sub: "Share of lineages of First-Indian vs later origin in Indian populations.",
      src: "Book: Chapter 2 (“over 60 per cent” of Y lineages are later; upper bound implied by the 10–40% First-Indian range).",
      draw: e => V.ranges(e, D.laterLineages, { min: 0, max: 100, step: 25, unit: "%", label: "Maternal vs paternal lineage origins" }),
      table: () => ({ head: ["Lineage", "Range"], rows: D.laterLineages.map(a => [a.label, `${a.lo}–${a.hi}%`]) })
    },
    westEur: {
      title: "West Eurasian ancestry across India", sub: "Every Indian group carries some; the amount varies by group.",
      src: "Book: Chapter 2 (2009 and 2013 whole-genome studies).",
      draw: e => V.ranges(e, [{ label: "West Eurasian ancestry, all Indian population groups", lo: 20, hi: 80, slot: 2 }], { min: 0, max: 100, step: 25, unit: "%", label: "West Eurasian ancestry range" }),
      table: () => ({ head: ["Measure", "Range"], rows: [["West Eurasian ancestry", "20–80%"]] })
    },
    barley: {
      title: "A barley village", sub: "Naked six-row barley made up more than 90% of the recorded seeds and imprints at Mehrgarh.",
      src: "Book: Chapter 2 (plant assemblage of Mehrgarh).",
      draw: e => V.waffle(e, { total: 100, filled: 90, cols: 10, slot: 4, big: ">90%", text: "of Mehrgarh’s recorded seeds were one barley variety.", label: "Barley share at Mehrgarh" }),
      table: () => ({ head: ["Item", "Share"], rows: [["Naked six-row barley", ">90%"]] })
    },
    hectares: {
      title: "Big for its time", sub: "Settlement area in hectares.",
      src: "Book: Chapter 2 (Mehrgarh ≈200 ha, one of the largest habitations of its period) and Chapter 3 (Dholavira ≈100 ha).",
      draw: e => V.hbar(e, D.hectares, { max: 220, unit: " ha", label: "Settlement area" }),
      table: () => ({ head: ["Site", "Hectares"], rows: D.hectares.map(h => [h.label, h.value]) })
    },
    farming: {
      title: "Farming across the Fertile Crescent to India", sub: "Chronology of first evidence (years ago, log scale).",
      src: "Book: Chapter 2 and Chronology.",
      draw: e => V.gantt(e, D.farming, { scale: "log", min: 3000, max: 15000, ticks: [1e4, 5e3], label: "Farming timeline", rowH: 46, fmtRange: r => `${fmt(r.start)} → ${fmt(r.end)} years ago` }),
      table: () => ({ head: ["Milestone", "Years ago"], rows: D.farming.map(f => [f.label, `${fmt(f.start)} – ${fmt(f.end)}`]) })
    },
    phases: {
      title: "Three phases of the Harappan story", sub: "Early, Mature and Late phases, with the BMAC for context (years ago).",
      src: "Book: Chronology & Chapter 3. Early→Mature transition took 100–150 years.",
      draw: e => V.gantt(e, D.phases, { scale: "linear", min: 3000, max: 8000, ticks: [8000, 7000, 6000, 5000, 4000, 3000], tickFmt: t => (t - 2000) + " BCE", label: "Harappan phases", rowH: 52, fmtRange: r => r.note }),
      table: () => ({ head: ["Phase", "Dates"], rows: D.phases.map(p => [p.label, p.note]) })
    },
    area: {
      title: "A third of today’s India", sub: "Approximate area in million km².",
      src: "Book: Chapter 3 — at its height, “almost a million square kilometres”, more than Mesopotamia and Egypt combined.",
      draw: e => V.hbar(e, D.area, { max: 3.4, fmt: r => r.value + " million km²", label: "Area comparison" }),
      table: () => ({ head: ["Region", "Million km²"], rows: D.area.map(a => [a.label, a.value]) })
    },
    ziggurats: {
      title: "Where are the temples?", sub: "Ziggurats found so far.",
      src: "Book: Chapter 3 — 32 ziggurats in Mesopotamia (28 Iraq, 4 Iran); none clearly identified in the Harappan world.",
      draw: e => V.hbar(e, D.ziggurats, { max: 32, fmt: r => r.value + (r.value === 1 ? " site" : " sites"), label: "Ziggurats found" }),
      table: () => ({ head: ["Region", "Ziggurats"], rows: D.ziggurats.map(a => [a.label, a.value]) })
    },
    unicorn: {
      title: "The most common seal", sub: "About 60 of every 100 Harappan seals show the ‘unicorn’.",
      src: "Book: Chapter 3. Some read it as the emblem of a constituent elite group.",
      draw: e => V.waffle(e, { total: 100, filled: 60, cols: 10, slot: 2, big: "≈60%", text: "of all seals ever recovered carry the unicorn motif.", label: "Unicorn seal share" }),
      table: () => ({ head: ["Motif", "Share of seals"], rows: [["Unicorn", "≈60%"], ["All other motifs", "≈40%"]] })
    },
    lang: {
      title: "Languages of India today", sub: "Approximate share of Indians speaking each family.",
      src: "Book: Chapter 3/4 — Indo-European “over three-quarters”, Dravidian “about a fifth”, Austroasiatic ≈1.2%, Tibeto-Burman <1%.",
      draw: e => V.hbar(e, D.langIndia, { max: 100, fmt: r => (r.value === 1 ? "<1%" : r.value + "%"), label: "Language families in India" }),
      table: () => ({ head: ["Family", "Share"], rows: D.langIndia.map(l => [l.label, l.value === 1 ? "<1%" : l.value + "%"]) })
    },
    r1a: {
      title: "One haplogroup, two branches", sub: "Y-chromosome R1a-M417 splits into Z282 (Europe) and Z93 (Central & South Asia).",
      src: "Book: Chapter 4 (2014 study: 96% of 1,693 European samples are Z282; 98.4% of 490 Central/South Asian samples are Z93).",
      draw: e => V.stacked(e, D.r1a, { label: "R1a subclades in Europe vs Asia" }),
      table: () => ({ head: ["Region", "Dominant subclade", "Share"], rows: [["Europe (1,693)", "R1a-Z282", "96%"], ["Central & South Asia (490)", "R1a-Z93", "98.4%"]] })
    },
    steppe: {
      title: "Steppe footprints, by the numbers", sub: "A scoreboard of the migration signal in different places.",
      src: "Book: Chapter 4 (Reich; Haak et al.; 2018 Genomic Formation paper).",
      draw: e => V.hbar(e, D.steppe.map((s, i) => ({ ...s, slot: 5 })), { max: 100, unit: "%", rowH: 54, label: "Steppe ancestry indicators" }),
      table: () => ({ head: ["Indicator", "Value"], rows: D.steppe.map(s => [s.label, s.value + "%"]) })
    },
    langCmp: {
      title: "Replacement vs. layering", sub: "Share of people speaking Indo-European (and Dravidian) — Europe vs India.",
      src: "Book: Chapter 4. In western Europe each migration largely replaced the earlier population; in South Asia replacement was far less.",
      draw: e => V.hbar(e, D.langCompare, { max: 100, unit: "%", label: "Indo-European speakers" }),
      table: () => ({ head: ["Group", "Share"], rows: D.langCompare.map(l => [l.label, l.value + "%"]) })
    },
    steppeWaves: {
      title: "Steppe timeline", sub: "From the Yamnaya to the Swat valley (years ago).",
      src: "Book: Chronology & Chapter 4. Rigveda dating (1400–1000 BCE) is one scholar’s dating cited in the book.",
      draw: e => V.gantt(e, D.steppeWaves, { scale: "linear", min: 2500, max: 5500, ticks: [5500, 5000, 4500, 4000, 3500, 3000, 2500], tickFmt: t => (t - 2000) + " BCE", label: "Steppe migration timeline", rowH: 50, fmtRange: r => `${fmt(r.start - 2000)} – ${fmt(r.end - 2000)} BCE` }),
      table: () => ({ head: ["Event", "Years ago"], rows: D.steppeWaves.map(s => [s.label, `${fmt(s.start)} – ${fmt(s.end)}`]) })
    },
    elevated: {
      title: "Where the Steppe signal is strongest", sub: "Ten of 140 present-day Indian groups tested showed ‘significantly elevated’ Steppe ancestry.",
      src: "Book: Epilogue (2018 paper). Strongest in groups of traditionally priestly status in the north (e.g. Brahmin_Tiwari, Brahmin_UP).",
      draw: e => V.waffle(e, { total: 140, filled: 10, cols: 14, slot: 5, big: "10 / 140", text: "population groups with significantly elevated Steppe ancestry.", label: "Groups with elevated Steppe ancestry" }),
      table: () => ({ head: ["Measure", "Value"], rows: [["Groups tested", 140], ["Significantly elevated Steppe ancestry", 10]] })
    },
    caste: {
      title: "From mixing to endogamy", sub: "Genetic mixing between groups was extensive until about 100 CE, then largely stopped.",
      src: "Book: Epilogue (2013 study: ‘Genetic Evidence for Recent Population Mixture in India’).",
      draw: e => V.gantt(e, D.caste, { scale: "linear", min: 0, max: 4400, ticks: [4000, 3000, 2000, 1000, 0], tickFmt: t => t > 2000 ? (t - 2000) + " BCE" : t === 2000 ? "1 CE" : (2000 - t) + " CE", label: "Mixing and endogamy", rowH: 52, fmtRange: r => r.note, nowLabel: "" }),
      table: () => ({ head: ["Era", "Dates"], rows: D.caste.map(c => [c.label, c.note]) })
    },
    lactase: {
      title: "Who can digest milk as adults?", sub: "Lactase-persistence mutation 13910T — identical to the European one — declines north-west → south-east.",
      src: "Book: Epilogue. About one in five Indians can digest milk into adulthood; the mutation arose in Europe about 7,500 years ago.",
      draw: e => V.gradient(e, { left: "N & W India: >40%", right: "Parts of NE: <1%", leftSub: "frequency of the gene", rightSub: "frequency of the gene", mid: "overall ≈ 1 in 5 Indians", midTip: "<b>≈20%</b><br>of Indians can digest milk into adulthood", label: "Lactase persistence gradient" }),
      table: () => ({ head: ["Region", "Lactase persistence"], rows: [["Parts of western & northern India", ">40%"], ["All India", "≈20%"], ["Parts of north-east India", "<1%"]] })
    },
    adivasi: {
      title: "‘Tribals’ are ‘us’", sub: "Adivasis form about 8% of the population — and carry First Indian ancestry like everyone else.",
      src: "Book: Epilogue.",
      draw: e => V.waffle(e, { total: 100, filled: 8, cols: 10, slot: 6, big: "≈8%", text: "of India’s population are adivasis — the foundational population of the Indian pizza.", label: "Adivasi share of population" }),
      table: () => ({ head: ["Group", "Share"], rows: [["Adivasi / ‘tribal’", "≈8%"]] })
    }
  };

  /* ---------- hydrate chart cards ---------- */
  const drawn = new Map();
  function hydrateCard(fig) {
    const name = fig.dataset.chart, C = CHARTS[name]; if (!C) return;
    fig.className = "card reveal"; fig.id = "c-" + name;
    fig.innerHTML = `<header><div><h4>${C.title}</h4><p class="sub">${C.sub}</p></div>
      <div class="seg" role="group" aria-label="View"><button aria-pressed="true" data-v="chart">Chart</button><button aria-pressed="false" data-v="table">Data</button></div></header>
      <div class="viz" role="group"></div><div class="tableview" hidden></div><footer>${C.src}</footer>`;
    const viz = $(".viz", fig), tv = $(".tableview", fig);
    const draw = () => { try { C.draw(viz); } catch (err) { console.error(name, err); } };
    drawn.set(fig, draw);
    const t = C.table(); tv.innerHTML = `<table><thead><tr>${t.head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    $$(".seg button", fig).forEach(b => b.addEventListener("click", () => {
      $$(".seg button", fig).forEach(x => x.setAttribute("aria-pressed", x === b));
      const isT = b.dataset.v === "table"; viz.hidden = isT; tv.hidden = !isT; if (!isT) draw();
    }));
    // draw up-front (29 small SVGs are cheap): lazy drawing changed card heights while
    // the reader was jumping around, which made nav links land in the wrong place
    draw();
  }
  $$("figure[data-chart]").forEach(hydrateCard);
  let rz, lastW = innerWidth; const redrawAll = () => drawn.forEach((d, f) => { if (f.isConnected && !$(".viz", f).hidden && $(".viz", f).childElementCount) d(); });
  // only width changes affect layout of the charts; ignore height changes (details opening, images loading)
  new ResizeObserver(() => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rz); rz = setTimeout(() => { redrawAll(); drawTimeline(); }, 160); }).observe(document.body);

  /* =========================================================
     IMAGE STRIPS + GALLERY + LIGHTBOX
     ========================================================= */
  const lb = $("#lightbox"); let lbList = IMG, lbIdx = 0;
  const thumb = (im, list) => {
    const b = el("button", { class: "thumb", type: "button", "aria-label": `Open image: ${im.title}`, "data-contain": im.kind === "Map" || im.kind === "Diagram" ? 1 : 0 });
    b.innerHTML = `<img loading="lazy" src="assets/img/${im.f}" alt="${im.title}"><span class="kind">${im.kind}</span><figcaption>${im.title}</figcaption>`;
    b.addEventListener("click", () => openLB(list, list.indexOf(im)));
    return b;
  };
  $$(".strip[data-imgs]").forEach(s => { const list = s.dataset.imgs.split(",").map(i => imgById[i.trim()]).filter(Boolean); list.forEach(im => s.append(thumb(im, list))); });

  function paintLB() {
    const im = lbList[lbIdx], c = CH.find(c => c.id === im.ch);
    $("#lbImg").src = `assets/img/${im.f}`; $("#lbImg").alt = im.title;
    $("#lbTitle").textContent = im.title; $("#lbCap").textContent = im.cap;
    $("#lbPill").textContent = `${im.kind} · ${c.short}`; $("#lbPill").style.background = `color-mix(in oklab, ${chColor(c.id)} 30%, var(--surface-3))`;
    $("#lbCount").textContent = `${lbIdx + 1} / ${lbList.length}`;
    $("#lbGo").onclick = () => { lb.close(); document.getElementById(c.id).scrollIntoView(); };
    const site = (window.SITES || []).find(s => s.img === im.id);
    $("#lbMap").hidden = !site; $("#lbMap").onclick = () => { lb.close(); showOnMap(site.id); };
    // preload neighbours
    [1, -1].forEach(d => { const n = lbList[(lbIdx + d + lbList.length) % lbList.length]; if (n) new Image().src = `assets/img/${n.f}`; });
  }
  function openLB(list, i) { lbList = list; lbIdx = i; paintLB(); if (!lb.open) lb.showModal(); }
  const step = d => vt(() => { lbIdx = (lbIdx + d + lbList.length) % lbList.length; paintLB(); });
  $("#lbPrev").onclick = () => step(-1); $("#lbNext").onclick = () => step(1);
  $("#lbClose").onclick = () => lb.close();
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  let sx = 0; lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); });

  // gallery
  const gal = $("#masonry"), galChips = $("#galChips"), galKind = $("#galKind"), galQ = $("#galQ");
  let galCh = "all";
  const galItems = IMG.map(im => { const b = thumb(im, IMG); b.dataset.ch = im.ch; b.dataset.kind = im.kind; b.dataset.q = (im.title + " " + im.cap + " " + im.tags.join(" ")).toLowerCase(); b.removeAttribute("data-contain"); gal.append(b); return b; });
  galChips.innerHTML = [["all", "All", "var(--text)"], ...CH.map(c => [c.id, c.short, chColor(c.id)])].map(([id, l, c]) => `<button class="chip" style="--dot:${c}" aria-pressed="${id === "all"}" data-ch="${id}"><i></i>${l}</button>`).join("");
  [...new Set(IMG.map(i => i.kind))].forEach(k => galKind.append(el("option", { value: k }, k)));
  function filterGal() {
    const q = galQ.value.trim().toLowerCase(), k = galKind.value; let n = 0;
    vt(() => { galItems.forEach(b => { const ok = (galCh === "all" || b.dataset.ch === galCh) && (k === "all" || b.dataset.kind === k) && (!q || b.dataset.q.includes(q)); b.hidden = !ok; if (ok) n++; }); $("#galCount").textContent = `${n} of ${IMG.length} images`; });
  }
  galChips.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; galCh = b.dataset.ch; $$("button", galChips).forEach(x => x.setAttribute("aria-pressed", x === b)); filterGal(); });
  galKind.addEventListener("change", filterGal); galQ.addEventListener("input", filterGal); filterGal();
  $("#galPlay").addEventListener("click", () => { const vis = galItems.filter(b => !b.hidden).map(b => IMG[galItems.indexOf(b)]); if (vis.length) openLB(vis, 0); });

  /* =========================================================
     MASTER TIMELINE
     ========================================================= */
  const MODES = {
    deep: { label: "Deep time · 400,000 years (log scale)", min: 1200, max: 420000, log: true, width: 1500, ticks: [3e5, 1e5, 3e4, 1e4, 3e3] },
    holo: { label: "Holocene · 15,000 years (linear)", min: 0, max: 15000, log: false, width: 1900, ticks: [15000, 12000, 9000, 6000, 3000, 0] },
    bronze: { label: "Bronze Age to caste · 8,000 years ago → 0 (linear)", min: 0, max: 8000, log: false, width: 1800, ticks: [8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 0] }
  };
  let tlMode = "deep", tlSel = null; const tlOn = new Set(CH.map(c => c.id));
  const tl = $("#tl"), tlDetail = $("#tlDetail");
  const sortedEV = [...EV].sort((a, b) => b.ya - a.ya);
  $("#tlModes").innerHTML = Object.entries(MODES).map(([k, m]) => `<button aria-pressed="${k === tlMode}" data-m="${k}">${m.label.split(" · ")[0]}</button>`).join("");
  $("#tlModes").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; tlMode = b.dataset.m; $$("#tlModes button").forEach(x => x.setAttribute("aria-pressed", x === b)); drawTimeline(); syncUrl(); });
  $("#tlChips").innerHTML = CH.map(c => `<button class="chip" style="--dot:${chColor(c.id)}" aria-pressed="true" data-ch="${c.id}"><i></i>${c.short}</button>`).join("");
  $("#tlChips").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); on ? tlOn.add(b.dataset.ch) : tlOn.delete(b.dataset.ch); drawTimeline(); syncUrl(); });

  function drawTimeline() {
    const m = MODES[tlMode], NS = "http://www.w3.org/2000/svg", padL = 28, padR = 40, laneH = 32, top = 26, axisH = 34;
    const W = Math.max(m.width, tl.clientWidth || 800), bw = W - padL - padR;
    const X = ya => { const v = Math.min(Math.max(ya, m.min), m.max); return padL + (m.log ? (Math.log10(m.max) - Math.log10(Math.max(v, m.min))) / (Math.log10(m.max) - Math.log10(m.min)) : 1 - (v - m.min) / (m.max - m.min)) * bw; };
    const evs = sortedEV.filter(e => tlOn.has(e.ch) && e.ya <= m.max && (e.end ?? e.ya) >= m.min - 1);
    const lanes = []; const placed = evs.map(e => {
      const xl = X(e.ya), xr = e.end != null ? X(e.end) : xl, labW = e.t.length * 6.6 + 18, ext0 = Math.min(xl, xr) - 8, ext1 = Math.max(xl, xr) + 12 + labW;
      let l = lanes.findIndex(end => end < ext0); if (l < 0) { l = lanes.length; lanes.push(0); } lanes[l] = ext1; return { e, xl, xr, l };
    });
    const H = top + Math.max(lanes.length, 4) * laneH + axisH;
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("class", "svgc"); svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Master timeline. Use Tab to move between events.");
    const mk = (t, a, c) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); if (c != null) n.textContent = c; return n; };
    // era bands behind the events
    const BANDS = [[71000, 57000, "MIS 4 · cold & dry", "var(--c-ch1)"], [11700, 0, "Holocene", "var(--c-ch2)"], [4600, 3900, "Mature Harappan", "var(--c-ch3)"], [4000, 3000, "Steppe waves", "var(--c-ch4)"], [4200, 1900, "Era of mixing", "var(--c-epi)"]];
    BANDS.forEach(([a, b, l, c], i) => { if (a < m.min || b > m.max) return; const x1 = X(a), x2 = X(b); const bw = Math.abs(x2 - x1); if (bw < 8) return; svg.append(mk("rect", { x: Math.min(x1, x2), y: top - 18, width: bw, height: H - axisH - top + 22, fill: c, opacity: .07, rx: 6 })); if (bw > l.length * 5.6 + 10) svg.append(mk("text", { x: Math.min(x1, x2) + 6, y: H - axisH - 6 - (i % 2) * 12, class: "t-mut small", style: `fill:${c}` }, l)); });
    m.ticks.forEach(t => { const x = X(t); svg.append(mk("line", { x1: x, x2: x, y1: top - 8, y2: H - axisH + 4, class: "gl" }), mk("text", { x, y: H - 10, class: "t-mut", "text-anchor": "middle" }, tlMode === "deep" ? (t >= 1000 ? fmt(t) : t) + " ya" : t > 2000 ? (t - 2000) + " BCE" : t === 2000 ? "1 CE" : t === 0 ? "today" : (2000 - t) + " CE")); });
    if (tlMode !== "deep") svg.append(mk("line", { x1: X(2000), x2: X(2000), y1: top - 8, y2: H - axisH + 4, stroke: "var(--text-3)", "stroke-width": 1.5, opacity: .6 }), mk("text", { x: X(2000) + 4, y: top - 12, class: "t-mut" }, "BCE ◂ ▸ CE"));
    placed.forEach(({ e, xl, xr, l }, i) => {
      const y = top + l * laneH + 12, c = chColor(e.ch), g = mk("g", { class: "tl-ev", tabindex: 0, role: "button", "aria-label": `${e.t}, ${whenLabel(e.ya, e.end)}`, "data-i": EV.indexOf(e), style: "cursor:pointer" });
      if (e.end != null && Math.abs(xr - xl) > 6) g.append(mk("rect", { x: Math.min(xl, xr), y: y - 5, width: Math.abs(xr - xl), height: 10, rx: 5, fill: c, opacity: .85 }));
      else g.append(mk("circle", { cx: xl, cy: y, r: 6.5, fill: c, class: "ring" }));
      const sel = EV.indexOf(e) === tlSel; if (sel) g.append(mk("circle", { cx: (xl + xr) / 2, cy: y, r: 12, fill: "none", stroke: c, "stroke-width": 2 }));
      const lx = Math.max(xl, xr) + 12; g.append(mk("text", { x: lx, y: y + 4, class: sel ? "t-pri t-b" : "t-sec" }, e.t));
      g.append(mk("rect", { x: Math.min(xl, xr) - 8, y: y - 14, width: Math.abs(xr - xl) + 22 + e.t.length * 6.6, height: 28, fill: "transparent" }));
      g.addEventListener("click", () => selectEvent(EV.indexOf(e), false)); g.addEventListener("keydown", k => { if (k.key === "Enter" || k.key === " ") { k.preventDefault(); selectEvent(EV.indexOf(e), false); } });
      V.tip.bind(g, `<b>${e.t}</b><br>${whenLabel(e.ya, e.end)}`); svg.append(g);
    });
    tl.replaceChildren(svg);
    $("#tlCount").textContent = `${evs.length} of ${EV.length} events in view`;
    if (tlSel === null) selectEvent(EV.indexOf(sortedEV.find(e => e.t.startsWith("Successful Out"))), false, true);
  }
  function selectEvent(i, scroll, quiet) {
    tlSel = i; const e = EV[i], c = CH.find(c => c.id === e.ch);
    tlDetail.style.setProperty("--accent", chColor(e.ch));
    const loc = EVENT_LOC[e.t];
    tlDetail.innerHTML = `<div class="when">${whenLabel(e.ya, e.end)}</div><div><h4>${e.t}</h4><p>${e.d}</p><p class="src">${c.n} · ${c.title} — book source: ${e.s}</p>${loc ? `<button class="map-link" id="tlMap" type="button">◎ Show on the map</button>` : ""}</div><div class="seg"><button id="tlPrev" aria-label="Previous event">←</button><button id="tlNext" aria-label="Next event">→</button></div>`;
    if (loc) $("#tlMap").onclick = () => loc.startsWith("story:") ? goStory(loc.slice(6), true) : showOnMap(loc, e.ya);
    const idx = sortedEV.indexOf(e);
    $("#tlPrev").onclick = () => selectEvent(EV.indexOf(sortedEV[Math.max(0, idx - 1)]), true);
    $("#tlNext").onclick = () => selectEvent(EV.indexOf(sortedEV[Math.min(sortedEV.length - 1, idx + 1)]), true);
    if (!quiet) { const prev = tl.scrollLeft; drawTimeline_keep(prev); }
    if (scroll || quiet) { const g = $(`.tl-ev[data-i="${i}"]`, tl); if (g) { const r = g.getBoundingClientRect(), s = tl.getBoundingClientRect(); tl.scrollTo({ left: tl.scrollLeft + r.left - s.left - s.width / 3, behavior: quiet ? "auto" : "smooth" }); } }
  }
  function drawTimeline_keep(left) { drawTimeline(); tl.scrollLeft = left; }
  tl.addEventListener("keydown", k => {
    if (k.key !== "ArrowRight" && k.key !== "ArrowLeft") return; k.preventDefault();
    const vis = sortedEV.filter(e => tlOn.has(e.ch)), cur = vis.indexOf(EV[tlSel]), nx = vis[Math.max(0, Math.min(vis.length - 1, cur + (k.key === "ArrowRight" ? 1 : -1)))];
    if (nx) { selectEvent(EV.indexOf(nx), true); $(`.tl-ev[data-i="${EV.indexOf(nx)}"]`, tl)?.focus({ preventScroll: true }); }
  });
  // drag-to-scroll
  let drag = null;
  tl.addEventListener("pointerdown", e => { if (e.target.closest(".tl-ev")) return; drag = { x: e.clientX, l: tl.scrollLeft }; tl.setPointerCapture(e.pointerId); tl.style.cursor = "grabbing"; });
  tl.addEventListener("pointermove", e => { if (drag) tl.scrollLeft = drag.l - (e.clientX - drag.x); });
  tl.addEventListener("pointerup", () => { drag = null; tl.style.cursor = ""; });
  tl.addEventListener("pointercancel", () => { drag = null; tl.style.cursor = ""; });

  /* chapter track: the book’s five chapters on one line (click a chapter to jump) */
  const ctTrack = $("#ctTrack");
  if (ctTrack) {
    const chapterWhen = c => {
      const one = y => y >= 12000 ? fmt(y) + " ya" : y > 2000 ? fmt(y - 2000) + " BCE" : y === 2000 ? "1 CE" : fmt(2000 - y) + " CE";
      return c.to === 0 ? `${one(c.from)} → present` : `${one(c.from)} – ${one(c.to)}`;
    };
    ctTrack.innerHTML = CH.map(c => `<button class="ct-chip" type="button" data-c="${c.id}" aria-label="Jump to chapter ${c.n} ${c.title}"><span class="n">${c.n}</span><b>${c.title}</b><span class="tag">${c.tag}</span><span class="when">${chapterWhen(c)}</span></button>`).join("");
    ctTrack.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      $$(".ct-chip", ctTrack).forEach(x => x.setAttribute("aria-current", x === b));
      location.hash = "#" + b.dataset.c;
    });
    const spy2 = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const chip = $(`.ct-chip[data-c="${e.target.id}"]`, ctTrack);
      if (chip) $$(".ct-chip", ctTrack).forEach(x => x.setAttribute("aria-current", x === chip));
    }), { rootMargin: "-10% 0px -10% 0px", threshold: .4 });
    CH.forEach(c => { const s = document.getElementById(c.id); if (s) spy2.observe(s); });
  }

  /* =========================================================
     JOURNEY (schematic Out-of-Africa scrubber)
     ========================================================= */
  const STEPS = [
    [300000, "Homo sapiens emerge in Africa", "The oldest modern-human remains (Jebel Irhoud, Morocco) are ~300,000 years old. Modern humanity is a slow, multi-region story.", [-20, 5, 62, 42], [], ["jebel-irhoud"]],
    [180000, "First forays into the Levant", "A fossil at Misliya, Israel (~180,000 years) is the earliest modern human outside Africa — but these early groups left no detectable lineage today.", [-5, 0, 62, 42], ["foray-levant"], ["misliya", "skhul"]],
    [88000, "Arabia’s green window", "A finger fossil at Al Wusta shows modern humans in a then-lake-rich Arabia ~88,000 years ago. Another dead end in the genetic record.", [10, 0, 70, 40], ["foray-levant", "foray-arabia"], ["al-wusta", "misliya"]],
    [70000, "The successful exodus", "Geneticists date the OoA that gave rise to all non-Africans to ~70,000 years ago, likely by the Southern Route across Bab el Mandeb.", [22, -2, 82, 34], ["ooa-exit"], ["bab"]],
    [65000, "India — and Australia", "Migrants reach India about 65,000 years ago and quickly stream on to south-east Asia and Australia, meeting archaic humans on the way.", [32, -32, 150, 36], ["ooa-exit", "ooa-india", "ooa-interior", "ooa-sea", "ooa-aus"], ["jwalapuram", "lida-ajer", "australia"]],
    [60000, "East Asia", "Descendants spread across the subcontinent into south-east Asia and east Asia.", [40, -32, 150, 50], ["ooa-exit", "ooa-india", "ooa-interior", "ooa-sea", "ooa-aus", "ooa-east"], []],
    [45000, "Central Asia and Europe", "Between 60,000 and 40,000 years ago descendants populate central Asia and Europe; Europe is settled some 25,000 years after Australia.", [-15, -32, 152, 62], ["ooa-exit", "ooa-india", "ooa-interior", "ooa-sea", "ooa-aus", "ooa-east", "ooa-central", "ooa-europe"], []],
    [16000, "The Americas", "Modern humans cross Beringia into the Americas around 16,000 years ago, the last major continent to be settled.", [-15, -36, 170, 68], ["ooa-exit", "ooa-india", "ooa-interior", "ooa-sea", "ooa-aus", "ooa-east", "ooa-central", "ooa-europe", "ooa-americas"], []]
  ];
  let jStep = 4, jTimer = null, jMap = null;
  const jHost = $("#jmap");
  const OOA = window.ROUTES.filter(r => r.kind === "ooa" || r.kind === "dead");
  function drawJourney() {
    if (!jHost) return;
    const [ya, title, text, view, routes, sites] = STEPS[jStep];
    if (!jMap) jMap = AtlasMap.create(jHost, { view, routes: OOA, label: "Map of the Out of Africa migration", layers: { borders: false, rivers: false }, onSite: s => s && openSite(s, true) });
    jMap.setState({ t: ya, routes, sites }); jMap.fly(view, 1100);
    $("#jYa").textContent = fmt(ya); $("#jT").textContent = title; $("#jD").textContent = text;
    $("#jRange").value = jStep; $$("#jSteps button").forEach((b, i) => b.setAttribute("aria-pressed", i === jStep));
  }
  if (jHost) {
    $("#jRange").max = STEPS.length - 1;
    $("#jSteps").innerHTML = STEPS.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="false">${s[0] >= 1000 ? Math.round(s[0] / 1000) + "k" : s[0]}</button>`).join("");
    $("#jSteps").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { stopJ(); jStep = +b.dataset.i; drawJourney(); } });
    $("#jRange").addEventListener("input", e => { stopJ(); jStep = +e.target.value; drawJourney(); });
    const stopJ = () => { clearInterval(jTimer); jTimer = null; $("#jPlay").textContent = "▶ Play"; };
    $("#jPlay").addEventListener("click", () => { if (jTimer) return stopJ(); $("#jPlay").textContent = "❚❚ Pause"; if (jStep >= STEPS.length - 1) jStep = -1; const adv = () => { jStep++; drawJourney(); if (jStep >= STEPS.length - 1) stopJ(); }; adv(); jTimer = setInterval(adv, 3200); });
    // fill the text now (stable layout); build the map lazily when it nears the viewport
    $("#jYa").textContent = fmt(STEPS[jStep][0]); $("#jT").textContent = STEPS[jStep][1]; $("#jD").textContent = STEPS[jStep][2];
    $$("#jSteps button").forEach((b, i) => b.setAttribute("aria-pressed", i === jStep)); $("#jRange").value = jStep;
    new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { ob.disconnect(); drawJourney(); } }, { rootMargin: "400px" }).observe(jHost);
  }

  /* =========================================================
     GENETICS PRIMER (zoom-in stepper)
     ========================================================= */
  const PRIMER = [
    { id: "dna-cell", t: "1 · The cell", d: "Every cell has a nucleus holding most of your DNA — and mitochondria, small power plants with their own tiny genome." },
    { id: "dna-chromosome", t: "2 · Chromosomes & DNA", d: "DNA is written in four chemicals — A, C, G, T. Two people’s genomes differ by only ~0.1%, which still means about three million differences. Men also carry a Y-chromosome passed father to son." },
    { id: "dna-mito", t: "3 · Mitochondrial DNA", d: "mtDNA passes from mother to daughter in an unbroken chain. Branches of the maternal family tree are haplogroups; people sharing one share a female ancestor from when it arose." }
  ];
  const pr = $("#primer");
  if (pr) {
    pr.innerHTML = `<div class="seg" id="prTabs">${PRIMER.map((p, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${p.t.split(" · ")[0]}</button>`).join("")}</div>
      <div class="pr-body"><img id="prImg" alt=""><div><h4 id="prT"></h4><p id="prD"></p></div></div>`;
    const paint = i => vt(() => { const p = PRIMER[i]; $("#prImg").src = `assets/img/${p.id}.jpg`; $("#prImg").alt = imgById[p.id].title; $("#prT").textContent = p.t; $("#prD").textContent = p.d; $$("#prTabs button").forEach((b, j) => b.setAttribute("aria-pressed", i === j)); });
    $("#prTabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) paint(+b.dataset.i); }); paint(0);
  }

  /* =========================================================
     INDIAN PIZZA
     ========================================================= */
  const pz = $("#pizza");
  if (pz) {
    const L = D.pizza; let sel = 0;
    const R = [190, 158, 118], dots = (n, r, seed) => Array.from({ length: n }, (_, i) => { const a = (i / n) * 6.283 + seed, rr = r * (0.55 + ((i * 37 + seed * 11) % 10) / 24); return [200 + rr * Math.cos(a), 200 + rr * Math.sin(a)]; });
    const draw = () => {
      const NS = "http://www.w3.org/2000/svg", mk = (t, a) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };
      const s = mk("svg", { viewBox: "0 0 400 400", class: "svgc", role: "group", "aria-label": "The Indian pizza: layers of ancestry" });
      const layer = (i, node) => { node.setAttribute("class", "layer"); node.setAttribute("tabindex", 0); node.setAttribute("role", "button"); node.setAttribute("aria-pressed", sel === i); node.setAttribute("aria-label", L[i].title); node.style.opacity = sel === i ? 1 : .78; node.addEventListener("click", () => { sel = i; draw(); panel(); }); node.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel = i; draw(); panel(); } }); return node; };
      const base = layer(0, mk("circle", { cx: 200, cy: 200, r: R[0], fill: V.entCol("first") })), sauce = layer(1, mk("circle", { cx: 200, cy: 200, r: R[1], fill: V.entCol("iran") })), cheese = layer(2, mk("circle", { cx: 200, cy: 200, r: R[2], fill: V.entCol("steppe") }));
      s.append(base, sauce, cheese);
      const top = layer(3, mk("g", {})); dots(11, 150, 1).forEach(([x, y]) => top.append(mk("circle", { cx: x, cy: y, r: 9, fill: V.entCol("seasia"), stroke: "var(--surface-2)", "stroke-width": 2 }))); s.append(top);
      const gar = layer(4, mk("g", {})); dots(16, 110, 2).forEach(([x, y]) => gar.append(mk("circle", { cx: x, cy: y, r: 4, fill: "var(--gray)" }))); s.append(gar);
      pz.querySelector(".pz-svg").replaceChildren(s);
    };
    const panel = () => { const l = L[sel]; $(".pizza-panel", pz).innerHTML = `<div class="meta"><span>${l.when}</span><span>${l.range}</span></div><h4>${l.title}</h4><p>${l.text}</p>`; $$(".pz-tabs button", pz).forEach((b, i) => b.setAttribute("aria-pressed", i === sel)); };
    pz.innerHTML = `<div class="pz-svg"></div><div><div class="seg pz-tabs" style="flex-wrap:wrap">${L.map((l, i) => `<button data-i="${i}" aria-pressed="false">${l.title.split(" — ")[0]}</button>`).join("")}</div><div class="pizza-panel" style="margin-top:.8rem" aria-live="polite"></div><p class="note">Illustrative: ring sizes are a metaphor for the order of arrival, not exact proportions. Ranges are those given in the book.</p></div>`;
    $(".pz-tabs", pz).addEventListener("click", e => { const b = e.target.closest("button"); if (b) { sel = +b.dataset.i; draw(); panel(); } });
    draw(); panel();
  }

  /* =========================================================
     RESEARCH TIMELINE
     ========================================================= */
  $("#research-tl").innerHTML = window.RESEARCH.map(r => `<div class="it reveal"><b class="y">${Math.floor(r.y)}</b><h4>${r.t}</h4><p>${r.d}</p></div>`).join("");

  /* =========================================================
     HISTORY ATLAS (geographic, story-driven)
     ========================================================= */
  const ST = window.STORIES, SITES = window.SITES, RK = window.ROUTE_KINDS;
  const T_MAX = 300000, T_MIN = 1500;
  const u2ya = u => Math.exp(Math.log(T_MAX) + (Math.log(T_MIN) - Math.log(T_MAX)) * (u / 1000));
  const ya2u = ya => Math.round(1000 * (Math.log(T_MAX) - Math.log(Math.min(T_MAX, Math.max(T_MIN, ya)))) / (Math.log(T_MAX) - Math.log(T_MIN)));
  const eraOf = ya => ya > 130000 ? "Middle Palaeolithic" : ya > 45000 ? "Out of Africa" : ya > 11700 ? "Late Pleistocene" : ya > 7500 ? "Early Holocene: first farmers" : ya > 4600 ? "Early Harappan" : ya > 3900 ? "Mature Harappan" : ya > 3000 ? "Late Harappan & Steppe waves" : ya > 2100 ? "Second urbanization" : "Mauryas → endogamy";
  const EVENT_LOC = {
    "Earliest Homo sapiens remains": "jebel-irhoud", "Hathnora cranium, Narmada valley": "hathnora", "Early tools at Attirampakkam (Middle Palaeolithic)": "attirampakkam",
    "Misliya, Israel": "misliya", "Skhul–Qafzeh humans, Israel": "skhul", "Al Wusta, Arabia": "al-wusta", "Jwalapuram tools under Toba ash": "jwalapuram",
    "Toba supervolcano erupts": "toba", "Successful Out of Africa": "story:ooa", "OoA migrants reach India and Australia": "story:ooa",
    "Microlithic technology; First Indians multiply": "central-india", "Modern humans reach Europe": "story:world", "Modern humans reach the Americas": "story:world",
    "Archaic Homo likely vanish in India": "story:first", "Wild wheat and rye harvested on the Euphrates": "euphrates", "Domesticated emmer and einkorn": "anatolia",
    "Mehrgarh founded; rice at Lahuradewa": "mehrgarh", "Zagros farmers mix with First Indians": "story:zagros", "Pottery arrives at Mehrgarh": "mehrgarh",
    "Early Harappan era": "rakhigarhi", "First script-like marks at Harappa": "harappa", "Yamnaya burst upon Europe": "story:yamnaya", "Mature Harappan period": "story:harappa",
    "BMAC": "bmac", "Steppe pastoralists move south": "story:steppe", "Waves of Steppe migrants enter South Asia": "story:steppe", "Austroasiatic wave from China/SE Asia": "story:toppings",
    "Late Harappan: decline": "dholavira", "Swat valley samples": "swat", "Rigveda composed (one scholarly dating)": "punjab-vedic", "Ganga-plain urbanization begins": "magadha",
    "The Mauryan empire": "magadha", "Era of extensive mixing": "story:magadha", "Endogamy sets in: the caste ‘closing’": "story:magadha", "Farming spreads across India": "lahuradewa"
  };
  let aMap = null, aStory = 0, aFree = false, aTimer = null;
  const aHost = $("#atlasMap"), aRange = $("#atlasRange"), storyCard = $("#storyCard"), siteCard = $("#siteCard");
  const LAYERS = [["routes", "Routes"], ["sites", "Places"], ["rivers", "Rivers"], ["extents", "Harappan extent"], ["borders", "Modern borders"], ["labels", "Labels"]];

  function ensureAtlas() {
    if (aMap) return aMap;
    aMap = AtlasMap.create(aHost, { view: ST[0].view, label: "History atlas of the Indian subcontinent and its migrations", onSite: s => s ? openSite(s) : closeSite() });
    return aMap;
  }
  const roundYa = ya => ya > 12000 ? Math.round(ya / 1000) * 1000 : ya > 4000 ? Math.round(ya / 100) * 100 : Math.round(ya / 50) * 50;
  function paintBadge(ya) { $("#atlasYa").textContent = whenLabel(roundYa(ya)); $("#atlasEra").textContent = eraOf(ya); }
  function goStory(i, scroll) {
    if (typeof i === "string") i = ST.findIndex(s => s.id === i);
    if (i < 0) return;
    aStory = i; aFree = false; const st = ST[i], m = ensureAtlas();
    m.setState({ t: st.t, routes: st.routes, sites: st.sites, selected: null }); m.fly(st.view, 1300);
    aRange.value = ya2u(st.t); paintBadge(st.t); paintStory(); closeSite(); syncUrl();
    if (scroll) $("#atlas").scrollIntoView();
  }
  function routeChips(ids) { const kinds = [...new Set(ids.map(id => window.ROUTES.find(r => r.id === id)?.kind).filter(Boolean))]; return kinds.map(k => `<span class="rk" style="--rc:${RK[k].slot ? `var(--s${RK[k].slot})` : "var(--gray)"}"><i></i>${RK[k].n}</span>`).join(""); }
  function paintStory() {
    $$("#storySteps button").forEach((b, j) => { const on = !aFree && j === aStory; b.setAttribute("aria-selected", on); if (on) { const box = b.parentElement; if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: b.offsetLeft - box.clientWidth / 2 + b.offsetWidth / 2, behavior: "smooth" }); } });
    if (aFree) {
      const ya = u2ya(+aRange.value), near = sortedEV.filter(e => Math.abs(e.ya - ya) / ya < .35 || (e.end != null && e.ya >= ya && e.end <= ya)).slice(0, 4);
      const nearest = ST.reduce((b, s, j) => Math.abs(Math.log(s.t / ya)) < Math.abs(Math.log(ST[b].t / ya)) ? j : b, 0);
      storyCard.style.setProperty("--accent", "var(--text-3)");
      storyCard.innerHTML = `<span class="kicker">Free exploration</span><h3>${eraOf(ya)}</h3><p>Places and routes active around <b>${whenLabel(roundYa(ya))}</b> are highlighted; earlier ones fade.</p>
        ${near.length ? `<h5>Around this time</h5><ul class="near">${near.map(e => `<li><button type="button" data-ev="${EV.indexOf(e)}"><b>${whenLabel(e.ya, e.end)}</b>${e.t}</button></li>`).join("")}</ul>` : ""}
        <div class="story-nav"><button class="btn sm" type="button" data-go="${nearest}">Resume tour at “${ST[nearest].title}” →</button></div>`;
      return;
    }
    const st = ST[aStory];
    storyCard.style.setProperty("--accent", chColor(st.ch));
    storyCard.innerHTML = `<span class="kicker">Stop ${aStory + 1} of ${ST.length} · ${st.kicker}</span><h3>${st.title}</h3><p>${st.text}</p>
      ${st.routes.length ? `<div class="rks">${routeChips(st.routes)}</div>` : ""}
      ${st.sites.length ? `<h5>Places</h5><div class="place-chips">${st.sites.map(id => { const s = SITES.find(x => x.id === id); return s ? `<button type="button" data-site="${id}" style="--sc:${chColor(s.ch)}"><i></i>${s.n}</button>` : ""; }).join("")}</div>` : ""}
      <div class="story-nav"><button class="btn sm" type="button" data-step="-1" ${aStory ? "" : "disabled"} aria-label="Previous stop">←</button><button class="btn sm primary" type="button" data-step="1" ${aStory < ST.length - 1 ? "" : "disabled"}>Next stop →</button><a class="btn sm ghost" href="#${st.ch}">Read chapter ↗</a></div>`;
  }
  function openSite(s, fromJourney) {
    if (fromJourney) { showOnMap(s.id); return; }
    const im = s.img && imgById[s.img];
    siteCard.style.setProperty("--accent", chColor(s.ch)); siteCard.hidden = false;
    siteCard.innerHTML = `${im ? `<button class="sc-img" type="button" aria-label="Enlarge picture: ${im.title}"><img src="assets/img/${im.f}" alt="${im.title}" loading="lazy"></button>` : ""}
      <div class="sc-body"><span class="kicker">${s.where} · ${AtlasMap.whenRange(s.from, s.to)}</span><h4>${s.n}</h4><p>${s.d}</p>
      <div class="story-nav"><button class="btn sm" type="button" data-zoom="${s.id}">Zoom here</button><a class="btn sm ghost" href="#${s.ch}">${CH.find(c => c.id === s.ch).short} ↗</a><button class="icon-btn sm" type="button" data-close aria-label="Close place details">✕</button></div></div>`;
    if (im) $(".sc-img", siteCard).onclick = () => openLB([im], 0);
  }
  function closeSite() { siteCard.hidden = true; aMap && aMap.state.selected && aMap.select(null); }
  function showOnMap(siteId, ya) {
    const s = SITES.find(x => x.id === siteId); if (!s) return;
    const m = ensureAtlas(); stopTour();
    $("#atlas").scrollIntoView();
    const t = ya != null ? ya : (s.from + s.to) / 2;
    aFree = true; m.setState({ t, routes: null, sites: null }); aRange.value = ya2u(t); paintBadge(t); paintStory();
    setTimeout(() => { m.focusSite(siteId); openSite(s); }, 350);
  }
  function stopTour() { clearInterval(aTimer); aTimer = null; $("#atlasPlay").textContent = "▶"; $("#atlasPlay").setAttribute("aria-label", "Play the guided tour"); }

  /* ---------- state persistence: URL deep links + bookmarks ---------- */
  function syncUrl() {
    const p = new URLSearchParams(location.search);
    if (tlMode) p.set("tl", tlMode);
    const allOn = CH.every(c => tlOn.has(c.id));
    if (allOn) p.delete("tlch"); else p.set("tlch", [...tlOn].join(","));
    if (aFree && aMap) { p.delete("story"); p.set("t", aRange.value); }
    else if (aMap && aStory > 0 && !aFree) p.set("story", ST[aStory]?.id || "");
    else { p.delete("t"); p.delete("story"); }
    const hash = location.hash;
    try { history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "") + hash); } catch { /* restricted URLs (e.g. file://) */ }
  }
  const snapshot = () => {
    const p = new URLSearchParams(location.search);
    if (tlMode) p.set("tl", tlMode);
    const allOn = CH.every(c => tlOn.has(c.id));
    if (!allOn) p.set("tlch", [...tlOn].join(",")); else p.delete("tlch");
    if (aFree && aMap) { p.delete("story"); p.set("t", aRange.value); }
    else if (aMap && aStory > 0 && !aFree) p.set("story", ST[aStory]?.id || "");
    else { p.delete("t"); p.delete("story"); }
    return p.toString();
  };
  function applyDeepLink() {
    const p = new URLSearchParams(location.search);
    if (["deep", "holo", "bronze"].includes(p.get("tl"))) tlMode = p.get("tl");
    const chs = (p.get("tlch") || "").split(",").map(s => s.trim()).filter(Boolean);
    if (chs.length) { tlOn.clear(); chs.forEach(id => tlOn.add(id)); }
    const storyId = p.get("story");
    if (storyId) { const i = ST.findIndex(s => s.id === storyId); if (i >= 0) goStory(i, true); }
    else if (p.get("t") != null) {
      const n = +p.get("t"); const u = Number.isFinite(n) ? Math.min(1000, Math.max(0, n)) : 500;
      const ya = u2ya(u); aFree = true;
      const m = ensureAtlas(); m.setState({ t: ya, routes: null, sites: null });
      aRange.value = String(u); paintBadge(ya); paintStory();
    }
    const ch = p.get("ch");
    if (ch && document.getElementById(ch)) document.getElementById(ch).scrollIntoView({ behavior: "smooth" });
  }
  /* bookmarks */
  const bm = $("#bookmarkBtn"), bmMenu = $("#bookmarks");
  const BM = "ei-bookmarks";
  const loadBMs = () => { try { const l = JSON.parse(store.get(BM) || "[]"); return Array.isArray(l) ? l.map(b => ({ label: String(b.label || "Bookmark"), snap: String(b.snap || "") })) : []; } catch { return []; } };
  const saveBM = snap => { const label = (prompt("Bookmark name", snap || "Bookmark") || "").trim() || snap || "Bookmark"; loadBMs().push({ label, snap }); store.set(BM, JSON.stringify(loadBMs())); paintBMs(); };
  const jumpBM = snap => { if (!snap) return; try { history.pushState(null, "", location.pathname + (snap ? "?" + snap : "")); } catch { return; } applyDeepLink(); bmMenu.close(); };
  const paintBMs = () => {
    const list = $("#bmList");
    list.replaceChildren(...loadBMs().map((b, i) => {
      const d = el("div", { class: "bm-item" });
      const jb = el("button", { class: "bm-jump", type: "button", "aria-label": `Jump to bookmark ${b.label}` }, b.label);
      jb.addEventListener("click", () => jumpBM(b.snap));
      const xb = el("button", { class: "bm-del", type: "button", "aria-label": `Delete bookmark ${b.label}` }, "✕");
      xb.addEventListener("click", () => { const l = loadBMs(); l.splice(i, 1); store.set(BM, JSON.stringify(l)); paintBMs(); });
      d.append(jb, xb); return d;
    }));
    if (!list.children.length) list.replaceChildren(el("p", { class: "bm-empty" }, "No bookmarks yet."));
  };
  bmMenu.addEventListener("click", e => { if (e.target === bmMenu) bmMenu.close(); });
  bmMenu.addEventListener("open", () => paintBMs());
  bm.addEventListener("click", () => (bmMenu.open ? bmMenu.close() : bmMenu.showModal()));
  if (aHost) {
    applyDeepLink();
    $("#storySteps").innerHTML = ST.map((st, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="false" style="--accent:${chColor(st.ch)}"><span>${String(i + 1).padStart(2, "0")}</span>${st.title}</button>`).join("");
    $("#storySteps").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { stopTour(); goStory(+b.dataset.i); } });
    storyCard.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.step) { stopTour(); goStory(Math.max(0, Math.min(ST.length - 1, aStory + +b.dataset.step))); }
      else if (b.dataset.go) goStory(+b.dataset.go);
      else if (b.dataset.site) { const s = SITES.find(x => x.id === b.dataset.site); aMap.focusSite(s.id); openSite(s); }
      else if (b.dataset.ev) { const i = +b.dataset.ev; $("#timeline").scrollIntoView(); setTimeout(() => selectEvent(i, true), 350); }
    });
    siteCard.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.zoom) aMap.focusSite(b.dataset.zoom, 6); if (b.hasAttribute("data-close")) closeSite(); });
    aRange.addEventListener("input", () => { stopTour(); const ya = u2ya(+aRange.value); aFree = true; ensureAtlas().setState({ t: ya, routes: null, sites: null }); paintBadge(ya); paintStory(); syncUrl(); });
    // ticks + chapter bands on the time track
    const TICKS = [300000, 100000, 65000, 30000, 10000, 5000, 3000, 2000];
    $("#timeTicks").innerHTML = TICKS.map(t => `<span style="left:${ya2u(t) / 10}%">${t >= 12000 ? Math.round(t / 1000) + "k ya" : t > 2000 ? (t - 2000) + " BCE" : "0"}</span>`).join("");
    const BANDS = [["intro", 300000, 72000], ["ch1", 72000, 12000], ["ch2", 12000, 4600], ["ch3", 4600, 3900], ["ch4", 3900, 3000], ["epi", 3000, T_MIN]];
    $("#timeBands").innerHTML = BANDS.map(([c, a, b]) => `<i title="${CH.find(x => x.id === c).short}" style="left:${ya2u(a) / 10}%;width:${(ya2u(b) - ya2u(a)) / 10}%;background:${chColor(c)}"></i>`).join("");
    $("#atlasPlay").addEventListener("click", () => {
      if (aTimer) return stopTour();
      $("#atlasPlay").textContent = "❚❚"; $("#atlasPlay").setAttribute("aria-label", "Pause the guided tour");
      goStory(aFree || aStory >= ST.length - 1 ? 0 : aStory + 1);
      aTimer = setInterval(() => { if (aStory >= ST.length - 1) return stopTour(); goStory(aStory + 1); }, 7000);
    });
    // layers + legend
    $("#atlasLayers").innerHTML = LAYERS.map(([k, l]) => `<button class="chip" type="button" aria-pressed="true" data-layer="${k}"><i></i>${l}</button>`).join("");
    $("#atlasLayers").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); ensureAtlas().setLayer(b.dataset.layer, on); });
    $("#atlasLegend").innerHTML = Object.entries(RK).map(([k, v]) => `<li><i class="${v.dash ? "dash" : ""}" style="background:${v.slot ? `var(--s${v.slot})` : "var(--gray)"}"></i><span>${v.n}</span></li>`).join("");
    // paint the panel now (stable layout), build the map lazily when it nears the viewport
    if (!aMap) { aRange.value = ya2u(ST[0].t); paintBadge(ST[0].t); paintStory(); }
    new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { ob.disconnect(); if (!aMap) goStory(aStory); } }, { rootMargin: "300px" }).observe(aHost);
    // links from chapters
    document.addEventListener("click", e => { const a = e.target.closest("[data-story]"); if (!a || a.closest("#storySteps")) return; e.preventDefault(); stopTour(); goStory(a.dataset.story, true); });
  }

  /* decorative hero map */
  const hm = $("#heroMap");
  if (hm && !matchMedia("(max-width: 640px)").matches) {
    const hMap = AtlasMap.create(hm, { interactive: false, decorative: true, view: [-5, -38, 150, 62], routes: window.ROUTES.filter(r => r.kind !== "dead") });
    hMap.setState({ t: 0, routes: window.ROUTES.map(r => r.id) });
  }

  /* =========================================================
     COMMAND PALETTE
     ========================================================= */
  const pal = $("#palette"), pIn = $("#pIn"), pList = $("#pList"); let pItems = [], pSel = 0;
  const corpus = [
    ...CH.map(c => ({ k: "Chapter", t: c.title, s: c.tag, go: () => document.getElementById(c.id).scrollIntoView() })),
    ...EV.map((e, i) => ({ k: "Event", t: e.t, s: whenLabel(e.ya, e.end), go: () => { tlOn.add(e.ch); $$("#tlChips button").forEach(b => b.setAttribute("aria-pressed", tlOn.has(b.dataset.ch))); tlMode = e.ya > 15000 ? "deep" : e.ya > 8000 ? "holo" : "bronze"; $$("#tlModes button").forEach(x => x.setAttribute("aria-pressed", x.dataset.m === tlMode)); drawTimeline(); $("#timeline").scrollIntoView(); setTimeout(() => selectEvent(i, true), 350); } })),
    ...window.FACTS.map(f => ({ k: "Fact", t: f[0], s: f[1], go: () => document.getElementById(f[2]).scrollIntoView() })),
    ...IMG.map(im => ({ k: "Image", t: im.title, s: im.kind, extra: im.tags.join(" ") + " " + im.cap, go: () => openLB(IMG, IMG.indexOf(im)) })),
    ...Object.entries(CHARTS).map(([k, c]) => ({ k: "Chart", t: c.title, s: c.sub, go: () => document.getElementById("c-" + k).scrollIntoView({ block: "center" }) })),
    ...ST.map((st, i) => ({ k: "Map", t: st.title, s: st.kicker + " — " + st.text, go: () => goStory(i, true) })),
    ...SITES.map(si => ({ k: "Place", t: si.n, s: si.where + " · " + si.d, go: () => showOnMap(si.id) }))
  ];
  function paintPal() {
    const q = pIn.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    pItems = corpus.filter(c => q.every(w => (c.t + " " + c.s + " " + (c.extra || "")).toLowerCase().includes(w))).slice(0, 40); pSel = 0;
    pList.innerHTML = pItems.map((c, i) => `<li role="option" aria-selected="${i === 0}"><button type="button" tabindex="-1" data-i="${i}" aria-selected="${i === 0}"><small>${c.k}</small><span><b>${c.t}</b> — ${c.s.length > 90 ? c.s.slice(0, 88) + "…" : c.s}</span></button></li>`).join("") || `<li class="empty">No results for “${pIn.value.replace(/[<>&]/g, "")}”</li>`;
  }
  const openPal = () => { pIn.value = ""; paintPal(); pal.showModal(); pIn.focus(); };
  const run = i => { const it = pItems[i]; if (!it) return; pal.close(); setTimeout(it.go, 60); };
  $("#searchBtn").addEventListener("click", openPal);
  addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? pal.close() : openPal(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); bmMenu.open ? bmMenu.close() : bmMenu.showModal(); paintBMs(); }
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !pal.open) { e.preventDefault(); openPal(); }
  });
  pIn.addEventListener("input", paintPal);
  pIn.addEventListener("keydown", e => {
    const mv = d => { pSel = (pSel + d + pItems.length) % Math.max(1, pItems.length); $$("#pList button").forEach((b, i) => { b.setAttribute("aria-selected", i === pSel); b.parentElement.setAttribute("aria-selected", i === pSel); }); $$("#pList button")[pSel]?.scrollIntoView({ block: "nearest" }); };
    if (e.key === "ArrowDown") { e.preventDefault(); mv(1); } else if (e.key === "ArrowUp") { e.preventDefault(); mv(-1); } else if (e.key === "Enter") { e.preventDefault(); run(pSel); } else if (e.key === "Escape") { e.preventDefault(); pal.close(); }
  });
  pList.addEventListener("click", e => { const b = e.target.closest("button"); if (b) run(+b.dataset.i); });
  pal.addEventListener("click", e => { if (e.target === pal) pal.close(); });

  /* ---------- boot ---------- */
  drawTimeline();
  if ($("#quizModules")) Quiz.render($("#quizModules"));
})();
