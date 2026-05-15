import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import heicConvert from 'heic-convert';
import sharp from 'sharp';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegStatic);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../assets');
const OUT = path.resolve(__dirname, '../public/media');

const IMG_MAX_WIDTH = 1600;
const IMG_QUALITY = 82;

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function convertHeic(input, output) {
  if (existsSync(output)) return 'skip';
  const buf = await readFile(input);
  const jpegBuf = await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.9 });
  await sharp(Buffer.from(jpegBuf))
    .rotate()
    .resize({ width: IMG_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: IMG_QUALITY, mozjpeg: true })
    .toFile(output);
  return 'ok';
}

async function convertJpg(input, output) {
  if (existsSync(output)) return 'skip';
  await sharp(input)
    .rotate()
    .resize({ width: IMG_MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: IMG_QUALITY, mozjpeg: true })
    .toFile(output);
  return 'ok';
}

function convertMov(input, output) {
  return new Promise((resolve, reject) => {
    if (existsSync(output)) return resolve('skip');
    ffmpeg(input)
      .outputOptions([
        '-vcodec libx264',
        '-acodec aac',
        '-preset veryfast',
        '-crf 26',
        '-movflags +faststart',
        '-vf scale=\'min(1280,iw)\':-2',
        '-pix_fmt yuv420p',
      ])
      .on('end', () => resolve('ok'))
      .on('error', (e) => reject(e))
      .save(output);
  });
}

async function walk(dir, rel = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const e of entries) {
    const abs = path.join(dir, e.name);
    const r = path.join(rel, e.name);
    if (e.isDirectory()) results.push(...(await walk(abs, r)));
    else results.push({ abs, rel: r });
  }
  return results;
}

const manifest = {};

async function main() {
  await ensureDir(OUT);
  const files = await walk(SRC);
  let n = 0;
  for (const { abs, rel } of files) {
    const ext = path.extname(abs).toLowerCase();
    const dir = path.dirname(rel) || '_root';
    const base = path.basename(abs, ext);
    const section = dir === '.' ? '_root' : dir;
    await ensureDir(path.join(OUT, section));
    manifest[section] ??= { photos: [], videos: [] };

    try {
      if (ext === '.heic') {
        const out = path.join(OUT, section, base + '.jpg');
        const r = await convertHeic(abs, out);
        manifest[section].photos.push(`media/${section}/${base}.jpg`);
        console.log(`[${++n}] HEIC ${rel} -> ${r}`);
      } else if (ext === '.jpg' || ext === '.jpeg') {
        const out = path.join(OUT, section, base + '.jpg');
        const r = await convertJpg(abs, out);
        manifest[section].photos.push(`media/${section}/${base}.jpg`);
        console.log(`[${++n}] JPG  ${rel} -> ${r}`);
      } else if (ext === '.mov' || ext === '.mp4') {
        const out = path.join(OUT, section, base + '.mp4');
        const r = await convertMov(abs, out);
        manifest[section].videos.push(`media/${section}/${base}.mp4`);
        console.log(`[${++n}] MOV  ${rel} -> ${r}`);
      } else {
        console.log(`[skip] ${rel}`);
      }
    } catch (err) {
      console.error(`[err] ${rel}:`, err.message);
    }
  }

  // dedupe and sort
  for (const k of Object.keys(manifest)) {
    manifest[k].photos = [...new Set(manifest[k].photos)].sort();
    manifest[k].videos = [...new Set(manifest[k].videos)].sort();
  }

  await writeFile(
    path.resolve(__dirname, '../src/manifest.json'),
    JSON.stringify(manifest, null, 2),
  );
  console.log('\nDone. Manifest written.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
