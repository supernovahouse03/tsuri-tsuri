/**
 * さかなの え を 生成AI で つくる スクリプト
 *
 *   npm run gen:fish            … まだ 作ってない さかな だけ 生成
 *   npm run gen:fish -- aji saba … 指定した さかな だけ 作りなおす
 *   npm run gen:fish -- --all    … ぜんぶ 作りなおす
 *
 * OPENAI_API_KEY を .env に かいて おくこと（.env は git に あがりません）
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const RAW_DIR = path.join(ROOT, '.gen', 'fish-raw')
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'fish')

const MODEL = 'gpt-image-1'
const SIZE = '1536x1024' // よこながの ほうが さかなが おさまる
const QUALITY = process.env.FISH_QUALITY || 'medium'
const CONCURRENCY = 3

/* ---- .env を よむ ---- */
async function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    try {
      const txt = await fs.readFile(path.join(ROOT, name), 'utf8')
      for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    } catch {
      /* ファイルが なくても OK */
    }
  }
}

/* ---- data.js から さかな を よむ（import すると JSX が まざるので 正規表現）---- */
async function loadFish() {
  const src = await fs.readFile(path.join(ROOT, 'src', 'data.js'), 'utf8')
  const block = src.slice(src.indexOf('export const FISH = ['), src.indexOf('export const AREAS'))
  const fish = []
  for (const line of block.split('\n')) {
    const id = line.match(/id:\s*'([^']+)'/)
    if (!id) continue
    const en = line.match(/en:\s*"((?:[^"\\]|\\.)*)"/)
    const name = line.match(/name:\s*'([^']+)'/)
    const rarity = line.match(/rarity:\s*(\d)/)
    const shape = line.match(/shape:\s*'([^']+)'/)
    if (!en) continue
    fish.push({
      id: id[1],
      en: en[1].replace(/\\"/g, '"'),
      name: name?.[1] || id[1],
      rarity: Number(rarity?.[1] || 1),
      shape: shape?.[1] || 'normal',
      junk: /junk:\s*true/.test(line),
    })
  }
  return fish
}

/* ---- プロンプト（ぜんぶ おなじ かた で つくる = 絵柄を そろえる）---- */
function buildPrompt(f) {
  const FRAMING =
    'IMPORTANT FRAMING: the whole subject must be fully inside the image with a generous empty margin on every side, never touching or cropped by the edges. Draw it slightly smaller rather than risk cutting anything off.'
  const BG =
    'Completely transparent background. No water, no bubbles, no ground, no drop shadow, no border, no frame, no text, no labels, no watermark, no signature, no other objects.'
  const STYLE =
    'Natural history field-guide illustration, painted in soft gouache with smooth realistic shading, clean crisp edges suitable for cutting out.'

  // ゴミ・たからばこ = いきもの では ない
  if (f.junk) {
    return [
      `A single ${f.en}. It is an inanimate man-made object.`,
      STYLE,
      'CRITICAL: this is NOT an animal and NOT a fish. It must have no fins, no tail, no scales, no gills, no eyes and no face of any kind. Draw only the plain object exactly as it really looks.',
      'Seen from the side, upright and horizontal, in its natural resting position.',
      FRAMING,
      BG,
    ].join(' ')
  }

  // イカ・タコ・カニ・エビ・クラゲ・かい = さかな では ない
  const INVERT = { squid: 'squid', octo: 'octopus', crab: 'crab', shrimp: 'crustacean', jelly: 'jellyfish', shell: 'bivalve shellfish' }
  if (INVERT[f.shape]) {
    return [
      `A single ${f.en}.`,
      STYLE,
      `Anatomically accurate ${INVERT[f.shape]}. CRITICAL: it is an invertebrate, NOT a fish — it must have no fish fins, no fish tail fin, no scales and no gill covers.`,
      'Seen from the side in its natural posture, body horizontal.',
      FRAMING,
      BG,
    ].join(' ')
  }

  const legendary =
    f.rarity >= 4
      ? ' It is a mythical creature, so add a subtle magical glow and elegant ornamental fins, but keep exactly the same painting style.'
      : ''
  return [
    `A single ${f.en}.`,
    STYLE,
    'Accurate fish anatomy with correct fin placement and proportions.',
    'Strict side profile, seen exactly from the side, head pointing to the LEFT, tail to the RIGHT, body horizontal.',
    FRAMING,
    BG,
    'Rich but natural colours, gentle highlights on wet skin.',
    "Friendly and appealing enough for a children's picture book, but anatomically believable, not cartoonish, no human features." + legendary,
  ].join(' ')
}

async function generate(f) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(f),
      size: SIZE,
      quality: QUALITY,
      background: 'transparent',
      output_format: 'png',
      n: 1,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${body.slice(0, 300)}`)
  }
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('画像が かえって きませんでした')
  return Buffer.from(b64, 'base64')
}

/* ---- よはくを けずって おなじ おおきさ に そろえる ---- */
async function postProcess(buf, id) {
  const BOX_W = 520
  const BOX_H = 400
  const trimmed = await sharp(buf).ensureAlpha().trim({ threshold: 12 }).toBuffer()
  await sharp(trimmed)
    .resize({ width: BOX_W, height: BOX_H, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 90, effort: 5 })
    .toFile(path.join(OUT_DIR, `${id}.webp`))
}

async function main() {
  await loadEnv()
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n  OPENAI_API_KEY が ありません。')
    console.error(`  ${path.join(ROOT, '.env')} に つぎの 1ぎょう を かいてください:\n`)
    console.error('  OPENAI_API_KEY=sk-...\n')
    process.exit(1)
  }
  await fs.mkdir(RAW_DIR, { recursive: true })
  await fs.mkdir(OUT_DIR, { recursive: true })

  const all = await loadFish()
  const args = process.argv.slice(2)
  const all_flag = args.includes('--all')
  const only = args.filter((a) => !a.startsWith('--'))

  let targets = only.length ? all.filter((f) => only.includes(f.id)) : all
  if (!all_flag && !only.length) {
    const have = new Set((await fs.readdir(OUT_DIR).catch(() => [])).map((n) => n.replace(/\.webp$/, '')))
    targets = targets.filter((f) => !have.has(f.id))
  }

  if (!targets.length) {
    console.log('つくるものが ありません（--all で ぜんぶ 作りなおし）')
    return
  }
  console.log(`${targets.length}ひき を 生成します（model=${MODEL} quality=${QUALITY}）\n`)

  let done = 0
  const fails = []
  const queue = [...targets]
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const f = queue.shift()
      let lastErr
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const buf = await generate(f)
          await fs.writeFile(path.join(RAW_DIR, `${f.id}.png`), buf)
          await postProcess(buf, f.id)
          done++
          console.log(`  ✓ ${f.name} (${f.id})  [${done}/${targets.length}]`)
          lastErr = null
          break
        } catch (e) {
          lastErr = e
          if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt))
        }
      }
      if (lastErr) {
        fails.push(f.id)
        console.log(`  × ${f.name} (${f.id}) ${lastErr.message}`)
      }
    }
  })
  await Promise.all(workers)

  console.log(`\nできあがり: ${done}ひき`)
  if (fails.length) console.log(`しっぱい: ${fails.join(', ')}  → npm run gen:fish -- ${fails.join(' ')}`)
  console.log(`ほぞんさき: ${path.relative(ROOT, OUT_DIR)}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
