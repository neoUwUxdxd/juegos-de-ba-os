# 🧻 Juegos de Baño

Mini juegos cortitos para jugar con el celular **con una mano** mientras estás en el trono. Incluye una zona para peques y otra para niños de 8 a 14 años.
Hechos con HTML, CSS y JavaScript puro: sin instalar nada y sin librerías.

**▶️ Jugar:** https://neouwuxdxd.github.io/juegos-de-ba-os/

## Juegos

| | Juego | Tipo | Duración |
|---|---|---|---|
| 🧻 | **Lluvia de Papel**: mueve el inodoro para atrapar rollos y esquivar lo marrón. | Reflejos | 1–2 min |
| 🚽 | **¡Cadena Perfecta!**: jala la cadena cuando la gota esté en la zona verde. | Timing | 1 min |
| 🫧 | **Burbujas de Jabón**: revienta burbujas, rescata patitos y evita las de olor. | Reflejos | 45 s |
| 🪥 | **Memorama del Botiquín**: abre las puertitas con espejo y encuentra las parejas. | Puzzle | 1–2 min |
| 🔧 | **Desatasca la Tubería**: gira los tubos para llevar el agua del grifo al desagüe. | Puzzle | 1–3 min |
| 🧠 | **Trivia del Trono**: 10 rondas de preguntas y palabras revueltas. | Palabras | 2–3 min |

### 🐤 Zona Peques (3–7 años)

Pensada para niños pequeños sentados en la bacinica: sin perder, sin prisa, sin leer y con voz en español.

| Actividad | Qué hace |
|---|---|
| **Mis estrellas** | Tabla de premios: cada vez que van al baño (pipí o popó) ganan una estrella. Con 10, un trofeo. |
| **Respira** | Un globo se infla y se desinfla para respirar tranquilos durante 1, 2 o 3 minutos. |
| **Burbujas** | Al reventarlas sale un animalito que dice su nombre y hace su sonido. |
| **Patitos** | Contar patitos del 1 al 10 en voz alta. |
| **Stickers** | Decorar el baño arrastrando stickers. |
| **Lávate las manos** | Frotar la pantalla 20 segundos para hacer espuma, con cancioncita. |

Para salir de la zona, un adulto mantiene presionado el botón de arriba.

### 🚀 Zona Grandes (8–14 años)

| Juego | Tipo |
|---|---|
| **Aterriza el Trono**: pilota un inodoro-cohete hasta la plataforma. | Pilotaje |
| **Mate-Retrete**: 60 segundos de cuentas que suben de nivel. | Cálculo |
| **¿Verdad o Popó?**: datos curiosos de ciencia, ¿verdad o falso? | Ciencia |
| **Pixel Azulejo**: pinta pixel art de 16×16 y descárgalo como imagen. | Creativo |
| **Chistes del Cubículo**: chistes blancos de baño. | Humor |

### Diseño

Azulejos pastel de baño con tarjetas suaves, emojis, la mascota **Don Rollo** y un «certificado de visita» con un título gracioso al terminar cada partida. Tipografías Fredoka y Nunito. Tiene modo noche, récords guardados en el navegador, sonidos sintetizados con botón de silencio y vibración.

## Jugar en tu computadora

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Publicación

El sitio se sirve desde la rama `gh-pages`. El workflow `.github/workflows/pages.yml` copia los archivos a esa rama cada vez que hay cambios en `main`.
Si la página diera 404, en **Settings → Pages** elige **Source: Deploy from a branch → `gh-pages` / `(root)`**.
