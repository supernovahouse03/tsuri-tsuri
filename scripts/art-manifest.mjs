/**
 * つくる え の いちらん（グループごと）
 * ここを なおして `npm run gen -- <グループ>` で つくりなおせる
 */

const BG =
  'Completely transparent background (alpha), nothing behind the subject: no scenery, no floor, no drop shadow, no border, no frame, no text, no labels, no watermark, no signature.'
const FRAME =
  'IMPORTANT: the whole subject is fully inside the image with a generous empty margin on all sides, never touching or cropped by the edges. Draw it slightly smaller rather than risk cutting anything off.'

/* =============== キャラクター =============== */
const CHAR_STYLE =
  'Cute plush mascot character for a children\'s fishing game. Very soft fluffy fur with visible fine fur texture, rounded chubby body, big shiny friendly eyes with highlights, small simple smiling mouth. Soft studio lighting, gentle rim light, smooth painterly 3D-ish rendering like a high quality plush toy photograph, warm and appealing.'
const CHAR_POSE =
  'Full body, sitting upright on its bottom with both hind legs forward, seen from a three-quarter view turned slightly to the RIGHT, head facing the viewer. Empty paws, holding nothing.'

const CHARACTERS = [
  { id: 'wanta', name: 'ワンタ', desc: 'a golden-yellow puppy with soft floppy ears, a cream muzzle and chest, and a cheerful energetic expression' },
  { id: 'mikeru', name: 'ミケル', desc: 'a cream-white kitten with pale peach ears and tail tip, long whiskers and a calm gentle expression' },
  { id: 'shiba', name: 'マメスケ', desc: 'a small round shiba inu puppy, sandy tan fur with a white cream belly and cheeks, pointed ears, curled tail, a slightly cheeky proud expression' },
  { id: 'kuro', name: 'クロネ', desc: 'a dusky lavender-grey kitten with darker purple ears and tail, bright eyes and a quiet mysterious expression' },
]

/* =============== つりざお =============== */
const ROD_STYLE =
  'A fishing rod photographed from the side, product shot style, realistic materials with soft highlights.'
const ROD_POSE =
  'The rod lies PERFECTLY HORIZONTAL. The handle grip and the spinning reel are at the FAR LEFT end, and the rod tapers smoothly to a very thin tip at the FAR RIGHT end. The whole rod from grip to tip is visible in one straight horizontal line, no bending, no fishing line, no hook, no fish.'

const RODS = [
  { id: 'rod1', name: 'たけのさお', desc: 'a simple traditional bamboo fishing rod, natural pale bamboo with visible nodes, a cork grip and a small plain reel' },
  { id: 'rod2', name: 'キラリざお', desc: 'a light blue glossy fibreglass fishing rod with a shiny chrome reel and a black foam grip' },
  { id: 'rod3', name: 'ぎんいろざお', desc: 'a sleek silver metallic carbon fishing rod with a polished silver reel and a dark leather grip' },
  { id: 'rod4', name: 'にじいろざお', desc: 'a legendary rainbow iridescent fishing rod with pearlescent shifting colours, a golden reel and a jewelled grip, faint magical sparkle' },
]

/* =============== かいてんずし =============== */
const SUSHI_STYLE =
  'Photorealistic Japanese food photography of a single piece of nigiri sushi, appetising, glossy fresh topping, individual rice grains visible in the shari, soft natural light, shallow depth of field feel, extremely realistic.'
const SUSHI_POSE =
  'One single piece only, seen from a low three-quarter angle from the side so the topping and the rice are both clearly visible, resting flat and level.'

const OTHER = [
  {
    id: 'itamae',
    group: 'shop',
    size: '1024x1536',
    box: [420, 560],
    prompt: [
      'A friendly Japanese sushi chef, illustrated as a warm stylised game character (not a photograph of a real person).',
      'Middle aged man with a white sushi chef jacket, a white chef cap and a folded towel headband, arms slightly raised as if just finishing a piece of sushi, big warm welcoming smile.',
      'Upper body only, from the waist up, facing the viewer straight on.',
      'Soft painterly shading, clean simple shapes, appealing for a children\'s game.',
      FRAME,
      BG,
    ].join(' '),
  },
  {
    id: 'belt',
    group: 'shop',
    size: '1536x1024',
    box: [1200, 260],
    prompt: [
      'A close up of a modern conveyor belt lane from a Japanese kaiten-zushi restaurant, empty with no plates on it.',
      'Seen from the side at eye level, the belt runs perfectly horizontally across the whole width of the image, made of dark grey-blue rubber segments with a polished stainless steel rail along the top and bottom edge.',
      'The pattern of segments is even and repeating so the left edge and the right edge match seamlessly when tiled horizontally.',
      'Photorealistic, soft indoor restaurant lighting, gentle reflections on the metal.',
      'Fills the entire frame edge to edge with no margin, no background behind it, no text.',
    ].join(' '),
  },
  {
    id: 'counter',
    group: 'shop',
    size: '1536x1024',
    box: [1200, 300],
    prompt: [
      'A close up of a clean Japanese sushi restaurant counter top made of pale polished hinoki cypress wood, seen from the front at eye level.',
      'Beautiful straight wood grain running horizontally, soft warm lighting, slight sheen.',
      'Just the flat empty wooden surface filling the whole frame edge to edge, nothing on it, no objects, no text, no margin.',
      'Photorealistic.',
    ].join(' '),
  },
]

const PLATES = [
  { id: 'plate1', desc: 'a plain glossy white ceramic sushi plate' },
  { id: 'plate2', desc: 'a glossy pale sky-blue ceramic sushi plate' },
  { id: 'plate3', desc: 'a glossy amber-orange ceramic sushi plate with a thin gold rim' },
  { id: 'plate4', desc: 'a luxurious glossy gold ceramic sushi plate with an ornate gold rim' },
]

/* =============== エリアの けしき =============== */
const AREA_STYLE =
  'A beautiful painted background for a children\'s fishing game, seen from just above the sea surface looking towards the shore. Warm inviting colours, soft painterly realism, clean and uncluttered, no people, no boats in the foreground, no text, no watermark.'
const AREA_FRAME =
  'Wide horizontal landscape. The horizon line and the waterline sit exactly along the BOTTOM edge of the image, so the whole picture is sky and distant scenery only, with no sea water visible in the frame. Fills the entire frame edge to edge with no margin.'

const AREAS = [
  { id: 'minato', desc: 'a cheerful small Japanese fishing harbour town: colourful low houses with tiled roofs stacked up a green hillside, a red and white lighthouse far right, fishing boats moored along a stone quay, seagulls, bright blue morning sky with soft clouds' },
  { id: 'teibou', desc: 'a long concrete breakwater pier stretching across the scene with tetrapods along it, a quiet industrial harbour town behind it, warm late afternoon light, soft golden sky' },
  { id: 'irie', desc: 'a calm sheltered green cove, dense forested hills coming right down to the water, a few pine trees leaning over the shore, a tiny wooden hut, gentle misty morning light, pale green sky' },
  { id: 'iwaba', desc: 'a rugged rocky shore with big dark boulders and cliffs, wind-bent pines on top, dramatic evening light, warm orange and pink sky' },
  { id: 'toudai', desc: 'the open sea far from land with a tall white lighthouse standing alone on a small rocky island, wide dramatic sunset sky with pink and violet clouds' },
]

/* =============== くみたて =============== */
export function buildJobs(FISH) {
  const jobs = []

  for (const c of CHARACTERS) {
    jobs.push({
      group: 'char',
      id: c.id,
      name: c.name,
      size: '1024x1536',
      box: [440, 560],
      prompt: [`${c.desc}.`, CHAR_STYLE, CHAR_POSE, FRAME, BG].join(' '),
    })
  }

  for (const r of RODS) {
    jobs.push({
      group: 'rod',
      id: r.id,
      name: r.name,
      size: '1536x1024',
      box: [600, 150],
      prompt: [`${r.desc}.`, ROD_STYLE, ROD_POSE, FRAME, BG].join(' '),
    })
  }

  for (const p of PLATES) {
    jobs.push({
      group: 'plate',
      id: p.id,
      name: p.id,
      size: '1536x1024',
      box: [340, 120],
      prompt: [
        `${p.desc}, completely empty with no food on it.`,
        'Photorealistic product photo, seen from a low three-quarter angle from the side so the plate looks like a shallow oval, soft studio light with a gentle highlight on the rim.',
        FRAME,
        BG,
      ].join(' '),
    })
  }

  for (const a of AREAS) {
    jobs.push({
      group: 'area',
      id: a.id,
      name: a.id,
      size: '1536x1024',
      box: [1280, 520],
      prompt: [`${a.desc}.`, AREA_STYLE, AREA_FRAME].join(' '),
      noTrim: true,
      cover: true,
    })
  }

  for (const o of OTHER) {
    jobs.push({ ...o, name: o.id, noTrim: o.id !== 'itamae', cover: o.id !== 'itamae' })
  }

  for (const f of FISH) {
    if (!f.sushi) continue
    jobs.push({
      group: 'sushi',
      id: f.id,
      name: `${f.name}のすし`,
      size: '1536x1024',
      box: [420, 320],
      prompt: [
        `A piece of nigiri sushi: ${f.sushi}, on a small oval mound of white vinegared sushi rice.`,
        SUSHI_STYLE,
        SUSHI_POSE,
        'No plate, no dish, no chopsticks, no soy sauce, no garnish on the side, just the single piece of sushi by itself.',
        FRAME,
        BG,
      ].join(' '),
    })
  }

  return jobs
}
