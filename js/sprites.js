/* =========================================================
   Juegos de Baño — pictogramas propios (SVG, estilo señalética)
   Trazo negro de 3px y rellenos planos. Sin emojis.
   ========================================================= */
(function () {
  "use strict";
  const K = "#111", W = "#FFFFFF", Y = "#FFD400", R = "#E4312B", B = "#1E5BC6", G = "#1F9D55";
  const O = "#F28C28", BR = "#8A5A2E", MT = "#A9B3BB", PK = "#F49AC1", SK = "#F6C9A0", LB = "#BFE0FF", CB = "#C9A77C";

  // Cada pictograma: contenido SVG en un lienzo de 64×64
  const P = {
    toilet: `<rect x="15" y="5" width="34" height="19" rx="3" fill="${W}"/><rect x="20" y="10" width="10" height="4" rx="2" fill="${K}" stroke="none"/>
      <path d="M8 27h48v4c0 11-9 18-18 18l2 9H24l2-9C17 49 8 42 8 31z" fill="${W}"/><path d="M14 31h36" />`,
    roll: `<path d="M12 15v36a17 6 0 0 0 34 0V15" fill="${W}"/><ellipse cx="29" cy="15" rx="17" ry="6" fill="${W}"/>
      <ellipse cx="29" cy="15" rx="6" ry="2.4" fill="${CB}"/><path d="M46 21h8v35l-3-3-3 3-2-2z" fill="${W}"/><path d="M46 36h8" stroke-dasharray="2 3"/>`,
    rollGold: `<path d="M12 15v36a17 6 0 0 0 34 0V15" fill="${Y}"/><ellipse cx="29" cy="15" rx="17" ry="6" fill="${Y}"/>
      <ellipse cx="29" cy="15" rx="6" ry="2.4" fill="${CB}"/><path d="M46 21h8v35l-3-3-3 3-2-2z" fill="${Y}"/>
      <path d="M20 30l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="${W}" stroke-width="2"/>`,
    poop: `<path d="M9 51c0-6 5-10 11-10-3-6 3-12 10-12-2-7 4-13 10-18 2 7 7 9 5 16 6 1 9 7 6 13 6 1 9 6 7 11-2 5-10 6-24 6S9 57 9 51z" fill="${BR}"/>
      <circle cx="27" cy="44" r="3" fill="${W}" stroke="none"/><circle cx="39" cy="44" r="3" fill="${W}" stroke="none"/>
      <circle cx="27.5" cy="44.5" r="1.4" fill="${K}" stroke="none"/><circle cx="39.5" cy="44.5" r="1.4" fill="${K}" stroke="none"/>`,
    plunger: `<rect x="29" y="4" width="6" height="34" rx="2" fill="${O}"/><path d="M13 51c0-10 8-15 19-15s19 5 19 15z" fill="${R}"/><rect x="10" y="50" width="44" height="7" rx="2" fill="${R}"/>`,
    duck: `<path d="M12 40c0-8 8-11 17-9-4-3-6-9-2-15 4-6 14-6 18 0 2 4 1 8-2 10 7 2 12 7 10 15-2 9-12 12-22 12S12 50 12 40z" fill="${Y}"/>
      <path d="M43 22l12 2-9 5z" fill="${O}"/><circle cx="37" cy="17" r="2.6" fill="${K}" stroke="none"/><path d="M21 41c4-4 12-3 15 3-6 3-12 2-15-3z" fill="none"/>`,
    bubble: `<circle cx="32" cy="32" r="24" fill="${LB}"/><path d="M19 26a14 14 0 0 1 10-10" stroke="${W}" stroke-width="5"/><circle cx="44" cy="44" r="3" fill="${W}" stroke="none"/>`,
    stink: `<path d="M14 44c-6 0-8-8-2-10-2-7 6-11 11-7 2-6 11-7 14-1 6-2 11 3 9 9 6 1 7 9 1 10z" fill="#9CC24A"/>
      <path d="M22 34q3 3 0 6M32 32q3 3 0 6M42 34q3 3 0 6" fill="none"/><path d="M20 52q4-3 8 0t8 0 8 0" fill="none"/>`,
    toothbrush: `<g transform="rotate(-30 32 32)"><rect x="4" y="36" width="40" height="8" rx="4" fill="${B}"/><rect x="40" y="34" width="20" height="10" rx="3" fill="${W}"/>
      <rect x="42" y="22" width="16" height="12" fill="${W}"/><path d="M46 22v12M50 22v12M54 22v12" stroke-width="2"/></g>`,
    soap: `<rect x="9" y="27" width="46" height="26" rx="11" fill="${PK}"/><path d="M18 36h18" stroke="${W}" stroke-width="4"/>
      <circle cx="22" cy="17" r="6" fill="${LB}"/><circle cx="36" cy="12" r="4" fill="${LB}"/><circle cx="45" cy="19" r="3" fill="${LB}"/>`,
    sponge: `<rect x="9" y="25" width="46" height="26" rx="5" fill="${Y}"/><rect x="9" y="15" width="46" height="10" rx="3" fill="${G}"/>
      <circle cx="19" cy="34" r="2.5" fill="${O}" stroke="none"/><circle cx="31" cy="41" r="3" fill="${O}" stroke="none"/><circle cx="44" cy="33" r="2.5" fill="${O}" stroke="none"/><circle cx="46" cy="44" r="2" fill="${O}" stroke="none"/>`,
    bottle: `<rect x="17" y="23" width="30" height="35" rx="6" fill="${B}"/><rect x="26" y="13" width="12" height="10" fill="${W}"/><path d="M22 7h20v6H22z" fill="${K}"/>
      <path d="M42 7h8v4" fill="none"/><rect x="22" y="32" width="20" height="14" fill="${W}"/><path d="M26 39h12" stroke-width="2"/>`,
    razor: `<rect x="29" y="22" width="6" height="36" rx="3" fill="${G}"/><rect x="14" y="8" width="36" height="14" rx="3" fill="${MT}"/><path d="M17 15h30" stroke-width="2"/>`,
    tub: `<path d="M6 30h52v6c0 10-8 16-18 16H24C14 52 6 46 6 36z" fill="${W}"/><path d="M16 52l-3 7M48 52l3 7"/>
      <path d="M12 30V14a6 6 0 0 1 12 0" fill="none"/><path d="M20 16h8" /><circle cx="26" cy="22" r="1.6" fill="${B}" stroke="none"/><circle cx="23" cy="25" r="1.6" fill="${B}" stroke="none"/>
      <path d="M8 36h48" stroke="${B}" stroke-width="4"/>`,
    comb: `<rect x="8" y="18" width="48" height="12" rx="3" fill="${R}"/><path d="M12 30v16M18 30v16M24 30v16M30 30v16M36 30v16M42 30v16M48 30v16M53 30v16" stroke-width="3"/>`,
    bandage: `<g transform="rotate(-35 32 32)"><rect x="4" y="22" width="56" height="20" rx="10" fill="#E8B98A"/><rect x="22" y="22" width="20" height="20" fill="#F3D9BC"/>
      <circle cx="12" cy="32" r="1.4" fill="${K}" stroke="none"/><circle cx="52" cy="32" r="1.4" fill="${K}" stroke="none"/></g>`,
    pill: `<g transform="rotate(-40 32 32)"><path d="M32 20h12a12 12 0 0 1 0 24H32z" fill="${W}"/><path d="M32 20H20a12 12 0 0 0 0 24h12z" fill="${R}"/></g>`,
    teddy: `<circle cx="17" cy="18" r="8" fill="${BR}"/><circle cx="47" cy="18" r="8" fill="${BR}"/><circle cx="32" cy="34" r="20" fill="${O}"/>
      <ellipse cx="32" cy="42" rx="9" ry="7" fill="${W}"/><circle cx="25" cy="30" r="2.5" fill="${K}" stroke="none"/><circle cx="39" cy="30" r="2.5" fill="${K}" stroke="none"/><path d="M29 40h6l-3 3z" fill="${K}"/>`,
    faucet: `<rect x="6" y="20" width="10" height="16" fill="${MT}"/><path d="M16 22h22a10 10 0 0 1 10 10v6H38v-4a2 2 0 0 0-2-2H16z" fill="${MT}"/>
      <rect x="22" y="10" width="12" height="12" fill="${MT}"/><path d="M18 10h20" stroke="${R}" stroke-width="5"/><path d="M43 44c-3 5-4 8 0 11 4-3 3-6 0-11z" fill="${B}"/>`,
    drain: `<circle cx="32" cy="32" r="24" fill="${MT}"/><circle cx="32" cy="32" r="16" fill="#5C666E"/><path d="M22 32h20M32 22v20M25 25l14 14M39 25 25 39" stroke-width="3"/>`,
    key: `<circle cx="18" cy="32" r="11" fill="${Y}"/><circle cx="18" cy="32" r="4" fill="${W}"/><rect x="28" y="28" width="28" height="8" fill="${Y}"/><path d="M48 36v8M54 36v6" />`,
    sock: `<path d="M22 6h20v28l-2 6c-3 8-10 14-19 14-6 0-11-4-11-10 0-5 4-8 9-11l3-2z" fill="${R}"/><path d="M22 14h20" stroke="${W}" stroke-width="5"/><path d="M22 22h20" stroke="${W}" stroke-width="5"/>`,
    banana: `<path d="M10 20c6 20 22 30 42 26 2-1 2-4 0-4-16 1-28-8-34-26-1-3-9-1-8 4z" fill="${Y}"/><path d="M12 16l-2-6" stroke-width="4"/>`,
    fish: `<path d="M8 32c8-12 30-14 40 0-10 14-32 12-40 0z" fill="${O}"/><path d="M48 32l10-9v18z" fill="${O}"/><circle cx="20" cy="30" r="2.6" fill="${K}" stroke="none"/><path d="M30 24q4 8 0 16" fill="none"/>`,
    phone: `<rect x="18" y="6" width="28" height="52" rx="5" fill="${K}"/><rect x="22" y="12" width="20" height="36" fill="${B}" stroke="none"/><circle cx="32" cy="53" r="2" fill="${W}" stroke="none"/>`,
    star: `<path d="M32 6l7.6 16.4 17.9 2-13.3 12.2 3.7 17.6L32 45.3 16.1 54.2l3.7-17.6L6.5 24.4l17.9-2z" fill="${Y}"/>`,
    starEmpty: `<path d="M32 6l7.6 16.4 17.9 2-13.3 12.2 3.7 17.6L32 45.3 16.1 54.2l3.7-17.6L6.5 24.4l17.9-2z" fill="none" stroke-dasharray="4 4"/>`,
    heart: `<path d="M32 54S8 40 8 23c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 17-24 31-24 31z" fill="${R}"/>`,
    heartEmpty: `<path d="M32 54S8 40 8 23c0-8 6-14 13-14 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 6 13 14 0 17-24 31-24 31z" fill="none" opacity=".35"/>`,
    balloon: `<ellipse cx="32" cy="25" rx="18" ry="21" fill="${R}"/><path d="M29 46h6l-3 4z" fill="${R}"/><path d="M32 50q-5 6 0 12" fill="none" stroke-width="2"/><path d="M22 18q2-6 8-8" stroke="${W}" stroke-width="4"/>`,
    hand: `<rect x="17" y="10" width="8" height="28" rx="4" fill="${SK}"/><rect x="25" y="5" width="8" height="30" rx="4" fill="${SK}"/>
      <rect x="33" y="7" width="8" height="30" rx="4" fill="${SK}"/><rect x="41" y="13" width="8" height="26" rx="4" fill="${SK}"/>
      <rect x="4" y="30" width="20" height="9" rx="4.5" transform="rotate(35 14 34)" fill="${SK}"/><path d="M17 30h32v14c0 9-7 15-16 15s-16-6-16-15z" fill="${SK}"/>`,
    drop: `<path d="M32 6C22 22 14 31 14 41a18 18 0 0 0 36 0C50 31 42 22 32 6z" fill="${B}"/><path d="M22 42a10 10 0 0 0 6 9" stroke="${W}" stroke-width="4" fill="none"/>`,
    frog: `<ellipse cx="32" cy="40" rx="24" ry="16" fill="${G}"/><circle cx="20" cy="22" r="9" fill="${G}"/><circle cx="44" cy="22" r="9" fill="${G}"/>
      <circle cx="20" cy="22" r="4" fill="${W}"/><circle cx="44" cy="22" r="4" fill="${W}"/><circle cx="20" cy="22" r="1.8" fill="${K}" stroke="none"/><circle cx="44" cy="22" r="1.8" fill="${K}" stroke="none"/>
      <path d="M20 42q12 8 24 0" fill="none"/>`,
    cat: `<path d="M12 28 14 8l12 10h12l12-10 2 20c2 4 2 8 2 10 0 11-10 18-22 18S10 49 10 38c0-3 0-6 2-10z" fill="${O}"/>
      <circle cx="24" cy="34" r="3" fill="${K}" stroke="none"/><circle cx="40" cy="34" r="3" fill="${K}" stroke="none"/><path d="M29 41h6l-3 3z" fill="${PK}"/>
      <path d="M4 38l14 2M4 46l14-2M60 38l-14 2M60 46l-14-2" stroke-width="2"/>`,
    dog: `<ellipse cx="32" cy="36" rx="18" ry="19" fill="#D9A066"/><path d="M14 22c-8 4-8 20-2 24 4-4 6-14 4-24z" fill="${BR}"/><path d="M50 22c8 4 8 20 2 24-4-4-6-14-4-24z" fill="${BR}"/>
      <circle cx="25" cy="32" r="3" fill="${K}" stroke="none"/><circle cx="39" cy="32" r="3" fill="${K}" stroke="none"/><ellipse cx="32" cy="42" rx="5" ry="3.5" fill="${K}"/><path d="M32 46v4" />`,
    chick: `<circle cx="32" cy="36" r="20" fill="${Y}"/><path d="M28 16q4-8 8 0" fill="none"/><path d="M44 34l10 3-10 3z" fill="${O}"/><circle cx="38" cy="30" r="2.6" fill="${K}" stroke="none"/>
      <path d="M18 40q6 6 12 0" fill="none"/><path d="M26 56v4M38 56v4" stroke="${O}"/>`,
    wrench: `<g transform="rotate(40 32 32)"><path d="M22 4h7v11h6V4h7v15a10 10 0 0 1-6 9v30h-8V28a10 10 0 0 1-6-9z" fill="${MT}"/></g>`,
    mirror: `<rect x="12" y="6" width="40" height="52" rx="4" fill="${LB}"/><path d="M20 22l14-12M20 34l24-20M30 44l14-12" stroke="${W}" stroke-width="4"/><path d="M28 30h8M32 26v8" stroke="${R}" stroke-width="5"/>`,
    question: `<circle cx="32" cy="32" r="25" fill="${Y}"/><path d="M24 25a8 8 0 1 1 12 7c-3 2-4 3-4 7" fill="none" stroke-width="5"/><circle cx="32" cy="47" r="3" fill="${K}" stroke="none"/>`,
    gauge: `<path d="M8 44a24 24 0 0 1 48 0z" fill="${W}"/><path d="M14 44a18 18 0 0 1 8-15" stroke="${R}" stroke-width="5" fill="none"/><path d="M42 29a18 18 0 0 1 8 15" stroke="${G}" stroke-width="5" fill="none"/><path d="M32 44l10-16" stroke-width="4"/><circle cx="32" cy="44" r="4" fill="${K}"/>`,
    trophy: `<path d="M18 8h28v14a14 14 0 0 1-28 0z" fill="${Y}"/><path d="M18 12H8c0 10 4 14 10 15M46 12h10c0 10-4 14-10 15" fill="none"/><rect x="28" y="36" width="8" height="10" fill="${Y}"/><rect x="18" y="46" width="28" height="10" rx="2" fill="${K}"/>`,
    clock: `<circle cx="32" cy="32" r="25" fill="${W}"/><path d="M32 16v16l10 6" stroke-width="4"/><circle cx="32" cy="32" r="2.5" fill="${K}"/>`,
    calc: `<rect x="12" y="6" width="40" height="52" rx="4" fill="${B}"/><rect x="18" y="12" width="28" height="12" fill="${W}"/><path d="M22 34h6M25 31v6M36 34h6M22 48h6M36 46h6M36 50h6" stroke="${W}" stroke-width="3"/>`,
    check: `<circle cx="32" cy="32" r="25" fill="${G}"/><path d="M20 33l8 8 16-17" stroke="${W}" stroke-width="6" fill="none"/>`,
    cross: `<circle cx="32" cy="32" r="25" fill="${R}"/><path d="M22 22l20 20M42 22 22 42" stroke="${W}" stroke-width="6"/>`,
    grid: `<rect x="8" y="8" width="48" height="48" fill="${W}"/><rect x="8" y="8" width="16" height="16" fill="${R}"/><rect x="24" y="24" width="16" height="16" fill="${Y}"/><rect x="40" y="40" width="16" height="16" fill="${B}"/><rect x="40" y="8" width="16" height="16" fill="${G}"/><path d="M24 8v48M40 8v48M8 24h48M8 40h48" stroke-width="2"/>`,
    laugh: `<circle cx="32" cy="32" r="25" fill="${Y}"/><path d="M20 26l5-3-5-3M44 26l-5-3 5-3" fill="none"/><path d="M18 34h28c0 9-6 15-14 15s-14-6-14-15z" fill="${K}"/><path d="M24 44q8 5 16 0" stroke="${R}" stroke-width="4" fill="none"/>`,
    rocket: `<path d="M14 6h28v12H14z" fill="${W}"/><path d="M8 22h40v4c0 10-8 16-17 16l2 8H21l2-8C14 42 8 36 8 26z" fill="${W}"/><path d="M20 50l7 12 7-12z" fill="${O}"/><path d="M24 50l3 7 3-7z" fill="${Y}" stroke="none"/>`,
    lungs: `<path d="M32 8v20" /><path d="M28 22c-8-6-18 4-18 18 0 10 4 16 12 16 6 0 8-6 8-14V24z" fill="${PK}"/><path d="M36 22c8-6 18 4 18 18 0 10-4 16-12 16-6 0-8-6-8-14V24z" fill="${PK}"/>`,
    // Interfaz
    door: `<rect x="14" y="6" width="30" height="52" fill="${W}"/><circle cx="38" cy="33" r="2.6" fill="${K}" stroke="none"/><path d="M44 32h12M50 26l6 6-6 6" fill="none"/>`,
    home: `<path d="M8 30 32 8l24 22" fill="none" stroke-width="5"/><path d="M14 26v30h36V26" fill="${Y}"/><rect x="27" y="38" width="10" height="18" fill="${R}"/>`,
    sound: `<path d="M8 24h10l14-12v40L18 40H8z" fill="${W}"/><path d="M40 22q8 10 0 20M46 16q14 16 0 32" fill="none" stroke-width="4"/>`,
    mute: `<path d="M8 24h10l14-12v40L18 40H8z" fill="${W}"/><path d="M40 24l16 16M56 24 40 40" stroke-width="5"/>`,
    sun: `<circle cx="32" cy="32" r="11" fill="${Y}"/><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M51 13l-6 6M19 45l-6 6" stroke-width="4"/>`,
    moon: `<path d="M40 8a24 24 0 1 0 16 36A20 20 0 0 1 40 8z" fill="${Y}"/>`,
    undo: `<path d="M20 14 8 26l12 12" fill="none" stroke-width="5"/><path d="M10 26h28a16 16 0 0 1 0 32H26" fill="none" stroke-width="5"/>`,
    trash: `<path d="M14 18h36l-3 40H17z" fill="${W}"/><path d="M8 18h48M24 18v-8h16v8" fill="none" stroke-width="4"/><path d="M26 28v20M38 28v20" stroke-width="3"/>`,
    bucket: `<path d="M12 24h32l-4 32H16z" fill="${B}"/><path d="M12 24c0-10 32-10 32 0" fill="none"/><path d="M44 30c8 2 10 10 6 16" stroke="${B}" stroke-width="5" fill="none"/>`,
    pencil: `<g transform="rotate(45 32 32)"><rect x="26" y="6" width="12" height="40" fill="${Y}"/><path d="M26 46h12l-6 12z" fill="${SK}"/><path d="M30 54h4l-2 4z" fill="${K}"/><rect x="26" y="2" width="12" height="6" fill="${PK}"/></g>`,
    eraser: `<g transform="rotate(-35 32 32)"><rect x="10" y="22" width="44" height="20" rx="3" fill="${PK}"/><rect x="10" y="22" width="16" height="20" rx="3" fill="${B}"/></g>`,
    download: `<path d="M32 8v32M20 28l12 12 12-12" fill="none" stroke-width="5"/><path d="M10 44v10h44V44" fill="none" stroke-width="5"/>`,
    arrowL: `<path d="M40 10 18 32l22 22" fill="none" stroke-width="7"/>`,
    arrowR: `<path d="M24 10l22 22-22 22" fill="none" stroke-width="7"/>`,
    fire: `<path d="M32 6c4 12 18 18 18 34a18 18 0 0 1-36 0c0-8 4-12 8-16 0 6 2 10 6 10-4-10 0-20 4-28z" fill="${O}"/><path d="M32 34c2 6 8 8 8 14a8 8 0 0 1-16 0c0-6 6-8 8-14z" fill="${Y}"/>`,
    // Personas (letrero de entrada)
    man: `<circle cx="32" cy="10" r="7" fill="currentColor" stroke="none"/><path d="M20 20h24v20h-5v22h-6V44h-2v18h-6V40h-5z" fill="currentColor" stroke="none"/>`,
    woman: `<circle cx="32" cy="10" r="7" fill="currentColor" stroke="none"/><path d="M26 20h12l8 24H38v18h-5V46h-2v16h-5V44h-8z" fill="currentColor" stroke="none"/>`,
    child: `<circle cx="32" cy="20" r="6" fill="currentColor" stroke="none"/><path d="M23 29h18v15h-4v18h-5V48h0v14h-5V44h-4z" fill="currentColor" stroke="none"/>`,
  };

  const ATTR = `stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  function svg(name, cls) {
    const body = P[name] || P.question;
    return `<svg class="pic${cls ? " " + cls : ""}" viewBox="0 0 64 64" ${ATTR} aria-hidden="true" focusable="false">${body}</svg>`;
  }

  // Imagen rasterizada para canvas (cacheada por nombre y tamaño)
  const cache = new Map();
  function img(name, size) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const px = Math.max(8, Math.round(size * dpr));
    const key = name + "|" + px;
    if (cache.has(key)) return cache.get(key);
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 64 64" ${ATTR}>${P[name] || P.question}</svg>`;
    const im = new Image();
    im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
    cache.set(key, im);
    return im;
  }
  function draw(ctx, name, x, y, size, rot) {
    const im = img(name, size);
    if (!im.complete || !im.naturalWidth) return;
    if (rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.drawImage(im, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else ctx.drawImage(im, x - size / 2, y - size / 2, size, size);
  }
  function preload(names, size) {
    return Promise.all(names.map((n) => new Promise((res) => {
      const im = img(n, size);
      if (im.complete) res(); else { im.onload = res; im.onerror = res; }
    })));
  }
  // Reemplaza <i data-sprite="nombre"></i> por su SVG
  function hydrate(root) {
    (root || document).querySelectorAll("[data-sprite]").forEach((el) => {
      el.innerHTML = svg(el.dataset.sprite);
      el.classList.add("spr");
      el.removeAttribute("data-sprite");
    });
  }
  // Favicon con un pictograma
  function favicon(name) {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" ${ATTR}>${P[name]}</svg>`;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
  }

  window.Sprites = { svg, img, draw, preload, hydrate, favicon, names: Object.keys(P) };
  document.addEventListener("DOMContentLoaded", () => hydrate());
})();
