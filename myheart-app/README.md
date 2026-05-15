# MyHeart · Para Karlita

Sitio web interactivo dedicado a Karlita Gisel Mendez Miranda, escrito por Kevin Fernando Lora Garcia.
Aniversario: **15 de marzo de 2026** — los cumplemeses son cada día 15.

---

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (con `@tailwindcss/vite`)
- **framer-motion**, **anime.js**, **GSAP**, **Lenis** (smooth scroll)
- **canvas-confetti**, **embla-carousel-react**, **lucide-react**
- Conversión de assets: **sharp**, **heic-convert**, **ffmpeg-static** + **fluent-ffmpeg**
- Paquete manager: **bun**

---

## Comandos

```bash
bun install               # instalar dependencias
bun run dev               # servidor de desarrollo (http://localhost:5173)
bun run build             # build de producción → dist/
bun run preview           # previsualizar el build
node scripts/convert-assets.mjs   # re-convertir todos los HEIC/MOV de ../assets
```

---

## Cómo funciona

1. **`../assets/`** (carpeta hermana, fuera del proyecto Vite) contiene los archivos originales organizados por sección: `Hotel/`, `Pacasmayo/`, `Casa/`, etc.
2. **`scripts/convert-assets.mjs`** recorre esa carpeta y produce:
   - `HEIC → JPG` (sharp + heic-convert, max 1600px, calidad 82)
   - `MOV → MP4` (ffmpeg-static, H.264, CRF 26, max 1280px)
   - Salida: `public/media/<sección>/<nombre>.jpg` o `.mp4`
   - Un manifest: `src/manifest.json` con la lista de archivos por sección.
3. **La app** lee `src/manifest.json` y renderiza la galería por capítulos.

Los archivos ya convertidos se omiten en re-ejecuciones (idempotente).

---

## Estructura

```
myheart-app/
├── public/
│   ├── audio/             ← coloca aquí song.mp3
│   ├── favicon.svg
│   └── media/             ← assets convertidos (generados)
├── scripts/
│   └── convert-assets.mjs ← conversor HEIC/MOV
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css          ← Tailwind v4 + theme beige/blanco + animaciones
│   ├── manifest.json      ← (autogenerado) mapa de archivos por sección
│   ├── components/
│   │   ├── LockScreen.tsx     ← pantalla con contraseña
│   │   ├── FloatingPetals.tsx ← lirios cayendo de fondo
│   │   └── MusicButton.tsx    ← botón flotante de música
│   ├── sections/
│   │   ├── Hero.tsx           ← Kevin & Karlita animado
│   │   ├── LiveCounter.tsx    ← cronómetro desde 15/03/2026
│   │   ├── MonthlyTimeline.tsx ← cumplemeses + countdown
│   │   ├── Gallery.tsx        ← galería por capítulos + lightbox
│   │   ├── AboutHer.tsx       ← luna del 18/10/2004 + datos curiosos
│   │   └── Closing.tsx        ← frase final + confeti
│   └── lib/
│       ├── constants.ts       ← nombres, fechas, capítulos
│       ├── time.ts            ← duración, cumplemeses
│       ├── moon.ts            ← cálculo astronómico de fase lunar
│       └── cn.ts              ← clsx helper
```

---

## Cómo editar el contenido

### Capítulos de la galería (`src/lib/constants.ts`)

```ts
export const CHAPTERS = [
  { key: 'Salida', title: 'Nuestra Primera Salida', subtitle: '...', date: '07 de marzo, 2026' },
  // ...
];
```

`key` debe coincidir con el nombre de la carpeta dentro de `assets/`.
Para agregar un capítulo nuevo:
1. Crea la carpeta `../assets/NuevoCapitulo/` con fotos/videos
2. Ejecuta `node scripts/convert-assets.mjs`
3. Agrega una entrada en `CHAPTERS`

### Datos curiosos (`src/sections/AboutHer.tsx`)

Componente `<FactCard>` — edita el array de tarjetas (color favorito, comida, flor, Disney).

### Contraseña (`src/components/LockScreen.tsx`)

Constante `PASSWORD = '15032026'` al inicio del archivo.

### Música

Coloca un `song.mp3` en `public/audio/`. El botón flotante lo detecta automáticamente.

---

## Datos importantes ya integrados

| Dato | Valor | Dónde se usa |
| --- | --- | --- |
| Aniversario | 15 de marzo, 2026 | contador en vivo, timeline |
| Nacimiento de Karlita | 18 de octubre, 2004 | sección de la luna |
| Color favorito | Blanco · Beige | paleta de todo el sitio |
| Flor favorita | Lirios | pétalos cayendo de fondo |
| Comida | Alitas + Makis | tarjeta en AboutHer |
| Disney | La Sirenita | tarjeta en AboutHer |

La fase lunar del 18/10/2004 se calcula en tiempo real con el algoritmo de Meeus (`src/lib/moon.ts`), no es una imagen estática.

---

## Despliegue

### Vercel (recomendado)
```bash
bun run build
# subir dist/ a Vercel, o conectar el repo desde el dashboard.
# Build command: bun run build
# Output: dist
```

### Netlify
Mismo build, output `dist/`.

### Local únicamente
```bash
bun run preview
```

---

## Notas

- Los archivos HEIC convertidos conservan la extensión original en su nombre (ej. `Hotel1.HEIC.jpg`) — esto es intencional para evitar colisiones cuando hay un `Foto.HEIC` y `Foto.JPG` en la misma carpeta.
- El cálculo de fase lunar para el 18/10/2004 da: **luna creciente joven (~14% iluminada, ~3.8 días desde luna nueva)**.
- El bundle de producción pesa ~430KB (~137KB gzipped).
