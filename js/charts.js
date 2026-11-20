/* =========================================================
   Tiny dependency-free SVG chart kit (works from file://)
   Colours come from CSS custom properties --s1..--s8 / --gray,
   so light/dark/high-contrast modes need no JS.
   ========================================================= */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (tag, attrs = {}, kids = []) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    (Array.isArray(kids) ? kids : [kids]).forEach(c => c != null && el.append(c.nodeType ? c : document.createTextNode(c)));
    return el;
  };
  const col = s => (s ? `var(--s${s})` : "var(--gray)");
  const entCol = e => col((window.ENTITY[e] || { slot: 0 }).slot);
  const fmtN = n => (n >= 1e6 ? (n / 1e6).toFixed(n % 1e6 ? 1 : 0).replace(/\.0$/, "") + "M"
    : n >= 1e3 ? Math.round(n).toLocaleString("en-US") : String(n));
  const fmtYa = n => n >= 1e6 ? (n / 1e6) + " M" : n >= 1e3 ? (n / 1e3) + "k" : String(n);

  /* ---------- shared tooltip ---------- */
  const tip = document.createElement("div");
  tip.id = "tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true;
  document.addEventListener("DOMContentLoaded", () => document.body.append(tip));
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y + 14;
    if (left + r.width > innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > innerHeight - 8) top = y - r.height - 14;
    tip.style.transform = `translate(${Math.max(8, left)}px,${Math.max(8, top)}px)`;
  }
  const hideTip = () => (tip.hidden = true);
  function bindTip(el, html) {
    el.addEventListener("pointermove", e => showTip(html, e.clientX, e.clientY));
    el.addEventListener("pointerleave", hideTip);
    el.addEventListener("focus", () => { const r = el.getBoundingClientRect(); showTip(html, r.left + r.width / 2, r.top); });
    el.addEventListener("blur", hideTip);
    el.setAttribute("tabindex", "0");
  }

  const W = el => Math.max(260, Math.floor(el.clientWidth || 320));
  const svgRoot = (el, w, h, label) => {
    el.replaceChildren();
    const s = $("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, role: "img", "aria-label": label || "chart", class: "svgc" });
    el.append(s); return s;
  };
  const txt = (x, y, s, cls = "t-sec", anchor = "start", extra = {}) => $("text", { x, y, class: cls, "text-anchor": anchor, ...extra }, s);

  /* ---------- horizontal bars / lollipops ---------- */
  function hbar(el, rows, o = {}) {
    const w = W(el), rowH = o.rowH || 50, padR = 70, top = 4;
    const h = rows.length * rowH + top + (o.log ? 22 : 4);
    const s = svgRoot(el, w, h, o.label);
    const max = o.max || Math.max(...rows.map(r => r.value));
    const scale = v => o.log
      ? (Math.log10(Math.max(v, 1)) - Math.log10(o.min || 1)) / (Math.log10(max) - Math.log10(o.min || 1))
      : v / max;
    const x0 = 0, bw = w - padR;
    if (o.log) { // gridlines
      for (let p = Math.ceil(Math.log10(o.min || 1)); p <= Math.log10(max); p++) {
        const x = x0 + scale(10 ** p) * bw;
        s.append($("line", { x1: x, x2: x, y1: top, y2: h - 20, class: "gl" }), txt(x, h - 6, fmtN(10 ** p), "t-mut", "middle"));
      }
    }
    rows.forEach((r, i) => {
      const y = top + i * rowH, color = r.ent ? entCol(r.ent) : col(r.slot || 1);
      const len = Math.max(r.value > 0 ? 3 : 0, scale(r.value) * bw);
      s.append(txt(x0, y + 15, r.label, "t-sec"));
      const g = $("g", { class: "mark" });
      if (o.style === "lollipop") {
        g.append($("line", { x1: x0, x2: x0 + len, y1: y + 33, y2: y + 33, class: "stem", stroke: color }),
          $("circle", { cx: x0 + len, cy: y + 33, r: 7, fill: color, class: "ring" }));
      } else {
        g.append($("path", { d: roundEnd(x0, y + 22, len, 14), fill: color }));
      }
      s.append(g);
      s.append(txt(x0 + len + (o.style === "lollipop" ? 14 : 8), y + 38, (o.fmt ? o.fmt(r) : fmtN(r.value) + (o.unit || "")), "t-pri t-num"));
      const hit = $("rect", { x: 0, y, width: w, height: rowH - 6, fill: "transparent", class: "hit" });
      bindTip(hit, `<b>${r.label}</b><br>${o.fmt ? o.fmt(r) : fmtN(r.value) + (o.unit || "")}${r.note ? `<br><span>${r.note}</span>` : ""}`);
      hit.setAttribute("aria-label", `${r.label}: ${o.fmt ? o.fmt(r) : r.value + (o.unit || "")}`);
      s.append(hit);
    });
  }
  // bar with rounded data-end only (flat on baseline)
  function roundEnd(x, y, len, hgt) {
    const r = Math.min(4, len / 2, hgt / 2);
    return `M${x},${y}H${x + len - r}Q${x + len},${y} ${x + len},${y + r}V${y + hgt - r}Q${x + len},${y + hgt} ${x + len - r},${y + hgt}H${x}Z`;
  }

  /* ---------- floating range bars ---------- */
  function ranges(el, rows, o = {}) {
    const w = W(el), rowH = 54, top = 4, axisH = 24, padR = 12;
    const h = rows.length * rowH + top + axisH;
    const s = svgRoot(el, w, h, o.label);
    const min = o.min ?? 0, max = o.max ?? 100, bw = w - padR;
    const X = v => ((v - min) / (max - min)) * bw;
    for (let v = min; v <= max; v += o.step || 20) {
      s.append($("line", { x1: X(v), x2: X(v), y1: top, y2: h - axisH, class: "gl" }), txt(X(v), h - 6, v + (o.unit || ""), "t-mut", v === min ? "start" : v === max ? "end" : "middle"));
    }
    rows.forEach((r, i) => {
      const y = top + i * rowH, color = r.ent ? entCol(r.ent) : col(r.slot || 1);
      const lo = r.lo ?? r.value, hi = r.hi ?? r.value;
      s.append(txt(0, y + 15, r.label, "t-sec"));
      if (hi - lo < 0.01) s.append($("circle", { cx: X(lo), cy: y + 33, r: 7, fill: color, class: "ring" }));
      else s.append($("path", { d: roundEnd(X(lo), y + 26, Math.max(6, X(hi) - X(lo)), 14), fill: color }));
      const label = hi === lo ? `${lo}${o.unit || ""}` : `${lo}–${hi}${o.unit || ""}`;
      const lx = X(hi) + 8 > bw - 70 ? X(lo) - 8 : X(hi) + 8;
      s.append(txt(lx, y + 38, label, "t-pri t-num", lx < X(lo) ? "end" : "start"));
      const hit = $("rect", { x: 0, y, width: w, height: rowH - 4, fill: "transparent" });
      bindTip(hit, `<b>${r.label}</b><br>${label}${r.note ? `<br><span>${r.note}</span>` : ""}`);
      hit.setAttribute("aria-label", `${r.label}: ${label}`);
      s.append(hit);
    });
  }

  /* ---------- donut ---------- */
  function donut(el, parts, o = {}) {
    const w = W(el), size = Math.min(w, o.size || 220), R = size / 2 - 4, r0 = R * 0.62;
    el.replaceChildren();
    const wrap = document.createElement("div"); wrap.className = "donut-wrap"; el.append(wrap);
    const s = $("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, role: "img", "aria-label": o.label || "donut chart", class: "svgc" });
    const total = parts.reduce((a, p) => a + p.value, 0);
    let a0 = -Math.PI / 2;
    parts.forEach(p => {
      const a1 = a0 + (p.value / total) * Math.PI * 2, gap = parts.length > 1 ? 0.025 : 0;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const pt = (rad, a) => [size / 2 + rad * Math.cos(a), size / 2 + rad * Math.sin(a)];
      const [x1, y1] = pt(R, a0 + gap), [x2, y2] = pt(R, a1 - gap), [x3, y3] = pt(r0, a1 - gap), [x4, y4] = pt(r0, a0 + gap);
      const d = parts.length === 1
        ? `M${size / 2},${size / 2 - R}A${R},${R} 0 1 1 ${size / 2 - 0.01},${size / 2 - R}L${size / 2 - 0.01},${size / 2 - r0}A${r0},${r0} 0 1 0 ${size / 2},${size / 2 - r0}Z`
        : `M${x1},${y1}A${R},${R} 0 ${large} 1 ${x2},${y2}L${x3},${y3}A${r0},${r0} 0 ${large} 0 ${x4},${y4}Z`;
      const path = $("path", { d, fill: p.ent ? entCol(p.ent) : col(p.slot), class: "slice" });
      bindTip(path, `<b>${p.label}</b><br>${p.value}%`);
      path.setAttribute("aria-label", `${p.label}: ${p.value}%`);
      s.append(path); a0 = a1;
    });
    if (o.center) {
      s.append(txt(size / 2, size / 2 + 4, o.center.big, "t-big", "middle"), txt(size / 2, size / 2 + 24, o.center.small || "", "t-mut", "middle"));
    }
    wrap.append(s);
    const lg = document.createElement("ul"); lg.className = "legend col";
    parts.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `<i style="background:${p.ent ? entCol(p.ent) : col(p.slot)}"></i><span>${p.label}</span><b>${p.value}%</b>`;
      lg.append(li);
    });
    wrap.append(lg);
  }

  /* ---------- 100% stacked horizontal ---------- */
  function stacked(el, rows, o = {}) {
    const w = W(el), rowH = 78, top = 4, h = rows.length * rowH + top;
    const s = svgRoot(el, w, h, o.label);
    rows.forEach((r, i) => {
      const y = top + i * rowH; let x = 0; const tot = r.parts.reduce((a, p) => a + p.value, 0);
      s.append(txt(0, y + 15, r.label, "t-sec"));
      r.parts.forEach(p => {
        const len = (p.value / tot) * w, seg = Math.max(0, len - 2);
        const rect = $("rect", { x, y: y + 24, width: seg, height: 22, fill: col(p.slot), rx: 3 });
        bindTip(rect, `<b>${r.label}</b><br>${p.label}: ${p.value}%`);
        s.append(rect);
        if (len > 80) s.append(txt(x + 2, y + 64, `${p.value}% ${p.label}`, "t-pri t-num"));
        x += len;
      });
    });
    legend(el, [...new Map(rows.flatMap(r => r.parts).map(p => [p.label, p])).values()].map(p => ({ label: p.label, color: col(p.slot) })));
  }

  function legend(el, items) {
    const ul = document.createElement("ul"); ul.className = "legend row";
    items.forEach(i => { const li = document.createElement("li"); li.innerHTML = `<i style="background:${i.color}"></i><span>${i.label}</span>`; ul.append(li); });
    el.append(ul);
  }

  /* ---------- waffle (unit chart) ---------- */
  function waffle(el, o) {
    const w = W(el), cols = o.cols || 10, rows = Math.ceil(o.total / cols);
    const gap = 3, cell = Math.min(24, Math.floor((Math.min(w - 8, 340) - cols * gap) / cols));
    const sw = cols * (cell + gap), sh = rows * (cell + gap);
    el.replaceChildren();
    const wrap = document.createElement("div"); wrap.className = "donut-wrap"; el.append(wrap);
    const s = $("svg", { viewBox: `0 0 ${sw} ${sh}`, width: sw, height: sh, role: "img", "aria-label": o.label || "unit chart", class: "svgc" });
    for (let i = 0; i < o.total; i++) {
      const on = i < o.filled, x = (i % cols) * (cell + gap), y = Math.floor(i / cols) * (cell + gap);
      s.append($("rect", { x, y, width: cell, height: cell, rx: 4, fill: on ? col(o.slot || 1) : "var(--track)", class: on ? "wf-on" : "wf-off", style: `--i:${i}` }));
    }
    wrap.append(s);
    const lg = document.createElement("div"); lg.className = "waffle-key";
    lg.innerHTML = `<b class="t-big">${o.big}</b><p>${o.text}</p>`; wrap.append(lg);
  }

  /* ---------- time range / dot plot (gantt) ---------- */
  // rows: {label,start,end,at,slot,note} in years ago.
  function gantt(el, rows, o = {}) {
    const w = W(el), rowH = o.rowH || 48, top = 4, axisH = 26, padR = 14;
    const log = o.scale !== "linear";
    const maxYa = o.max || Math.max(...rows.map(r => r.start ?? r.at)) * 1.05;
    const minYa = o.min ?? (log ? 10000 : 0);
    const bw = w - padR;
    const f = v => { // older -> left
      v = Math.max(v, log ? minYa : 0);
      return log ? (Math.log10(maxYa) - Math.log10(Math.max(v, minYa))) / (Math.log10(maxYa) - Math.log10(minYa)) * bw
        : (1 - (v - minYa) / (maxYa - minYa)) * bw;
    };
    const h = rows.length * rowH + top + axisH;
    const s = svgRoot(el, w, h, o.label);
    const ticks = o.ticks || (log ? [1e6, 1e5, 1e4, 1e3].filter(t => t <= maxYa && t >= minYa) : null);
    (ticks || []).forEach(t => {
      const x = f(t);
      s.append($("line", { x1: x, x2: x, y1: top, y2: h - axisH, class: "gl" }),
        txt(Math.min(Math.max(x, 12), bw - 12), h - 8, o.tickFmt ? o.tickFmt(t) : fmtYa(t), "t-mut", "middle"));
    });
    if (o.nowLabel) s.append(txt(bw, h - 8, o.nowLabel, "t-mut", "end"));
    rows.forEach((r, i) => {
      const y = top + i * rowH, color = col(r.slot || 1);
      s.append(txt(0, y + 15, r.label, "t-sec"));
      const g = $("g", {});
      let info;
      if (r.at != null) {
        g.append($("circle", { cx: f(r.at), cy: y + 33, r: 7, fill: color, class: "ring" }));
        info = (o.fmtAt ? o.fmtAt(r.at) : fmtN(r.at) + " years ago");
      } else {
        const x1 = f(r.start), x2 = f(r.end ?? 0);
        g.append($("path", { d: roundEnd(Math.min(x1, x2), y + 26, Math.max(7, Math.abs(x2 - x1)), 14), fill: color }));
        info = o.fmtRange ? o.fmtRange(r) : `${fmtN(r.start)} → ${fmtN(r.end ?? 0)} years ago`;
      }
      s.append(g);
      const hit = $("rect", { x: 0, y, width: w, height: rowH - 4, fill: "transparent" });
      bindTip(hit, `<b>${r.label}</b><br>${info}${r.note ? `<br><span>${r.note}</span>` : ""}`);
      hit.setAttribute("aria-label", `${r.label}: ${info}`);
      s.append(hit);
      // direct label for value at the end of mark (selective)
      if (o.valueLabels !== false) {
        const xr = r.at != null ? f(r.at) + 12 : Math.max(f(r.start), f(r.end ?? 0)) + 8;
        const xl = r.at != null ? f(r.at) - 12 : Math.min(f(r.start), f(r.end ?? 0)) - 8;
        const short = r.short || info.replace(" years ago", "");
        const fits = xr + short.length * 6.4 < w;
        s.append(txt(fits ? xr : xl, y + 38, short, "t-pri t-num", fits ? "start" : "end"));
      }
    });
  }

  /* ---------- column chart (MIS) ---------- */
  function columns(el, vals, o = {}) {
    const w = W(el), h = 230, padL = 34, padB = 28, padT = 10;
    const s = svgRoot(el, w, h, o.label);
    const max = Math.max(...vals.map(v => v.v)) * 1.08, bw = (w - padL) / vals.length;
    for (let t = 0; t <= max; t += o.step || 20) {
      const y = padT + (h - padT - padB) * (1 - t / max);
      s.append($("line", { x1: padL, x2: w, y1: y, y2: y, class: "gl" }), txt(padL - 6, y + 4, t, "t-mut", "end"));
    }
    s.append(txt(0, 10, o.yLabel || "", "t-mut"));
    vals.forEach((v, i) => {
      const bh = (h - padT - padB) * (v.v / max), x = padL + i * bw + 2, y = h - padB - bh;
      const p = $("path", { d: `M${x},${h - padB}V${y + 3}Q${x},${y} ${x + 3},${y}H${x + bw - 7}Q${x + bw - 4},${y} ${x + bw - 4},${y + 3}V${h - padB}Z`, fill: col(v.slot) });
      bindTip(p, `<b>${v.label}</b><br>${v.v} thousand years · ${v.note}`);
      s.append(p, txt(x + (bw - 4) / 2, h - 10, v.tick, "t-mut", "middle"));
    });
  }

  /* ---------- haplogroup tree ---------- */
  function tree(el) {
    const w = W(el), h = 250, s = svgRoot(el, w, h, "Haplogroup trees from L3 and CT");
    const node = (x, y, label, sub, slot, wd = 74) => {
      const g = $("g", { class: "node" });
      g.append($("rect", { x: x - wd / 2, y: y - 17, width: wd, height: 34, rx: 9, fill: "var(--surface-2)", stroke: col(slot), "stroke-width": 2 }),
        txt(x, y - 1, label, "t-pri t-b", "middle"), txt(x, y + 12, sub, "t-mut small", "middle"));
      bindTip(g, `<b>${label}</b><br>${sub}`); return g;
    };
    const link = (x1, y1, x2, y2) => $("path", { d: `M${x1},${y1 + 17}C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2 - 17}`, class: "link" });
    const cx = w * 0.27, cx2 = w * 0.75;
    s.append(txt(cx, 14, "Maternal line (mtDNA)", "t-sec t-b", "middle"), txt(cx2, 14, "Paternal line (Y-chromosome)", "t-sec t-b", "middle"));
    const L = [[cx, 50, "L3", "~70k yrs", 1], [cx - w * 0.14, 130, "M", "~48k yrs", 3], [cx + w * 0.14, 130, "N", "~61k yrs", 2], [cx + w * 0.14, 205, "R", "from N", 4]];
    s.append(link(L[0][0], L[0][1], L[1][0], L[1][1]), link(L[0][0], L[0][1], L[2][0], L[2][1]), link(L[2][0], L[2][1], L[3][0], L[3][1]));
    L.forEach(n => s.append(node(n[0], n[1], n[2], n[3], n[4])));
    const Y = [[cx2, 50, "CT", "root", 5], [cx2 - w * 0.17, 140, "C", "African export", 6, 82], [cx2, 140, "D", "African export", 7, 82], [cx2 + w * 0.17, 140, "F", "African export", 8, 82]];
    Y.slice(1).forEach(n => s.append(link(Y[0][0], Y[0][1], n[0], n[1])));
    Y.forEach(n => s.append(node(n[0], n[1], n[2], n[3], n[4], n[5] || 74)));
    s.append(txt(cx, h - 8, "All non-Africans: L3 → M and N", "t-mut small", "middle"),
      txt(cx2, h - 8, "Only C, D and F left Africa", "t-mut small", "middle"));
  }

  /* ---------- gradient strip (lactase) ---------- */
  function gradient(el, o) {
    const w = W(el), h = 120, s = svgRoot(el, w, h, o.label);
    const id = "g" + Math.random().toString(36).slice(2, 7);
    const defs = $("defs", {}, $("linearGradient", { id, x1: 0, x2: 1 }, [$("stop", { offset: 0, "stop-color": "var(--seq-8)" }), $("stop", { offset: 1, "stop-color": "var(--seq-1)" })]));
    s.append(defs, $("rect", { x: 0, y: 40, width: w, height: 26, rx: 8, fill: `url(#${id})` }));
    s.append(txt(0, 22, o.left, "t-pri t-b"), txt(w, 22, o.right, "t-pri t-b", "end"),
      txt(0, 90, o.leftSub, "t-mut"), txt(w, 90, o.rightSub, "t-mut", "end"),
      txt(w / 2, 90, o.mid || "", "t-mut", "middle"));
    s.append($("path", { d: `M0,70 L${w},70`, class: "gl" }));
    const mid = $("circle", { cx: w / 2, cy: 53, r: 8, fill: "var(--surface-1)", stroke: "var(--text)", "stroke-width": 2 }); s.append(mid);
    bindTip(mid, o.midTip || "");
  }

  window.Viz = { hbar, ranges, donut, stacked, waffle, gantt, columns, tree, gradient, legend, tip: { show: showTip, hide: hideTip, bind: bindTip }, $, col, entCol, fmtN };
})();
