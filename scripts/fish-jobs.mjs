/** さかな の え（data.js から よみとって ジョブに する） */
import fs from 'node:fs/promises'
import path from 'node:path'

export async function loadFish(ROOT) {
  const src = await fs.readFile(path.join(ROOT, 'src', 'data.js'), 'utf8')
  const block = src.slice(src.indexOf('export const FISH = ['), src.indexOf('export const AREAS'))
  const out = []
  for (const line of block.split('\n')) {
    const id = line.match(/id:\s*'([^']+)'/)
    if (!id) continue
    const en = line.match(/en:\s*"((?:[^"\\]|\\.)*)"/)
    if (!en) continue
    const sushi = line.match(/sushi:\s*"((?:[^"\\]|\\.)*)"/)
    const name = line.match(/name:\s*'([^']+)'/)
    const rarity = line.match(/rarity:\s*(\d)/)
    const shape = line.match(/shape:\s*'([^']+)'/)
    out.push({
      id: id[1],
      en: en[1].replace(/\\"/g, '"'),
      sushi: sushi ? sushi[1].replace(/\\"/g, '"') : null,
      name: name?.[1] || id[1],
      rarity: Number(rarity?.[1] || 1),
      shape: shape?.[1] || 'normal',
      junk: /junk:\s*true/.test(line),
    })
  }
  return out
}

const FRAMING =
  'IMPORTANT FRAMING: the whole subject must be fully inside the image with a generous empty margin on every side, never touching or cropped by the edges. Draw it slightly smaller rather than risk cutting anything off.'
const BG =
  'Completely transparent background. No water, no bubbles, no ground, no drop shadow, no border, no frame, no text, no labels, no watermark, no signature, no other objects.'
const STYLE =
  'Natural history field-guide illustration, painted in soft gouache with smooth realistic shading, clean crisp edges suitable for cutting out.'

export function fishPrompt(f) {
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

export function buildFishJobs(fish) {
  return fish.map((f) => ({
    group: 'fish',
    id: f.id,
    name: f.name,
    size: '1536x1024',
    box: [520, 400],
    prompt: fishPrompt(f),
  }))
}
