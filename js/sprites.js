/* =========================================================
   Juegos de Baño — «sprites» con emojis
   Misma API que antes (svg, img, draw, preload, hydrate, favicon),
   pero cada nombre se dibuja con su emoji.
   ========================================================= */
(function () {
  "use strict";
  const E = {
    toilet: "🚽", roll: "🧻", rollGold: "🧻", poop: "💩", plunger: "🪠", duck: "🦆", bubble: "🫧", stink: "💨",
    toothbrush: "🪥", soap: "🧼", sponge: "🧽", bottle: "🧴", razor: "🪒", tub: "🛁", comb: "🪮", bandage: "🩹",
    pill: "💊", teddy: "🧸", faucet: "🚰", drain: "🕳️", key: "🔑", sock: "🧦", banana: "🍌", fish: "🐟",
    phone: "📱", star: "⭐", starEmpty: "☆", heart: "❤️", heartEmpty: "🤍", balloon: "🎈", hand: "🖐️", drop: "💧",
    frog: "🐸", cat: "🐱", dog: "🐶", chick: "🐥", wrench: "🔧", mirror: "🪞", question: "🧠", gauge: "⏱️",
    trophy: "🏆", clock: "⏰", calc: "🧮", check: "✅", cross: "❌", grid: "🎨", laugh: "😂", rocket: "🚀",
    lungs: "🫁", door: "🚪", home: "🏠", sound: "🔊", mute: "🔇", sun: "☀️", moon: "🌙", undo: "↩️",
    trash: "🗑️", bucket: "🪣", pencil: "✏️", eraser: "🧽", download: "💾", arrowL: "⬅️", arrowR: "➡️",
    fire: "🔥", man: "🚹", woman: "🚺", child: "🚸",
  };
  const FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const emoji = (name) => E[name] || "❓";

  function svg(name, cls) {
    return `<svg class="pic${cls ? " " + cls : ""}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">` +
      `<text x="32" y="35" font-size="50" text-anchor="middle" dominant-baseline="central" font-family='${FONT}'>${emoji(name)}</text></svg>`;
  }
  function draw(ctx, name, x, y, size, rot) {
    if (window.Bano && window.Bano.drawEmoji) window.Bano.drawEmoji(ctx, emoji(name), x, y, size * 0.82, rot);
  }
  function img() { return null; }
  function preload() { return Promise.resolve(); }
  function hydrate(root) {
    (root || document).querySelectorAll("[data-sprite]").forEach((el) => {
      el.innerHTML = svg(el.dataset.sprite);
      el.classList.add("spr");
      el.removeAttribute("data-sprite");
    });
  }
  function favicon(name) {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji(name)}</text></svg>`;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
  }

  window.Sprites = { svg, img, draw, preload, hydrate, favicon, emoji, names: Object.keys(E) };
  document.addEventListener("DOMContentLoaded", () => hydrate());
})();
