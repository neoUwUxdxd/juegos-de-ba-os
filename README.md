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
| **Tiro al Cesto**: desliza para encestar bolitas de papel, con viento. | Puntería |
| **Grifos en Orden**: repite la secuencia de grifos que se encienden. | Memoria |
| **Laberinto del Drenaje**: lleva al patito por un laberinto que crece. | Laberinto |
| **Reflejos Relámpago**: toca en cuanto se ponga verde. | Reacción |
| **Adivina la Palabra**: adivina letra por letra antes de que se acabe el papel. | Palabras |

### 👔 Zona Adultos (15+)

| | Qué es |
|---|---|
| **Nonograma del azulejo** | Puzzle de lógica: pinta azulejos según los números y aparece un dibujo. Uno del día. |
| **Sopa de letras** | 8 palabras escondidas en 8 direcciones, con temas distintos. |
| **Solitario** | El clásico, moviendo cartas con un toque. |
| **Trivia difícil** | Historia, ciencia, geografía, cine y música. |
| **Sueldo del trono** | Cronómetro que calcula cuánto te pagan por estar en el baño, con historial del mes. |
| **Generador de excusas** | Más de 1 000 excusas para cuando tardas en el baño. |
| **Diario del baño** | Registro privado con la escala de Bristol y estadísticas (solo en el celular). |
| **Botón de jefe 👔** | En todas las páginas de la zona: convierte la pantalla en una hoja de cálculo falsa. |

### 🎁 Extras

- **Mi perfil** (`perfil.html`): regístrate con apodo, edad y un avatar personalizable. Según tu edad te recomienda una zona.
- **Medallas**: 20 insignias por jugar, por récords y por lavarte las manos.
- **Reto del día**: un reto distinto cada día en alguno de los juegos.
- **Botonera del baño**: 15 sonidos graciosos sintetizados.
- **Shorts**: videos de YouTube Shorts que eligen los papás, con un límite de minutos por día.

### ☁️ Cuentas en línea (Firebase)

Sin configurar nada, el perfil se guarda **solo en el celular**. Para que haya cuentas con correo y contraseña que funcionen en cualquier celular:

1. Entra a https://console.firebase.google.com y crea un proyecto (gratis).
2. En **Authentication → Método de inicio de sesión**, activa **Correo electrónico/contraseña**.
3. En **Firestore Database**, crea la base de datos y pega estas reglas en la pestaña **Reglas**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /usuarios/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
4. En **Configuración del proyecto → Tus apps**, agrega una app **Web** y copia el objeto `firebaseConfig`.
5. Pégalo en `js/firebase-config.js` (en lugar de `null`) y súbelo a `main`.
6. En **Authentication → Configuración → Dominios autorizados**, agrega `neouwuxdxd.github.io`.

Solo se guardan el apodo, la edad, el avatar y el progreso de cada quien. Si la persona tiene menos de 13 años, se pide el correo de un adulto y su permiso.

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
