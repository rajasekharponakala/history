/* =========================================================
   EARLY INDIANS — dependency-free geographic map engine
   Miller projection · SVG · pan / pinch / ctrl+wheel zoom ·
   animated migration routes · time filtering · label collision.
   Works offline (land + borders come from js/geo.js).
   ========================================================= */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const mk = (t, a = {}, txt) => { const n = document.createElementNS(NS, t); for (const k in a) if (a[k] != null) n.setAttribute(k, a[k]); if (txt != null) n.textContent = txt; return n; };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const R = Math.PI / 180;

  /* ---------- projection (Miller cylindrical), world units ≈ degrees ---------- */
  const P = ([lon, lat]) => [lon, -1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * R)) / R];
  const WORLD = [-25, -47, 170, 72];

  /* ---------- decode the delta-encoded outlines once ---------- */
  const decode = s => (s || "").split(";").filter(Boolean).map(r => { let x = 0, y = 0; return r.split(" ").map(p => { const i = p.indexOf(","); x += +p.slice(0, i); y += +p.slice(i + 1); return [x / 20, y / 20]; }); });
  let LAND_D = null, BORDER_D = null;
  const ringPath = (rings, close) => rings.map(r => "M" + r.map(pt => { const [x, y] = P(pt); return x.toFixed(2) + "," + y.toFixed(2); }).join("L") + (close ? "Z" : "")).join("");
  function basePaths() {
    if (!LAND_D) { LAND_D = ringPath(decode(window.GEO_LAND), true); BORDER_D = ringPath(decode(window.GEO_BORDERS), false); }
    return { land: LAND_D, borders: BORDER_D };
  }

  /* Catmull-Rom → cubic Bézier through screen points */
  function smooth(pts) {
    if (pts.length < 3) return "M" + pts.map(p => p.join(",")).join("L");
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const chCol = ch => `var(--c-${ch || "ch1"})`;
  const kindCol = k => { const s = (window.ROUTE_KINDS[k] || {}).slot; return s ? `var(--s${s})` : "var(--gray)"; };

  let uid = 0;

  function create(host, opts = {}) {
    const o = Object.assign({ interactive: true, decorative: false, view: WORLD, layers: {}, sites: window.SITES || [], routes: window.ROUTES || [] }, opts);
    const layers = Object.assign({ borders: true, rivers: true, extents: true, labels: true, routes: true, sites: true, grid: true }, o.layers);
    const id = "m" + (++uid);
    let W = 800, H = 450, view = { x: 0, y: 0, k: 1 }, fitTarget = o.view, userMoved = false, anim = null;
    let state = { t: 0, sites: null, routes: null, selected: null };
    const draw = new Map(), delays = new Map(); // route id → { p: progress 0..1 } / start delay

    host.classList.add("map");
    if (o.decorative) host.classList.add("map-deco");
    const svg = mk("svg", { class: "map-svg", role: o.decorative ? "presentation" : "application", "aria-label": o.label || "Interactive map", tabindex: o.interactive ? 0 : null, "aria-roledescription": o.interactive ? "map" : null });
    if (o.decorative) svg.setAttribute("aria-hidden", "true");
    const defs = mk("defs");
    const glow = mk("radialGradient", { id: id + "-glow" });
    glow.append(mk("stop", { offset: "0", "stop-color": "var(--map-glow)", "stop-opacity": ".55" }), mk("stop", { offset: "1", "stop-color": "var(--map-glow)", "stop-opacity": "0" }));
    defs.append(glow);
    const sea = mk("rect", { class: "m-sea", x: 0, y: 0, width: "100%", height: "100%" });
    const base = mk("g", { class: "m-base" });
    const gGrid = mk("g", { class: "m-grid" }), gLand = mk("g"), gBorders = mk("g"), gExt = mk("g"), gRiv = mk("g");
    base.append(gGrid, gLand, gBorders, gExt, gRiv);
    const gRegion = mk("g", { class: "m-regions" }), gRoutes = mk("g", { class: "m-routes" }), gSites = mk("g", { class: "m-sites" }), gLabels = mk("g", { class: "m-labels" });
    svg.append(defs, sea, base, gRegion, gRoutes, gSites, gLabels);
    host.append(svg);

    /* ---------- static base layers (world units) ---------- */
    const bp = basePaths();
    for (let lon = -15; lon <= 165; lon += 15) gGrid.append(mk("path", { d: `M${lon},${P([lon, 70])[1]}V${P([lon, -45])[1]}`, class: "m-gl" }));
    for (let lat = -30; lat <= 60; lat += 15) gGrid.append(mk("path", { d: `M-25,${P([0, lat])[1]}H170`, class: lat === 0 ? "m-gl m-eq" : "m-gl" }));
    gLand.append(mk("path", { d: bp.land, class: "m-land" }));
    gBorders.append(mk("path", { d: bp.borders, class: "m-border" }));
    const extEls = (window.EXTENTS || []).map(e => {
      const g = mk("g", { class: "m-ext" });
      const d = "M" + e.pts.map(p => P(p).map(v => v.toFixed(2)).join(",")).join("L") + "Z";
      g.append(mk("path", { d, class: "m-ext-line" }));
      gExt.append(g); return { e, g };
    });
    (window.RIVERS || []).forEach(r => {
      const pts = r.pts.map(P);
      gRiv.append(mk("path", { d: "M" + pts.map(p => p.map(v => v.toFixed(2)).join(",")).join("L"), class: "m-river" + (r.dry ? " dry" : "") }));
    });

    /* ---------- region labels (screen units) ---------- */
    const regionEls = (window.MAP_LABELS || []).map(l => { const t = mk("text", { class: "m-region" + (l.sea ? " sea" : ""), "text-anchor": "middle" }, l.t); gRegion.append(t); return { l, t, p: P(l.ll) }; });
    const riverLabels = (window.RIVERS || []).filter(r => !o.decorative && !r.nolabel).map(r => { const mid = r.pts[Math.floor(r.pts.length / 2)]; const t = mk("text", { class: "m-rlabel", "text-anchor": "middle" }, r.n); gRegion.append(t); return { t, p: P(mid) }; });

    /* ---------- routes ---------- */
    const routeEls = o.routes.map(r => {
      const g = mk("g", { class: `m-route k-${r.kind}`, style: `--rc:${kindCol(r.kind)}` });
      const casing = mk("path", { class: "r-case" }), line = mk("path", { class: "r-line", pathLength: 1 }), flow = mk("path", { class: "r-flow" }), head = mk("path", { class: "r-head" }), hit = mk("path", { class: "r-hit" });
      if ((window.ROUTE_KINDS[r.kind] || {}).dash) g.classList.add("dashed");
      g.append(casing, line, flow, head, hit);
      if (!o.decorative && window.Viz) {
        const K = window.ROUTE_KINDS[r.kind] || {};
        hit.addEventListener("pointermove", e => window.Viz.tip.show(`<b>${r.n}</b><br>${K.n || ""}<br><span>${whenRange(r.from, r.to)}</span>`, e.clientX, e.clientY));
        hit.addEventListener("pointerleave", window.Viz.tip.hide);
      }
      gRoutes.append(g); return { r, g, casing, line, flow, head, pw: r.pts.map(P) };
    });

    /* ---------- sites ---------- */
    const siteEls = o.decorative ? [] : o.sites.map(s => {
      const g = mk("g", { class: `m-site kind-${s.kind}`, style: `--sc:${chCol(s.ch)}`, role: "button", "aria-label": `${s.n}, ${s.where}. ${whenRange(s.from, s.to)}` });
      const halo = mk("circle", { class: "s-halo", r: 18, fill: `url(#${id}-glow)` }), pulse = mk("circle", { class: "s-pulse", r: 9 });
      const dot = s.kind === "city" ? mk("rect", { class: "s-dot", x: -5.5, y: -5.5, width: 11, height: 11, rx: 2.5 }) : s.kind === "region" ? mk("circle", { class: "s-dot s-region", r: 7 }) : mk("circle", { class: "s-dot", r: 5.5 });
      const hit = mk("circle", { class: "s-hit", r: 14 });
      g.append(halo, pulse, dot, hit);
      const label = mk("text", { class: "m-label" }, s.n);
      gSites.append(g); gLabels.append(label);
      const el = { s, g, label, p: P(s.ll), w: s.n.length * 6.6 + 6 };
      if (o.interactive) {
        g.addEventListener("click", e => { if (moved) return; e.stopPropagation(); select(s.id, true); });
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(s.id, true); } });
        if (window.Viz) {
          g.addEventListener("pointermove", e => window.Viz.tip.show(`<b>${s.n}</b><br>${s.where}<br><span>${whenRange(s.from, s.to)}</span>`, e.clientX, e.clientY));
          g.addEventListener("pointerleave", window.Viz.tip.hide);
          g.addEventListener("focus", () => { const b = g.getBoundingClientRect(); window.Viz.tip.show(`<b>${s.n}</b><br>${s.where}`, b.left + b.width / 2, b.top); });
          g.addEventListener("blur", window.Viz.tip.hide);
        }
      }
      return el;
    });

    /* ---------- UI chrome ---------- */
    let hint;
    if (o.interactive) {
      const ui = document.createElement("div"); ui.className = "map-ui";
      ui.innerHTML = `<button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit" aria-label="Reset view">⤢</button>`;
      ui.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const z = b.dataset.z; if (z === "fit") { userMoved = false; fly(fitTarget, 700); } else zoomAt(W / 2, H / 2, z === "in" ? 1.6 : 1 / 1.6, true); });
      hint = document.createElement("div"); hint.className = "map-hint"; hint.textContent = (navigator.platform || "").includes("Mac") ? "Use ⌘ + scroll to zoom" : "Use Ctrl + scroll to zoom";
      host.append(ui, hint);
    }

    /* ---------- view math ---------- */
    const kFit = v => { const a = P([v[0], v[3]]), b = P([v[2], v[1]]); return Math.min(W / (b[0] - a[0]), H / (b[1] - a[1])); };
    const viewFor = (v, pad = 0.06) => { const a = P([v[0], v[3]]), b = P([v[2], v[1]]); const k = Math.min(W * (1 - 2 * pad) / (b[0] - a[0]), H * (1 - 2 * pad) / (b[1] - a[1])); return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, k }; };
    // never zoom out past the edges of the land data: the world must cover the viewport
    const kMin = () => { const a = P([WORLD[0], WORLD[3]]), b = P([WORLD[2], WORLD[1]]); return Math.max(W / (b[0] - a[0]), H / (b[1] - a[1])); }, kMax = () => kFit(WORLD) * 40;
    function clamp(v) {
      const k = Math.min(kMax(), Math.max(kMin(), v.k)), a = P([WORLD[0], WORLD[3]]), b = P([WORLD[2], WORLD[1]]);
      const hw = W / 2 / k, hh = H / 2 / k;
      const cx = (b[0] - a[0]) < 2 * hw ? (a[0] + b[0]) / 2 : Math.min(b[0] - hw, Math.max(a[0] + hw, v.x));
      const cy = (b[1] - a[1]) < 2 * hh ? (a[1] + b[1]) / 2 : Math.min(b[1] - hh, Math.max(a[1] + hh, v.y));
      return { x: cx, y: cy, k };
    }
    const toS = ([x, y]) => [(x - view.x) * view.k + W / 2, (y - view.y) * view.k + H / 2];
    const zoomLevel = () => Math.log2(view.k / kFit(WORLD));

    function size() {
      const r = host.getBoundingClientRect(); W = Math.max(280, Math.round(r.width)); H = Math.max(200, Math.round(r.height));
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
    }

    /* ---------- render ---------- */
    function render() {
      const k = view.k, tx = W / 2 - view.x * k, ty = H / 2 - view.y * k, t = state.t, z = zoomLevel();
      base.setAttribute("transform", `translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${k.toFixed(4)})`);
      gGrid.style.display = layers.grid ? "" : "none";
      gBorders.style.display = layers.borders ? "" : "none";
      gRiv.style.display = layers.rivers ? "" : "none";
      extEls.forEach(({ e, g }) => { const on = layers.extents && (o.decorative || (t <= e.from + 300 && t >= e.to - 300)); g.style.display = on ? "" : "none"; });

      // region & river labels
      const showLab = layers.labels && !o.decorative;
      riverLabels.forEach(({ t: el, p }) => { const [x, y] = toS(p); el.setAttribute("x", x.toFixed(1)); el.setAttribute("y", (y - 4).toFixed(1)); el.style.display = showLab && layers.rivers && z > 1.6 ? "" : "none"; });

      // routes
      const hiR = state.routes ? new Set(state.routes) : null;
      routeEls.forEach(re => {
        const { r, g, casing, line, flow, head } = re;
        const started = o.decorative || t <= r.from, current = t <= r.from && t >= r.to;
        const hi = o.decorative || (hiR ? hiR.has(r.id) : current);
        const recent = t < r.to && r.to < t * 2.2 && r.kind !== "dead"; // finished not long ago → faint context
        const on = layers.routes && (hi || current || recent) && (!hiR || hi || recent);
        g.style.display = on ? "" : "none"; if (!on) { draw.delete(r.id); return; }
        g.classList.toggle("hi", hi); g.classList.toggle("lo", !hi);
        const sp = re.pw.map(toS), d = smooth(sp);
        casing.setAttribute("d", d); line.setAttribute("d", d); flow.setAttribute("d", d); re.g.lastChild.setAttribute("d", d);
        // arrowhead at the end
        const a = sp[sp.length - 1], b = sp[sp.length - 2], ang = Math.atan2(a[1] - b[1], a[0] - b[0]), s = hi ? 9 : 6;
        const hp = [[a[0] + Math.cos(ang) * s * .4, a[1] + Math.sin(ang) * s * .4], [a[0] + Math.cos(ang + 2.5) * s, a[1] + Math.sin(ang + 2.5) * s], [a[0] + Math.cos(ang - 2.5) * s, a[1] + Math.sin(ang - 2.5) * s]];
        head.setAttribute("d", "M" + hp.map(p => p.map(v => v.toFixed(1)).join(",")).join("L") + "Z");
        // draw-in progress
        if (hi && !draw.has(r.id)) draw.set(r.id, { p: reduced() ? 1 : 0, t0: performance.now() + (delays.get(r.id) || 0) });
        if (!hi) draw.delete(r.id);
        const st = draw.get(r.id), p = st ? st.p : 1;
        line.style.strokeDasharray = p < 1 ? `${p} 1` : ""; head.style.opacity = p > .96 ? 1 : 0; flow.style.opacity = p >= 1 ? "" : 0;
      });

      // sites
      const hiS = state.sites ? new Set(state.sites) : null, placed = [];
      const vis = [];
      siteEls.forEach(se => {
        const { s, g, label } = se;
        const exists = t <= s.from, active = exists && t >= s.to, hi = hiS ? hiS.has(s.id) : active, sel = state.selected === s.id;
        const on = layers.sites && (hi || sel || (exists && (!hiS || s.kind !== "region")));
        g.style.display = on ? "" : "none"; label.style.display = "none";
        g.setAttribute("tabindex", on && o.interactive ? 0 : -1);
        if (!on) return;
        const [x, y] = toS(se.p);
        g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        g.classList.toggle("hi", hi); g.classList.toggle("past", !hi && (!!hiS || !active)); g.classList.toggle("sel", sel);
        vis.push({ se, x, y, pr: (sel ? 4 : 0) + (hi ? 2 : 0) + (s.kind === "city" ? 1 : 0) });
      });
      // labels: greedy collision avoidance, high priority first
      vis.forEach(({ x, y }) => placed.push([x - 6, y - 6, x + 6, y + 6]));
      if (layers.labels) {
        vis.sort((a, b) => b.pr - a.pr).forEach(({ se, x, y, pr }) => {
          if (pr < 2 && z < 2.2) return;
          const w = se.w, h = 14, cands = [[x + 10, y + 4, "start", x + 8, y - 9], [x - 10, y + 4, "end", x - 8 - w, y - 9], [x, y - 12, "middle", x - w / 2, y - 25], [x, y + 20, "middle", x - w / 2, y + 8]];
          for (const [lx, ly, an, bx, by] of cands) {
            const box = [bx, by, bx + w, by + h];
            if (box[0] < 2 || box[2] > W - 2 || box[1] < 2 || box[3] > H - 2) continue;
            if (placed.some(q => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) continue;
            placed.push(box, [x - 7, y - 7, x + 7, y + 7]);
            const L = se.label; L.setAttribute("x", lx.toFixed(1)); L.setAttribute("y", ly.toFixed(1)); L.setAttribute("text-anchor", an); L.style.display = "";
            L.classList.toggle("hi", pr >= 2); break;
          }
        });
      }
      // region labels last, only where they don't collide with places
      regionEls.forEach(({ l, t: el, p }) => {
        const [x, y] = toS(p); let on = showLab && z >= l.z * 0.85 - 0.2 && z < l.z + 3.2;
        if (on) { const w = l.t.length * (l.sea ? 6.6 : 10.2), box = [x - w / 2, y - 11, x + w / 2, y + 3]; if (placed.some(q => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) on = false; else placed.push(box); }
        el.setAttribute("x", x.toFixed(1)); el.setAttribute("y", y.toFixed(1)); el.style.display = on ? "" : "none";
      });
    }

    /* ---------- animation loop (fly + route draw-in) ---------- */
    let raf = 0;
    function loop(now) {
      raf = 0; let again = false;
      if (anim) {
        const u = Math.min(1, (now - anim.t0) / anim.ms), e = ease(u);
        view = { x: anim.a.x + (anim.b.x - anim.a.x) * e, y: anim.a.y + (anim.b.y - anim.a.y) * e, k: Math.exp(Math.log(anim.a.k) + (Math.log(anim.b.k) - Math.log(anim.a.k)) * e) };
        if (u >= 1) anim = null; else again = true;
      }
      draw.forEach(st => { if (st.p < 1) { st.p = Math.max(0, Math.min(1, (now - st.t0) / 1400)); again = true; } });
      render();
      // render() may have registered new routes to draw in — keep looping until all are drawn
      if (!again) draw.forEach(st => { if (st.p < 1) again = true; });
      if (again) raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    function fly(v, ms = 1000) {
      fitTarget = v; const b = clamp(viewFor(v));
      if (reduced() || ms === 0) { view = b; anim = null; kick(); return; }
      anim = { a: { ...view }, b, t0: performance.now(), ms }; kick();
    }
    function zoomAt(sx, sy, f, smoothly) {
      const wx = (sx - W / 2) / view.k + view.x, wy = (sy - H / 2) / view.k + view.y;
      const k = Math.min(kMax(), Math.max(kMin(), view.k * f));
      const b = clamp({ x: wx - (sx - W / 2) / k, y: wy - (sy - H / 2) / k, k });
      userMoved = true;
      if (smoothly && !reduced()) { anim = { a: { ...view }, b, t0: performance.now(), ms: 320 }; } else { view = b; anim = null; }
      kick();
    }
    function panBy(dx, dy) { view = clamp({ x: view.x - dx / view.k, y: view.y - dy / view.k, k: view.k }); anim = null; userMoved = true; kick(); }

    /* ---------- interaction ---------- */
    const ptrs = new Map(); let moved = false, pinch = null, hintT;
    if (o.interactive) {
      svg.addEventListener("pointerdown", e => {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = false; anim = null;
        if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) }; }
        if (e.pointerType === "mouse") svg.setPointerCapture(e.pointerId);
      });
      svg.addEventListener("pointermove", e => {
        const p = ptrs.get(e.pointerId); if (!p) return;
        if (ptrs.size === 1) {
          const dx = e.clientX - p.x, dy = e.clientY - p.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) { moved = true; host.classList.add("dragging"); }
          if (moved) panBy(dx, dy);
        } else if (ptrs.size === 2 && pinch) {
          const others = [...ptrs.entries()].filter(([k]) => k !== e.pointerId)[0][1];
          const d = Math.hypot(e.clientX - others.x, e.clientY - others.y), r = svg.getBoundingClientRect();
          const mx = (e.clientX + others.x) / 2 - r.left, my = (e.clientY + others.y) / 2 - r.top;
          if (pinch.d > 0) zoomAt(mx * W / r.width, my * H / r.height, d / pinch.d, false);
          pinch.d = d; moved = true;
        }
        p.x = e.clientX; p.y = e.clientY;
      });
      const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) { host.classList.remove("dragging"); setTimeout(() => (moved = false), 0); } };
      svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up); svg.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") up(e); });
      svg.addEventListener("wheel", e => {
        if (!(e.ctrlKey || e.metaKey)) { hint.classList.add("on"); clearTimeout(hintT); hintT = setTimeout(() => hint.classList.remove("on"), 1300); return; }
        e.preventDefault(); const r = svg.getBoundingClientRect();
        zoomAt((e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height, Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0022)), false);
      }, { passive: false });
      svg.addEventListener("dblclick", e => { const r = svg.getBoundingClientRect(); zoomAt((e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height, e.shiftKey ? 0.5 : 2, true); });
      svg.addEventListener("keydown", e => {
        if (e.target !== svg) return;
        const m = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60] }[e.key];
        if (m) { e.preventDefault(); panBy(m[0], m[1]); }
        else if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(W / 2, H / 2, 1.5, true); }
        else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(W / 2, H / 2, 1 / 1.5, true); }
        else if (e.key === "0") { e.preventDefault(); userMoved = false; fly(fitTarget, 600); }
      });
      svg.addEventListener("click", () => { if (!moved && state.selected) { select(null, true); } });
    }

    function select(sid, notify) {
      state.selected = sid; render();
      if (notify && o.onSite) o.onSite(sid ? o.sites.find(s => s.id === sid) : null);
    }

    /* ---------- lifecycle ---------- */
    const ro = new ResizeObserver(() => { const w0 = W, h0 = H; size(); if (w0 === W && h0 === H) return; if (!userMoved) view = clamp(viewFor(fitTarget)); else view = clamp(view); render(); });
    size(); view = clamp(viewFor(o.view)); ro.observe(host); render();

    return {
      fly, render: kick, select,
      setState(s) {
        const prevR = state.routes;
        state = Object.assign({}, state, s);
        if (s.routes !== undefined && s.routes !== prevR) {
          const keep = new Set(s.routes || []); [...draw.keys()].forEach(k => { if (!keep.has(k)) draw.delete(k); });
          let i = 0; delays.clear(); (s.routes || []).forEach(rid => { if (!draw.has(rid)) delays.set(rid, i++ * 280); });
        }
        kick();
      },
      setLayer(name, on) { layers[name] = on; kick(); },
      get layers() { return { ...layers }; },
      get state() { return { ...state }; },
      focusSite(sid, zoom = 3.2) { const s = o.sites.find(x => x.id === sid); if (!s) return; const [lon, lat] = s.ll, d = 26 / zoom; fly([lon - d, lat - d * .6, lon + d, lat + d * .6], 900); select(sid, false); }
    };
  }

  function whenRange(from, to) {
    const one = y => y >= 12000 ? `${Math.round(y).toLocaleString("en-US")} years ago` : y > 2000 ? `${Math.round(y - 2000).toLocaleString("en-US")} BCE` : y <= 0 ? "today" : `${Math.round(2000 - y)} CE`;
    if (to == null || to === from) return one(from);
    if (from >= 12000 && to >= 12000) return `${Math.round(from).toLocaleString("en-US")}–${Math.round(to).toLocaleString("en-US")} years ago`;
    return `${one(from)} – ${one(to)}`;
  }

  window.AtlasMap = { create, project: P, whenRange };
})();
