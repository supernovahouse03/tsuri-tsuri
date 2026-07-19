/**
 * ゲームの え を 生成AI で つくる
 *
 *   npm run gen                 … まだ 無い ものだけ ぜんぶ
 *   npm run gen -- char rod     … その グループだけ
 *   npm run gen -- char:wanta   … その 1まいだけ 作りなおし
 *   npm run gen -- --all        … ぜんぶ 作りなおし
 *
 * グループ: fish / char / rod / sushi / plate / area / shop
 * OPENAI_API_KEY を .env に かいて おくこと
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { buildJobs } from './art-manifest.mjs'
import { buildFishJobs, loadFish } from './fish-jobs.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const RAW_DIR = path.join(ROOT, '.gen', 'raw')
const ASSETS = path.join(ROOT, 'src', 'assets')

const MODEL = 'gpt-image-1'
const QUALITY = process.env.FISH_QUALITY || 'medium'
const CONCURRENCY = 3

async function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    try {
      const txt = await fs.readFile(path.join(ROOT, name), 'utf8')
      for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    } catch {
      /* なくても OK */
    }
  }
}

async function generate(job) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      prompt: job.prompt,
      size: job.size || '1536x1024',
      quality: QUALITY,
      background: job.cover ? 'opaque' : 'transparent',
      output_format: 'png',
      n: 1,
    }),
  })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 240)}`)
  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error('画像が かえって きませんでした')
  return Buffer.from(b64, 'base64')
}

async function postProcess(buf, job) {
  const [w, h] = job.box
  const dir = path.join(ASSETS, job.group)
  await fs.mkdir(dir, { recursive: true })
  let img = sharp(buf).ensureAlpha()
  if (!job.noTrim) img = sharp(await img.trim({ threshold: 12 }).toBuffer())
  await img
    .resize({
      width: w,
      height: h,
      fit: job.cover ? 'cover' : 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: job.cover ? 82 : 88, alphaQuality: 90, effort: 5 })
    .toFile(path.join(dir, `${job.id}.webp`))
}

async function main() {
  await loadEnv()
  if (!process.env.OPENAI_API_KEY) {
    console.error(`\n  OPENAI_API_KEY が ありません（${path.join(ROOT, '.env')}）\n`)
    process.exit(1)
  }
  await fs.mkdir(RAW_DIR, { recursive: true })

  const fish = await loadFish(ROOT)
  const jobs = [...buildFishJobs(fish), ...buildJobs(fish)]

  const args = process.argv.slice(2)
  const redoAll = args.includes('--all')
  const sel = args.filter((a) => !a.startsWith('--'))

  let targets = jobs
  if (sel.length) {
    targets = jobs.filter((j) => sel.includes(j.group) || sel.includes(`${j.group}:${j.id}`))
  }
  if (!redoAll && !sel.some((s) => s.includes(':'))) {
    const keep = []
    for (const j of targets) {
      const exists = await fs
        .access(path.join(ASSETS, j.group, `${j.id}.webp`))
        .then(() => true)
        .catch(() => false)
      if (!exists || redoAll) keep.push(j)
    }
    if (!redoAll) targets = keep
  }

  if (!targets.length) {
    console.log('つくるものが ありません（--all で ぜんぶ 作りなおし）')
    return
  }
  const byGroup = targets.reduce((a, j) => ({ ...a, [j.group]: (a[j.group] || 0) + 1 }), {})
  console.log(`${targets.length}まい を 生成します`, byGroup, `\n`)

  let done = 0
  const fails = []
  const queue = [...targets]
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const job = queue.shift()
        let lastErr
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const buf = await generate(job)
            await fs.writeFile(path.join(RAW_DIR, `${job.group}-${job.id}.png`), buf)
            await postProcess(buf, job)
            done++
            console.log(`  ✓ [${job.group}] ${job.name}  (${done}/${targets.length})`)
            lastErr = null
            break
          } catch (e) {
            lastErr = e
            if (attempt < 3) await new Promise((r) => setTimeout(r, 2500 * attempt))
          }
        }
        if (lastErr) {
          fails.push(`${job.group}:${job.id}`)
          console.log(`  × [${job.group}] ${job.name} — ${lastErr.message}`)
        }
      }
    }),
  )

  console.log(`\nできあがり: ${done}まい`)
  if (fails.length) console.log(`しっぱい: ${fails.join(' ')}\n  → npm run gen -- ${fails.join(' ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
