/* =========================================================
   Botón de jefe: un toque y la pantalla se vuelve una hoja de
   cálculo aburrida. Otro toque (o Esc) y regresas al juego.
   ========================================================= */
(function () {
  "use strict";
  const css = document.createElement("style");
  css.textContent = `
  .boss-btn{position:fixed;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:90;width:52px;height:52px;border-radius:50%;
    border:0;background:#23364a;color:#fff;font-size:1.5rem;box-shadow:0 6px 16px -6px rgba(0,0,0,.5);cursor:pointer}
  .boss-btn:active{transform:scale(.92)}
  .boss{position:fixed;inset:0;z-index:999;background:#fff;color:#222;font:13px/1.2 Arial,Helvetica,sans-serif;display:none;flex-direction:column;overflow:hidden;user-select:none}
  .boss.on{display:flex}
  .boss .tb{background:#1f6e43;color:#fff;padding:8px 10px;display:flex;gap:14px;align-items:center;font-size:13px}
  .boss .tb b{font-weight:700}
  .boss .menu{display:flex;gap:14px;padding:6px 10px;border-bottom:1px solid #d0d0d0;background:#f3f3f3;color:#333;white-space:nowrap;overflow:hidden}
  .boss .fx{display:flex;gap:8px;align-items:center;padding:4px 8px;border-bottom:1px solid #d0d0d0}
  .boss .fx span{border:1px solid #ccc;padding:2px 6px;min-width:42px;text-align:center}
  .boss .fx i{font-style:italic;color:#555}
  .boss .grid{flex:1;overflow:hidden;display:grid;grid-template-columns:34px repeat(6,minmax(70px,1fr));grid-auto-rows:22px}
  .boss .grid div{border-right:1px solid #e2e2e2;border-bottom:1px solid #e2e2e2;padding:3px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .boss .grid .h{background:#f3f3f3;color:#555;text-align:center;font-weight:700}
  .boss .grid .n{text-align:right;font-variant-numeric:tabular-nums}
  .boss .grid .t{font-weight:700}
  .boss .grid .sel{outline:2px solid #1f6e43;outline-offset:-2px}
  .boss .tabs{display:flex;gap:2px;background:#f3f3f3;border-top:1px solid #d0d0d0;padding:0 8px}
  .boss .tabs span{padding:6px 12px}.boss .tabs .a{background:#fff;color:#1f6e43;font-weight:700;border-bottom:2px solid #1f6e43}`;
  document.head.appendChild(css);

  const rows = [
    ["Concepto", "Ene", "Feb", "Mar", "Abr", "Total"],
    ["Ventas región norte", 18240, 19310, 17980, 20450],
    ["Ventas región sur", 14120, 13870, 15230, 15990],
    ["Ventas región centro", 22310, 23050, 21980, 24120],
    ["Costo de materiales", -8420, -8910, -8730, -9120],
    ["Logística", -3210, -3340, -3190, -3420],
    ["Nómina", -21500, -21500, -21800, -21800],
    ["Mantenimiento", -1240, -980, -1630, -1105],
    ["Publicidad", -2600, -2900, -2750, -3100],
    ["Otros gastos", -760, -820, -690, -910],
    ["", "", "", "", ""],
    ["Utilidad operativa"],
    ["Margen %"],
    ["", "", "", "", ""],
    ["Pronóstico Q2", 21000, 21500, 22100, 22800],
    ["Variación vs. plan", "2.1%", "-0.8%", "1.4%", "3.0%"],
  ];
  function build() {
    const fmt = (v) => typeof v === "number" ? v.toLocaleString("es-MX") : v;
    let html = '<div class="h"></div>' + ["A", "B", "C", "D", "E", "F"].map((c) => `<div class="h">${c}</div>`).join("");
    const sums = [0, 0, 0, 0];
    rows.forEach((r, i) => {
      let cells = r.slice();
      if (i >= 1 && i <= 9) { r.slice(1, 5).forEach((v, k) => { sums[k] += v; }); cells[5] = r.slice(1, 5).reduce((a, b) => a + b, 0); }
      if (r[0] === "Utilidad operativa") cells = [r[0], ...sums, sums.reduce((a, b) => a + b, 0)];
      if (r[0] === "Margen %") cells = [r[0], ...sums.map((s, k) => (s / (rows[1][k + 1] + rows[2][k + 1] + rows[3][k + 1]) * 100).toFixed(1) + "%"), ""];
      html += `<div class="h">${i + 1}</div>` + [0, 1, 2, 3, 4, 5].map((k) => {
        const v = cells[k] === undefined ? "" : cells[k];
        const cls = (i === 0 || k === 0 && /Utilidad|Margen/.test(v) ? "t " : "") + (typeof v === "number" || /%$/.test(v) ? "n" : "") + (i === 4 && k === 2 ? " sel" : "");
        return `<div class="${cls}">${fmt(v)}</div>`;
      }).join("");
    });
    for (let i = rows.length; i < 40; i++) html += `<div class="h">${i + 1}</div>` + "<div></div>".repeat(6);
    const el = document.createElement("div");
    el.className = "boss";
    el.innerHTML = `<div class="tb"><b>Presupuesto_trimestral_v7_FINAL.xlsx</b><span>Guardado</span></div>
      <div class="menu"><span>Archivo</span><span>Inicio</span><span>Insertar</span><span>Fórmulas</span><span>Datos</span><span>Revisar</span><span>Vista</span></div>
      <div class="fx"><span>C5</span><i>fx</i><span style="flex:1;text-align:left">=SUMA(C2:C4)*0.9</span></div>
      <div class="grid">${html}</div>
      <div class="tabs"><span class="a">Resumen</span><span>Detalle</span><span>Supuestos</span></div>`;
    return el;
  }
  let boss = null;
  function toggle(on) {
    if (!boss) { boss = build(); document.body.appendChild(boss); boss.addEventListener("pointerdown", (e) => { e.preventDefault(); toggle(false); }); }
    const show = on === undefined ? !boss.classList.contains("on") : on;
    boss.classList.toggle("on", show);
    document.title = show ? "Presupuesto_trimestral_v7_FINAL.xlsx" : (document.body.dataset.title || document.title);
    if (show && window.Bano && !window.Bano.isMuted()) { window.__bossMuted = true; window.Bano.setMuted(true); }
    if (!show && window.__bossMuted) { window.__bossMuted = false; window.Bano.setMuted(false); }
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.body.dataset.title = document.title;
    const b = document.createElement("button");
    b.className = "boss-btn"; b.type = "button"; b.textContent = "👔";
    b.setAttribute("aria-label", "Botón de jefe: ocultar el juego");
    b.addEventListener("click", () => toggle(true));
    document.body.appendChild(b);
  });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "F9") toggle(); });
  window.Jefe = { toggle };
})();
