/* =========================================================
   Juegos de Baño — utilidades comunes
   (récords, sonidos, vibración, pantallas, lienzo, azar)
   ========================================================= */
(function () {
  "use strict";

  // ---------- Almacenamiento seguro ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("bano:" + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("bano:" + key, JSON.stringify(value)); } catch (e) { /* sin storage */ }
    },
  };

  // Tema guardado (se aplica lo antes posible)
  const savedTheme = store.get("theme", null);
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  // ---------- Azar ----------
  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- Récords ----------
  function best(id) { return store.get("best:" + id, null); }
  function plays(id) { return store.get("plays:" + id, 0); }
  function totalPlays() {
    return ["lluvia", "cadena", "burbujas", "memorama", "tuberia", "trivia", "aterriza", "mate", "verdad"]
      .reduce((s, id) => s + plays(id), 0);
  }
  function saveScore(id, score, lowerIsBetter) {
    store.set("plays:" + id, plays(id) + 1);
    const prev = best(id);
    const isRecord = prev === null || (lowerIsBetter ? score < prev : score > prev);
    if (isRecord) store.set("best:" + id, score);
    return { best: isRecord ? score : prev, isRecord, prev };
  }

  // ---------- Sonido (Web Audio sintetizado) ----------
  let actx = null;
  let muted = store.get("muted", false);
  function ctx() {
    if (muted) return null;
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      return actx;
    } catch (e) { return null; }
  }
  function tone(freq, dur, opts) {
    const c = ctx(); if (!c) return;
    const o = Object.assign({ type: "sine", to: null, vol: 0.18, delay: 0 }, opts || {});
    const t0 = c.currentTime + o.delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = o.type;
    osc.frequency.setValueAtTime(freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  function noise(dur, opts) {
    const c = ctx(); if (!c) return;
    const o = Object.assign({ from: 1800, to: 200, vol: 0.25, q: 2 }, opts || {});
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = o.q;
    const t0 = c.currentTime;
    f.frequency.setValueAtTime(o.from, t0);
    f.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
    const g = c.createGain(); g.gain.value = o.vol;
    src.connect(f).connect(g).connect(c.destination);
    src.start();
  }
  const sfx = {
    click: () => tone(900, 0.05, { type: "triangle", vol: 0.08 }),
    plop: () => tone(520, 0.14, { to: 140, vol: 0.25 }),
    bubble: () => { tone(380, 0.09, { to: 1100, vol: 0.14 }); },
    good: () => { tone(660, 0.1, { type: "triangle" }); tone(990, 0.14, { type: "triangle", delay: 0.08 }); },
    bad: () => { tone(220, 0.25, { type: "square", to: 90, vol: 0.08 }); },
    gold: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, { type: "triangle", delay: i * 0.06, vol: 0.12 })),
    win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.18, { type: "triangle", delay: i * 0.09, vol: 0.14 })),
    flush: () => { noise(1.1, { from: 2400, to: 160, vol: 0.35, q: 1.2 }); tone(300, 0.9, { to: 60, vol: 0.08 }); },
    tick: () => tone(1400, 0.03, { type: "square", vol: 0.04 }),
    swish: () => noise(0.18, { from: 600, to: 3000, vol: 0.15, q: 0.8 }),
  };
  function setMuted(m) { muted = m; store.set("muted", m); }

  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* nada */ } }

  // ---------- Pantallas superpuestas ----------
  function overlay(el, show) {
    if (typeof el === "string") el = document.getElementById(el);
    if (el) el.classList.toggle("show", !!show);
  }

  // Fin de partida con "certificado de visita"
  function gameOver(o) {
    const res = saveScore(o.id, o.score, o.lowerIsBetter);
    const titles = o.titles || [];
    // titles: [{ min, t }] ordenados de mayor a menor exigencia
    let title = titles.length ? titles[titles.length - 1].t : "";
    for (const tt of titles) {
      const ok = o.lowerIsBetter ? o.score <= tt.min : o.score >= tt.min;
      if (ok) { title = tt.t; break; }
    }
    const fmt = o.format || ((v) => String(v));
    const mood = res.isRecord ? "happy" : (o.good ? "happy" : "sad");
    const phrases = res.isRecord
      ? ["¡Récord! Esto merece otra descarga 🎉", "¡Increíble! Lávate las manos y presume.", "¡Nuevo récord! El trono es tuyo."]
      : o.good
        ? ["¡Bien jugado! ¿Otra partidita?", "Nada mal… nadie tiene prisa, ¿verdad?"]
        : ["Uy… ¿otra vez? Nadie está tocando la puerta.", "Casi. Las piernas aún no se duermen, ¡sigue!", "Respira hondo… mejor no tan hondo."];
    let end = document.getElementById("end");
    if (!end) {
      end = document.createElement("div");
      end.id = "end"; end.className = "overlay";
      document.body.appendChild(end);
    }
    end.innerHTML = `
      <div class="panel">
        <div class="mascot">${Bano.mascot(mood)}<div class="bubble">${pick(phrases)}</div></div>
        <div class="certificate">
          ${res.isRecord ? '<div class="stamp">¡NUEVO RÉCORD!</div>' : ""}
          <div class="cert-label">Certificado de visita</div>
          <div class="cert-title">${title}</div>
          <div class="cert-score">${fmt(o.score)}</div>
          <div class="cert-best">${o.detail ? o.detail + " · " : ""}Récord: ${res.best === null ? "—" : fmt(res.best)}</div>
        </div>
        <div class="actions">
          <button class="btn" data-act="retry">🔁 Otra vez</button>
          <a class="btn ghost" href="${o.back || "../index.html"}" style="text-decoration:none">🚪 Salir al pasillo</a>
        </div>
      </div>`;
    end.querySelector('[data-act="retry"]').addEventListener("click", () => {
      sfx.click(); overlay(end, false); o.onRetry && o.onRetry();
    });
    requestAnimationFrame(() => overlay(end, true));
    if (res.isRecord) { sfx.win(); Bano.fx && Bano.fx.confetti(); vibrate([40, 60, 40]); }
    return res;
  }

  // ---------- Lienzo ----------
  function fitCanvas(canvas, onResize) {
    const ctx2d = canvas.getContext("2d");
    const state = { w: 0, h: 0, dpr: 1, ctx: ctx2d };
    function resize(initial) {
      const r = canvas.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      state.w = Math.max(1, r.width); state.h = Math.max(1, r.height);
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      ctx2d.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      if (initial !== true && onResize) onResize(state);
    }
    resize(true); // el primer ajuste no llama a onResize
    window.addEventListener("resize", () => resize());
    return state;
  }

  // Emojis pre-renderizados (más rápido que fillText cada frame)
  const spriteCache = new Map();
  function emojiSprite(emoji, size) {
    const key = emoji + "|" + size;
    if (spriteCache.has(key)) return spriteCache.get(key);
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const c = document.createElement("canvas");
    const pad = Math.ceil(size * 0.25);
    c.width = c.height = Math.ceil((size + pad * 2) * dpr);
    const x = c.getContext("2d");
    x.scale(dpr, dpr);
    x.textAlign = "center"; x.textBaseline = "middle";
    x.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    x.fillText(emoji, size / 2 + pad, size / 2 + pad + size * 0.06);
    const s = { canvas: c, size: size + pad * 2 };
    spriteCache.set(key, s);
    return s;
  }
  function drawEmoji(ctx2d, emoji, x, y, size, rot) {
    const s = emojiSprite(emoji, Math.round(size));
    if (rot) {
      ctx2d.save(); ctx2d.translate(x, y); ctx2d.rotate(rot);
      ctx2d.drawImage(s.canvas, -s.size / 2, -s.size / 2, s.size, s.size);
      ctx2d.restore();
    } else {
      ctx2d.drawImage(s.canvas, x - s.size / 2, y - s.size / 2, s.size, s.size);
    }
  }

  // Dibujo de pictogramas (en este diseño son emojis; ver js/sprites.js)
  function drawSprite(ctx2d, name, x, y, size, rot) {
    if (window.Sprites) window.Sprites.draw(ctx2d, name, x, y, size, rot);
  }

  // Botón de silencio en el HUD
  function bindMute(btn) {
    if (!btn) return;
    const paint = () => { btn.textContent = muted ? "🔇" : "🔊"; btn.setAttribute("aria-label", muted ? "Activar sonido" : "Silenciar"); };
    paint();
    btn.addEventListener("click", () => { setMuted(!muted); paint(); if (!muted) sfx.click(); });
  }

  function bump(el) {
    if (!el) return;
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  }

  window.Bano = {
    store, rand, randInt, pick, shuffle, clamp,
    best, plays, totalPlays, saveScore,
    sfx, tone, noise, setMuted, isMuted: () => muted,
    vibrate, overlay, gameOver, fitCanvas, drawEmoji, emojiSprite, drawSprite, bindMute, bump,
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindMute(document.getElementById("mute"));
  });
})();
