/* =========================================================
   Zona Peques — voz en español, celebraciones y botones para papás
   ========================================================= */
(function () {
  "use strict";
  const B = window.Bano;

  // ---------- Voz ----------
  let voice = null;
  function pickVoice() {
    try {
      const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      const es = vs.filter((v) => /^es/i.test(v.lang));
      voice = es.find((v) => /es-(MX|US|419)/i.test(v.lang)) || es.find((v) => /es-ES/i.test(v.lang)) || es[0] || null;
    } catch (e) { voice = null; }
  }
  if (window.speechSynthesis) {
    pickVoice();
    try { speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (e) { /* nada */ }
  }
  function say(text, opts) {
    if (B.isMuted() || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    try {
      const o = opts || {};
      if (!o.queue) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice ? voice.lang : "es-MX";
      if (voice) u.voice = voice;
      u.rate = o.rate || 0.95;
      u.pitch = o.pitch || 1.15;
      speechSynthesis.speak(u);
    } catch (e) { /* sin voz */ }
  }

  // ---------- Celebración ----------
  const praises = ["¡Muy bien!", "¡Excelente!", "¡Bravo!", "¡Lo hiciste genial!", "¡Súper!", "¡Qué campeón!"];
  function cheer(text) {
    B.sfx.win();
    B.fx.confetti(2200);
    B.vibrate([30, 50, 30]);
    say(text || B.pick(praises));
  }

  // ---------- Botón «mantén presionado» ----------
  function hold(el, ms, onDone) {
    let t0 = 0, raf = 0;
    const set = (p) => el.style.setProperty("--p", p);
    function tick(now) {
      const p = Math.min(1, (now - t0) / ms);
      set(p);
      if (p >= 1) { stop(); B.sfx.good(); onDone(); return; }
      raf = requestAnimationFrame(tick);
    }
    function begin(e) { e.preventDefault(); t0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    function stop() { cancelAnimationFrame(raf); set(0); }
    el.addEventListener("pointerdown", begin);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el.addEventListener(ev, stop));
    el.addEventListener("click", (e) => e.preventDefault());
  }

  // ---------- Sonidos de animalitos (sintetizados) ----------
  const T = (f, d, o) => B.tone(f, d, o);
  const animalSounds = {
    duck: () => { T(520, 0.13, { type: "sawtooth", to: 380, vol: 0.12 }); T(520, 0.13, { type: "sawtooth", to: 380, vol: 0.12, delay: 0.18 }); },
    frog: () => { T(170, 0.07, { type: "square", vol: 0.1 }); T(150, 0.1, { type: "square", vol: 0.1, delay: 0.1 }); },
    fish: () => { [0, 0.12, 0.24].forEach((d, i) => T(300 + i * 80, 0.08, { to: 800 + i * 100, delay: d, vol: 0.12 })); },
    cat: () => { T(600, 0.18, { type: "triangle", to: 950, vol: 0.13 }); T(950, 0.3, { type: "triangle", to: 520, vol: 0.13, delay: 0.17 }); },
    dog: () => { T(240, 0.12, { type: "square", to: 140, vol: 0.12 }); B.noise(0.12, { from: 900, to: 300, vol: 0.2 }); T(240, 0.12, { type: "square", to: 140, vol: 0.12, delay: 0.22 }); },
    chick: () => { T(1800, 0.06, { to: 2500, vol: 0.1 }); T(1800, 0.06, { to: 2500, vol: 0.1, delay: 0.1 }); T(1800, 0.06, { to: 2500, vol: 0.1, delay: 0.2 }); },
  };

  // Melodía tradicional «Estrellita» (dominio público)
  const twinkle = [262, 262, 392, 392, 440, 440, 392, 349, 349, 330, 330, 294, 294, 262, 392, 392, 349, 349, 330, 330, 294];
  function note(i) { T(twinkle[i % twinkle.length], 0.32, { type: "triangle", vol: 0.14 }); }

  const numWords = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];

  window.Kids = { say, cheer, hold, animalSounds, note, numWords, praises };

  document.addEventListener("DOMContentLoaded", () => {
    // Los navegadores necesitan un primer toque para hablar y sonar
    document.addEventListener("pointerdown", () => { try { B.tone(1, 0.01, { vol: 0.0001 }); } catch (e) { /* nada */ } }, { once: true });
  });
})();
