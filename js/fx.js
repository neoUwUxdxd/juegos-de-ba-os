/* =========================================================
   Juegos de Baño — efectos visuales y mascota "Don Rollo"
   ========================================================= */
(function () {
  "use strict";
  let uid = 0;

  // Don Rollo: rollo de papel con carita. mood: happy | sad | wow | wink
  function mascot(mood) {
    const id = "dr" + (++uid);
    const mouths = {
      happy: '<path d="M34 55 Q42 64 50 55" fill="#ff7a9c" stroke="#23364a" stroke-width="2.4" stroke-linecap="round"/>',
      sad: '<path d="M35 60 Q42 53 49 60" fill="none" stroke="#23364a" stroke-width="2.6" stroke-linecap="round"/>',
      wow: '<ellipse cx="42" cy="58" rx="4.5" ry="5.5" fill="#ff7a9c" stroke="#23364a" stroke-width="2.2"/>',
      wink: '<path d="M35 56 Q42 62 49 56" fill="none" stroke="#23364a" stroke-width="2.6" stroke-linecap="round"/>',
    };
    const leftEye = mood === "wink"
      ? '<path d="M28 45 Q32 41 36 45" fill="none" stroke="#23364a" stroke-width="2.6" stroke-linecap="round"/>'
      : '<g class="eye"><ellipse cx="32" cy="45" rx="4.4" ry="5.6" fill="#23364a"/><circle cx="33.6" cy="43" r="1.6" fill="#fff"/></g>';
    const brows = mood === "sad"
      ? '<path d="M27 36 L35 38 M57 36 L49 38" stroke="#23364a" stroke-width="2.2" stroke-linecap="round"/>'
      : "";
    const arms = mood === "happy" || mood === "wow"
      ? '<path d="M10 50 Q2 44 4 34" fill="none" stroke="#23364a" stroke-width="3" stroke-linecap="round"/><path d="M74 50 Q82 44 80 34" fill="none" stroke="#23364a" stroke-width="3" stroke-linecap="round"/>'
      : '<path d="M10 52 Q4 58 6 66" fill="none" stroke="#23364a" stroke-width="3" stroke-linecap="round"/><path d="M74 52 Q80 58 78 66" fill="none" stroke="#23364a" stroke-width="3" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 84 100" role="img" aria-label="Don Rollo, la mascota">
      <defs>
        <linearGradient id="${id}" x1="0" x2="1">
          <stop offset="0" stop-color="#dfe7ee"/><stop offset=".32" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd9e2"/>
        </linearGradient>
      </defs>
      ${arms}
      <path d="M58 82 C 62 92 70 96 82 95 L80 99 L77 96 L74 99 L71 96 L68 99 C 60 98 54 92 52 84 Z" fill="#fff" stroke="#23364a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 16 V80 A32 10 0 0 0 74 80 V16" fill="url(#${id})" stroke="#23364a" stroke-width="2.6"/>
      <path d="M14 30 V74" stroke="rgba(35,54,74,.08)" stroke-width="3" stroke-dasharray="2 6"/>
      <ellipse cx="42" cy="16" rx="32" ry="10" fill="#fff" stroke="#23364a" stroke-width="2.6"/>
      <ellipse cx="42" cy="16" rx="11" ry="4.2" fill="#c9a77c" stroke="#23364a" stroke-width="2"/>
      ${brows}
      ${leftEye}
      <g class="eye"><ellipse cx="52" cy="45" rx="4.4" ry="5.6" fill="#23364a"/><circle cx="53.6" cy="43" r="1.6" fill="#fff"/></g>
      <circle cx="25" cy="54" r="5" fill="#ff8fb1" opacity=".55"/>
      <circle cx="59" cy="54" r="5" fill="#ff8fb1" opacity=".55"/>
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

  function bubbles(x, y, n) {
    if (reduced()) return;
    n = n || 8;
    const L = getLayer();
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "bubble-pop";
      const s = 8 + Math.random() * 16;
      const a = Math.random() * Math.PI * 2;
      const d = 30 + Math.random() * 50;
      el.style.width = el.style.height = s + "px";
      el.style.left = x - s / 2 + "px"; el.style.top = y - s / 2 + "px";
      el.style.setProperty("--dx", Math.cos(a) * d + "px");
      el.style.setProperty("--dy", Math.sin(a) * d - 20 + "px");
      L.appendChild(el);
      setTimeout(() => el.remove(), 720);
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
    const colors = ["#ffffff", "#ff8fb1", "#4fd1b5", "#ffd45e", "#67b8ff", "#b79bff"];
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
        x.strokeStyle = "rgba(35,54,74,.18)";
        x.setLineDash([2, 2]);
        x.beginPath(); x.moveTo(-p.w / 2, 0); x.lineTo(p.w / 2, 0); x.stroke();
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
