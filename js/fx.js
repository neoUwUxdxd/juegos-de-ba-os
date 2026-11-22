/* =========================================================
   Juegos de Baño — efectos visuales y mascota "Don Rollo"
   ========================================================= */
(function () {
  "use strict";
  let uid = 0;

  // Don Rollo: rollo de papel con carita, estilo pictograma. mood: happy | sad | wow | wink
  function mascot(mood) {
    const S = 'stroke="#1D3B4F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
    const mouths = {
      happy: `<path d="M34 55h16c0 6-4 9-8 9s-8-3-8-9z" fill="#E7685A" ${S}/>`,
      sad: `<path d="M35 61q7-7 14 0" fill="none" ${S}/>`,
      wow: `<rect x="38" y="53" width="8" height="10" rx="4" fill="#E7685A" ${S}/>`,
      wink: `<path d="M35 56q7 6 14 0" fill="none" ${S}/>`,
    };
    const leftEye = mood === "wink"
      ? `<path d="M28 45h8" ${S}/>`
      : '<rect class="eye" x="29" y="40" width="6" height="9" rx="1" fill="#1D3B4F"/>';
    const brows = mood === "sad" ? `<path d="M27 35l9 3M57 35l-9 3" ${S}/>` : "";
    const arms = mood === "happy" || mood === "wow"
      ? `<path d="M10 52 2 38M74 52l8-14" ${S} stroke-width="4"/>`
      : `<path d="M10 54 4 68M74 54l6 14" ${S} stroke-width="4"/>`;
    return `<svg class="rollo" viewBox="0 0 84 100" role="img" aria-label="Don Rollo, la mascota">
      ${arms}
      <path d="M56 84h26v12l-4-3-4 3-4-3-4 3-4-3-6 3z" fill="#fff" ${S}/>
      <path d="M10 16v64a32 9 0 0 0 64 0V16" fill="#fff" ${S}/>
      <path d="M20 28v48" stroke="#1D3B4F" stroke-width="2" stroke-dasharray="3 7" opacity=".25"/>
      <ellipse cx="42" cy="16" rx="32" ry="9" fill="#fff" ${S}/>
      <ellipse cx="42" cy="16" rx="11" ry="3.6" fill="#C9A77C" ${S} stroke-width="2.5"/>
      <rect x="6" y="70" width="72" height="8" fill="#F0BF45" stroke="#1D3B4F" stroke-width="3"/>
      ${brows}
      ${leftEye}
      <rect class="eye" x="49" y="40" width="6" height="9" rx="1" fill="#1D3B4F"/>
      ${mouths[mood] || mouths.happy}
    </svg>`;
  }

  // Capa de efectos
  let layer = null;
  function getLayer() {
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "fx-layer";
      document.body.appendChild(layer);
    }
    return layer;
  }
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function floatText(x, y, text, kind) {
    const el = document.createElement("div");
    el.className = "float-text" + (kind ? " " + kind : "");
    el.textContent = text;
    el.style.left = x + "px"; el.style.top = y + "px";
    getLayer().appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  // Chispas cuadradas en colores de señalética (se mantiene el nombre «bubbles»)
  function bubbles(x, y, n) {
    if (reduced()) return;
    n = n || 8;
    const L = getLayer();
    const cols = ["#F0BF45", "#E7685A", "#2F9FC4", "#3BAA8C", "#FFFFFF"];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "spark";
      const a = Math.random() * Math.PI * 2;
      const d = 30 + Math.random() * 46;
      el.style.left = x - 5 + "px"; el.style.top = y - 5 + "px";
      el.style.setProperty("--c", cols[i % cols.length]);
      el.style.setProperty("--dx", Math.cos(a) * d + "px");
      el.style.setProperty("--dy", Math.sin(a) * d + "px");
      L.appendChild(el);
      setTimeout(() => el.remove(), 580);
    }
  }

  function shake(el) {
    el = el || document.body;
    if (reduced()) return;
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 420);
  }

  // Confeti de papelitos de baño
  function confetti(duration) {
    if (reduced()) return;
    duration = duration || 2600;
    const c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:80";
    document.body.appendChild(c);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const x = c.getContext("2d"); x.scale(dpr, dpr);
    const colors = ["#FFFFFF", "#F0BF45", "#E7685A", "#2F9FC4", "#3BAA8C"];
    const parts = Array.from({ length: 110 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.35,
      vx: (Math.random() - 0.5) * 12, vy: -6 - Math.random() * 10,
      w: 8 + Math.random() * 8, h: 12 + Math.random() * 10,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)],
      flip: Math.random() * 6,
    }));
    const t0 = performance.now();
    (function frame(t) {
      const el = t - t0;
      x.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.vy += 0.28; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.flip += 0.15;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r);
        const sy = Math.cos(p.flip);
        x.scale(1, sy);
        x.globalAlpha = Math.max(0, 1 - el / duration);
        x.fillStyle = p.c;
        x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        x.strokeStyle = "#1D3B4F"; x.lineWidth = 1.5;
        x.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
        x.restore();
      }
      if (el < duration) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  let toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  window.Bano = window.Bano || {};
  window.Bano.mascot = mascot;
  window.Bano.fx = { floatText, bubbles, shake, confetti, toast };
})();
