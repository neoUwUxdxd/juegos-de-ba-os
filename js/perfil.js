/* =========================================================
   Juegos de Baño — perfil (cuentas), avatar, medallas y reto del día
   Cuentas en línea con Firebase si js/firebase-config.js tiene datos;
   si no, el perfil se guarda solo en este celular.
   ========================================================= */
(function () {
  "use strict";
  const B = window.Bano;
  const FB_VERSION = "10.12.2";
  const cfg = window.FIREBASE_CONFIG;
  const ONLINE = !!(cfg && cfg.apiKey && cfg.projectId);

  // ---------- Avatar ----------
  const AVATAR = {
    bases: ["🧻", "🦆", "🚽", "🐸", "🐱", "🐶", "🐼", "🦄", "🤖", "👾", "🐙", "🦖"],
    colors: ["#ff8fb1", "#4fd1b5", "#ffd45e", "#67b8ff", "#b79bff", "#ffa45c", "#3ccf8e", "#ff6b6b"],
    extras: ["", "👑", "🎩", "🧢", "🕶️", "🎀", "⭐", "🎧"],
  };
  function avatarHTML(a, size) {
    a = a || { base: "🧻", color: "#ffd45e", extra: "" };
    size = size || 56;
    return `<span class="avatar" style="--s:${size}px;background:${a.color}"><span class="a-base">${a.base}</span>${a.extra ? `<span class="a-extra">${a.extra}</span>` : ""}</span>`;
  }
  // Estilos del avatar (se inyectan una vez)
  const css = document.createElement("style");
  css.textContent = `.avatar{position:relative;display:inline-grid;place-items:center;width:var(--s);height:var(--s);border-radius:50%;flex:none;
    box-shadow:inset 0 -4px 0 rgba(0,0,0,.12),0 4px 10px -4px rgba(35,54,74,.35);font-size:calc(var(--s)*.58);line-height:1}
    .avatar .a-extra{position:absolute;top:calc(var(--s)*-.2);right:calc(var(--s)*-.08);font-size:calc(var(--s)*.42);transform:rotate(12deg)}`;
  document.head.appendChild(css);

  // ---------- Perfil ----------
  let profile = B.store.get("perfil", null); // { apodo, edad, avatar }
  let user = null, fb = null;
  const listeners = [];
  const notify = () => listeners.forEach((f) => { try { f(profile, user); } catch (e) { /* nada */ } });

  function zoneFor(edad) { return edad <= 7 ? "peques" : edad <= 14 ? "grandes" : "todos"; }

  // Progreso local que se sincroniza con la cuenta
  const GAME_IDS = ["lluvia", "cadena", "burbujas", "memorama", "tuberia", "trivia", "aterriza", "mate", "verdad", "tiro", "grifos", "laberinto", "reflejos", "ahorcado", "nonograma", "sopa", "solitario", "triviapro"];
  function collectProgress() {
    const best = {}, plays = {};
    GAME_IDS.forEach((id) => { const b = B.best(id); if (b !== null) best[id] = b; const p = B.plays(id); if (p) plays[id] = p; });
    return {
      best, plays,
      medallas: B.store.get("medallas", []),
      contadores: { manos: B.store.get("count:manos", 0), sonidos: B.store.get("count:sonidos", 0), retos: B.store.get("retos:count", 0) },
    };
  }
  const LOWER = { memorama: true, reflejos: true, nonograma: true, sopa: true, solitario: true };
  function mergeProgress(p) {
    if (!p) return;
    Object.entries(p.best || {}).forEach(([id, v]) => {
      const cur = B.best(id);
      if (cur === null || (LOWER[id] ? v < cur : v > cur)) B.store.set("best:" + id, v);
    });
    Object.entries(p.plays || {}).forEach(([id, v]) => { if (v > B.plays(id)) B.store.set("plays:" + id, v); });
    const med = new Set(B.store.get("medallas", []).concat(p.medallas || []));
    B.store.set("medallas", [...med]);
    const c = p.contadores || {};
    if ((c.manos || 0) > B.store.get("count:manos", 0)) B.store.set("count:manos", c.manos);
    if ((c.sonidos || 0) > B.store.get("count:sonidos", 0)) B.store.set("count:sonidos", c.sonidos);
    if ((c.retos || 0) > B.store.get("retos:count", 0)) B.store.set("retos:count", c.retos);
  }

  async function loadFirebase() {
    if (fb) return fb;
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [app, auth, fs] = await Promise.all([
      import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js"),
    ]);
    const a = app.initializeApp(cfg);
    fb = { auth, fs, au: auth.getAuth(a), db: fs.getFirestore(a) };
    return fb;
  }

  const ready = (async () => {
    if (!ONLINE) return;
    try {
      const f = await loadFirebase();
      await new Promise((resolve) => {
        f.auth.onAuthStateChanged(f.au, async (u) => {
          user = u;
          if (u) {
            try {
              const snap = await f.fs.getDoc(f.fs.doc(f.db, "usuarios", u.uid));
              if (snap.exists()) {
                const d = snap.data();
                if (d.perfil) { profile = d.perfil; B.store.set("perfil", profile); }
                mergeProgress(d.progreso);
              }
            } catch (e) { /* sin conexión: se usa lo local */ }
          }
          notify(); resolve();
        });
      });
    } catch (e) { console.warn("No se pudo cargar Firebase", e); }
  })();

  const AUTH_ERR = {
    "auth/email-already-in-use": "Ese correo ya tiene cuenta. Usa «Entrar».",
    "auth/invalid-email": "El correo no es válido.",
    "auth/weak-password": "La contraseña necesita al menos 6 caracteres.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/wrong-password": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "No hay cuenta con ese correo.",
    "auth/too-many-requests": "Demasiados intentos. Espera un ratito.",
    "auth/network-request-failed": "Sin conexión a internet.",
  };
  const authMsg = (e) => AUTH_ERR[e && e.code] || "Algo salió mal. Intenta otra vez.";

  async function syncProgress() {
    if (!ONLINE || !user || !fb) return;
    try { await fb.fs.setDoc(fb.fs.doc(fb.db, "usuarios", user.uid), { perfil: profile, progreso: collectProgress() }, { merge: true }); }
    catch (e) { /* se intentará la próxima vez */ }
  }

  const Account = {
    online: ONLINE,
    ready,
    profile: () => profile,
    user: () => user,
    avatarHTML, AVATAR, zoneFor,
    onChange(f) { listeners.push(f); },
    async saveProfile(p) {
      profile = Object.assign({}, profile || {}, p);
      B.store.set("perfil", profile);
      notify();
      await syncProgress();
      Logros.check();
    },
    async register({ email, password, apodo, edad, avatar }) {
      if (!ONLINE) { await Account.saveProfile({ apodo, edad, avatar }); return { ok: true }; }
      try {
        const f = await loadFirebase();
        const cred = await f.auth.createUserWithEmailAndPassword(f.au, email, password);
        user = cred.user;
        profile = { apodo, edad, avatar };
        B.store.set("perfil", profile);
        await f.fs.setDoc(f.fs.doc(f.db, "usuarios", user.uid), { perfil: profile, progreso: collectProgress(), creado: f.fs.serverTimestamp() });
        notify(); Logros.check();
        return { ok: true };
      } catch (e) { return { ok: false, msg: authMsg(e) }; }
    },
    async login(email, password) {
      if (!ONLINE) return { ok: false, msg: "Las cuentas en línea aún no están activadas." };
      try {
        const f = await loadFirebase();
        await f.auth.signInWithEmailAndPassword(f.au, email, password);
        return { ok: true };
      } catch (e) { return { ok: false, msg: authMsg(e) }; }
    },
    async logout() {
      if (ONLINE && fb) { try { await fb.auth.signOut(fb.au); } catch (e) { /* nada */ } }
      profile = null; B.store.set("perfil", null); notify();
    },
    syncProgress,
  };

  // ---------- Medallas ----------
  const bestOf = (id) => B.best(id);
  const ge = (id, v) => { const b = bestOf(id); return b !== null && b >= v; };
  const le = (id, v) => { const b = bestOf(id); return b !== null && b <= v; };
  const MEDALS = [
    { id: "perfil", e: "🎨", t: "Con estilo", d: "Crea tu perfil y tu avatar", test: () => !!(profile && profile.avatar) },
    { id: "primera", e: "🚪", t: "Primera visita", d: "Termina tu primera partida", test: (s) => s.total >= 1 },
    { id: "diez", e: "🔟", t: "Cliente frecuente", d: "Juega 10 partidas", test: (s) => s.total >= 10 },
    { id: "cincuenta", e: "🏠", t: "Vive en el baño", d: "Juega 50 partidas", test: (s) => s.total >= 50 },
    { id: "explorador", e: "🧭", t: "Explorador", d: "Prueba 6 juegos distintos", test: (s) => s.distinct >= 6 },
    { id: "edificio", e: "🗺️", t: "Conoce todo el edificio", d: "Prueba 12 juegos distintos", test: (s) => s.distinct >= 12 },
    { id: "lluvia", e: "🧻", t: "Lluvia de récords", d: "500 pts en Lluvia de Papel", test: () => ge("lluvia", 500) },
    { id: "cadena", e: "🚽", t: "Jalador experto", d: "1000 pts en Cadena Perfecta", test: () => ge("cadena", 1000) },
    { id: "burbujas", e: "🫧", t: "Reventador", d: "600 pts en Burbujas de Jabón", test: () => ge("burbujas", 600) },
    { id: "memorama", e: "🪞", t: "Memoria de espejo", d: "Memorama en 14 movimientos o menos", test: () => le("memorama", 14) },
    { id: "tuberia", e: "🔧", t: "Fontanero", d: "5 niveles en la Tubería", test: () => ge("tuberia", 5) },
    { id: "trivia", e: "🧠", t: "Cerebrito", d: "900 pts en la Trivia", test: () => ge("trivia", 900) },
    { id: "reflejos", e: "⚡", t: "Rayo", d: "Menos de 300 ms en Reflejos", test: () => le("reflejos", 300) },
    { id: "mate", e: "🧮", t: "Calculadora humana", d: "500 pts en Mate-Retrete", test: () => ge("mate", 500) },
    { id: "laberinto", e: "🦆", t: "Patito navegante", d: "4 niveles en el Laberinto", test: () => ge("laberinto", 4) },
    { id: "manos", e: "🧼", t: "Manos limpias", d: "Lávate las manos 3 veces", test: (s) => s.manos >= 3 },
    { id: "trofeo", e: "🏆", t: "Campeón del baño", d: "Llena la tabla de estrellas", test: (s) => s.trofeos >= 1 },
    { id: "reto", e: "📅", t: "Retador", d: "Completa un reto del día", test: (s) => s.retos >= 1 },
    { id: "retos5", e: "🔥", t: "Imparable", d: "Completa 5 retos del día", test: (s) => s.retos >= 5 },
    { id: "solitario", e: "🃏", t: "Tahúr del trono", d: "Gana una partida de Solitario", test: () => bestOf("solitario") !== null },
    { id: "nonograma", e: "🧩", t: "Lógica de azulejo", d: "Resuelve un Nonograma", test: () => bestOf("nonograma") !== null },
    { id: "sueldo", e: "💸", t: "Asalariado del trono", d: "Cobra una visita en el Sueldo del trono", test: () => B.store.get("count:sueldo", 0) >= 1 },
    { id: "dj", e: "🎺", t: "DJ del baño", d: "Toca 30 sonidos en la botonera", test: (s) => s.sonidos >= 30 },
  ];
  function stats() {
    let total = 0, distinct = 0;
    GAME_IDS.forEach((id) => { const p = B.plays(id); total += p; if (p) distinct++; });
    return {
      total, distinct,
      manos: B.store.get("count:manos", 0), sonidos: B.store.get("count:sonidos", 0),
      retos: B.store.get("retos:count", 0), trofeos: B.store.get("kids:trophies", 0),
    };
  }
  const Logros = {
    list: MEDALS,
    have: () => B.store.get("medallas", []),
    check(quiet) {
      const have = new Set(Logros.have());
      const s = stats();
      const fresh = MEDALS.filter((m) => !have.has(m.id) && m.test(s));
      if (!fresh.length) return [];
      fresh.forEach((m) => have.add(m.id));
      B.store.set("medallas", [...have]);
      if (!quiet) {
        fresh.forEach((m, i) => setTimeout(() => { B.fx && B.fx.toast(`🏅 ¡Nueva medalla! ${m.e} ${m.t}`); B.sfx.gold(); }, 1200 + i * 2000));
      }
      syncProgress();
      return fresh;
    },
    count: (id, n) => { const k = "count:" + id; B.store.set(k, B.store.get(k, 0) + (n || 1)); },
  };

  // ---------- Reto del día ----------
  const RETOS = [
    { game: "burbujas", name: "Burbujas de Jabón", href: "games/burbujas.html", target: 400, unit: "pts", txt: "Haz 400 puntos en Burbujas de Jabón" },
    { game: "lluvia", name: "Lluvia de Papel", href: "games/lluvia-papel.html", target: 300, unit: "pts", txt: "Haz 300 puntos en Lluvia de Papel" },
    { game: "cadena", name: "Cadena Perfecta", href: "games/cadena-perfecta.html", target: 600, unit: "pts", txt: "Haz 600 puntos en Cadena Perfecta" },
    { game: "memorama", name: "Memorama", href: "games/memorama.html", target: 18, lower: true, unit: "mov.", txt: "Termina el Memorama en 18 movimientos o menos" },
    { game: "tuberia", name: "Tubería", href: "games/tuberia.html", target: 3, unit: "niveles", txt: "Resuelve 3 niveles de la Tubería" },
    { game: "trivia", name: "Trivia del Trono", href: "games/trivia.html", target: 600, unit: "pts", txt: "Haz 600 puntos en la Trivia" },
    { game: "mate", name: "Mate-Retrete", href: "grandes/mate.html", target: 300, unit: "pts", txt: "Haz 300 puntos en Mate-Retrete" },
    { game: "verdad", name: "¿Verdad o Popó?", href: "grandes/verdad.html", target: 800, unit: "pts", txt: "Acierta 8 en ¿Verdad o Popó?" },
    { game: "reflejos", name: "Reflejos Relámpago", href: "grandes/reflejos.html", target: 350, lower: true, unit: "ms", txt: "Promedio menor a 350 ms en Reflejos" },
    { game: "laberinto", name: "Laberinto del Drenaje", href: "grandes/laberinto.html", target: 2, unit: "niveles", txt: "Pasa 2 niveles del Laberinto" },
    { game: "tiro", name: "Tiro al Cesto", href: "grandes/tiro.html", target: 500, unit: "pts", txt: "Haz 500 puntos en Tiro al Cesto" },
    { game: "grifos", name: "Grifos en Orden", href: "grandes/grifos.html", target: 6, unit: "rondas", txt: "Llega a 6 rondas en Grifos en Orden" },
    { game: "ahorcado", name: "Adivina la Palabra", href: "grandes/ahorcado.html", target: 400, unit: "pts", txt: "Haz 400 puntos en Adivina la Palabra" },
    { game: "sopa", name: "Sopa de letras", href: "adultos/sopa.html", target: 180, lower: true, unit: "s", txt: "Termina una Sopa de letras en menos de 3 minutos" },
    { game: "triviapro", name: "Trivia difícil", href: "adultos/trivia-pro.html", target: 700, unit: "pts", txt: "Haz 700 puntos en la Trivia difícil" },
    { game: "aterriza", name: "Aterriza el Trono", href: "grandes/aterriza.html", target: 300, unit: "pts", txt: "Haz 300 puntos en Aterriza el Trono" },
  ];
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  const Retos = {
    today() {
      const k = dayKey();
      let h = 0; for (const c of k) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      return Object.assign({ day: k, done: !!B.store.get("reto:" + k, false) }, RETOS[h % RETOS.length]);
    },
    onScore(id, score) {
      const r = Retos.today();
      if (r.done || r.game !== id) return false;
      const ok = r.lower ? score <= r.target : score >= r.target;
      if (!ok) return false;
      B.store.set("reto:" + r.day, true);
      B.store.set("retos:count", B.store.get("retos:count", 0) + 1);
      setTimeout(() => { B.fx && B.fx.toast("📅 ¡Reto del día completado!"); B.fx && B.fx.confetti(); B.sfx.win(); }, 700);
      return true;
    },
  };

  // Lo llama gameOver() al terminar cada partida
  function afterGame(id, score) {
    Retos.onScore(id, score);
    Logros.check();
    syncProgress();
  }

  window.Account = Account;
  window.Logros = Logros;
  window.Retos = Retos;
  window.Perfil = { afterGame, dayKey };
})();
