// つりつりゲーム のデータ（5さいむけ・ひらがな中心）

export const CHARACTERS = [
  {
    id: 'wanta',
    name: 'ワンタ',
    kind: 'いぬ',
    color: '#ffcf6b',
    color2: '#f2a63c',
    perk: 'れんだが つよい！',
    perkKey: 'power',
    body: 'dog',
  },
  {
    id: 'mikeru',
    name: 'ミケル',
    kind: 'ねこ',
    color: '#ffe9d2',
    color2: '#ff9f68',
    perk: 'ヒットの タイミングが ながい！',
    perkKey: 'window',
    body: 'cat',
  },
  {
    id: 'shiba',
    name: 'マメスケ',
    kind: 'しばいぬ',
    color: '#f7d9a8',
    color2: '#c98a45',
    perk: 'さかなが すぐ よってくる！',
    perkKey: 'quick',
    body: 'dog',
  },
  {
    id: 'kuro',
    name: 'クロネ',
    kind: 'くろねこ',
    color: '#8f8fc4',
    color2: '#5c5c94',
    perk: 'レアな さかなが つれやすい！',
    perkKey: 'rare',
    body: 'cat',
  },
]

// レア度: 1 ふつう / 2 めずらしい / 3 レア / 4 でんせつ
export const FISH = [
  // みなと
  { id: 'aji', pattern: 'scales', name: 'アジ', area: 'minato', rarity: 1, price: 30, min: 12, max: 28, color: '#9fd8e8', color2: '#4a90b8', shape: 'normal' },
  { id: 'iwashi', pattern: 'scales', name: 'イワシ', area: 'minato', rarity: 1, price: 20, min: 8, max: 18, color: '#cfe9f5', color2: '#6aa8cf', shape: 'slim' },
  { id: 'saba', pattern: 'stripes', name: 'サバ', area: 'minato', rarity: 1, price: 45, min: 20, max: 42, color: '#8fd0c0', color2: '#3c7f7a', shape: 'normal' },
  { id: 'fugu', pattern: 'spots', name: 'フグ', area: 'minato', rarity: 2, price: 120, min: 10, max: 26, color: '#ffe08a', color2: '#e0a83c', shape: 'round' },
  { id: 'takobo', name: 'コダコ', area: 'minato', rarity: 2, price: 140, min: 12, max: 30, color: '#ff9fb0', color2: '#d95f7c', shape: 'octo' },
  { id: 'kingyo', pattern: 'scales', name: 'ミナトキング', area: 'minato', rarity: 3, price: 420, min: 30, max: 55, color: '#ffd166', color2: '#e07a1f', shape: 'round' },

  // ていぼう
  { id: 'kisu', pattern: 'scales', name: 'キス', area: 'teibou', rarity: 1, price: 40, min: 12, max: 26, color: '#fff0d6', color2: '#d9b98a', shape: 'slim' },
  { id: 'kurodai', pattern: 'bands', name: 'クロダイ', area: 'teibou', rarity: 2, price: 160, min: 25, max: 50, color: '#9aa3b5', color2: '#4a5468', shape: 'normal' },
  { id: 'suzuki', pattern: 'scales', name: 'スズキ', area: 'teibou', rarity: 2, price: 200, min: 35, max: 70, color: '#d8e6f0', color2: '#7f95a8', shape: 'long' },
  { id: 'tachiuo', name: 'タチウオ', area: 'teibou', rarity: 3, price: 320, min: 60, max: 110, color: '#e8f0f5', color2: '#a8b8c4', shape: 'long' },
  { id: 'ika', name: 'イカ', area: 'teibou', rarity: 2, price: 150, min: 15, max: 35, color: '#ffe3ef', color2: '#e08fb0', shape: 'squid' },
  { id: 'ebi', name: 'クルマエビ', area: 'teibou', rarity: 2, price: 180, min: 8, max: 20, color: '#ffc3a0', color2: '#e0653c', shape: 'shrimp' },

  // いりえ
  { id: 'unagi', name: 'ウナギ', area: 'irie', rarity: 2, price: 260, min: 40, max: 90, color: '#8a7a5c', color2: '#4a3f2c', shape: 'long' },
  { id: 'kani', name: 'カニ', area: 'irie', rarity: 2, price: 190, min: 8, max: 24, color: '#ff8a6b', color2: '#c9432c', shape: 'crab' },
  { id: 'hirame', name: 'ヒラメ', area: 'irie', rarity: 3, price: 380, min: 30, max: 65, color: '#dcd0b8', color2: '#8f7f5f', shape: 'flat' },
  { id: 'kurage', name: 'クラゲ', area: 'irie', rarity: 1, price: 15, min: 5, max: 20, color: '#e0d6ff', color2: '#a89fd8', shape: 'jelly' },
  { id: 'kaki', name: 'ホタテ', area: 'irie', rarity: 1, price: 60, min: 6, max: 16, color: '#ffeecc', color2: '#d9b06b', shape: 'shell' },
  { id: 'ryugu', name: 'リュウグウヒメ', area: 'irie', rarity: 4, price: 1200, min: 40, max: 80, color: '#b9f0ff', color2: '#3fa8d8', shape: 'fancy' },

  // いわば
  { id: 'kasago', pattern: 'spots', name: 'カサゴ', area: 'iwaba', rarity: 1, price: 70, min: 12, max: 30, color: '#e0785c', color2: '#8f3320', shape: 'normal' },
  { id: 'ise', name: 'イセエビ', area: 'iwaba', rarity: 3, price: 520, min: 20, max: 45, color: '#e05c4a', color2: '#8f2418', shape: 'shrimp' },
  { id: 'tako', name: 'オオダコ', area: 'iwaba', rarity: 3, price: 460, min: 40, max: 95, color: '#ff7f9c', color2: '#b03050', shape: 'octo' },
  { id: 'ainame', pattern: 'spots', name: 'アイナメ', area: 'iwaba', rarity: 2, price: 170, min: 20, max: 45, color: '#c8d88f', color2: '#6f8038', shape: 'normal' },
  { id: 'utsubo', name: 'ウツボ', area: 'iwaba', rarity: 3, price: 400, min: 50, max: 120, color: '#a8c060', color2: '#4f6020', shape: 'long' },
  { id: 'iwaou', name: 'イワバノヌシ', area: 'iwaba', rarity: 4, price: 1500, min: 60, max: 120, color: '#c0a8ff', color2: '#5a3fa8', shape: 'fancy' },

  // おきのとうだい
  { id: 'katsuo', pattern: 'stripes', name: 'カツオ', area: 'toudai', rarity: 2, price: 300, min: 40, max: 80, color: '#8fb8d8', color2: '#3a5f80', shape: 'normal' },
  { id: 'maguro', pattern: 'scales', name: 'マグロ', area: 'toudai', rarity: 3, price: 900, min: 80, max: 180, color: '#6fa8d0', color2: '#25496b', shape: 'big' },
  { id: 'buri', pattern: 'stripes', name: 'ブリ', area: 'toudai', rarity: 3, price: 700, min: 60, max: 120, color: '#bfe0d0', color2: '#4f7f6b', shape: 'big' },
  { id: 'manbo', pattern: 'scales', name: 'マンボウ', area: 'toudai', rarity: 3, price: 800, min: 90, max: 200, color: '#cfd8e0', color2: '#7f8f9f', shape: 'round' },
  { id: 'same', name: 'コザメ', area: 'toudai', rarity: 3, price: 850, min: 70, max: 150, color: '#a8b8c8', color2: '#4f5f70', shape: 'shark' },
  { id: 'ryu', name: 'ウミノドラゴン', area: 'toudai', rarity: 4, price: 2500, min: 100, max: 250, color: '#8fffd0', color2: '#1f8f7f', shape: 'dragon' },

  // どこでも（ゴミ・おたのしみ）
  { id: 'nagagutsu', name: 'ながぐつ', area: 'all', rarity: 1, price: 5, min: 20, max: 30, color: '#7fb0d8', color2: '#3a6f9f', shape: 'boot', junk: true },
  { id: 'kan', name: 'あきカン', area: 'all', rarity: 1, price: 5, min: 8, max: 14, color: '#d8d8d8', color2: '#8f8f8f', shape: 'can', junk: true },
  { id: 'takara', name: 'たからばこ', area: 'all', rarity: 4, price: 1000, min: 20, max: 40, color: '#ffd166', color2: '#a86f1f', shape: 'chest', junk: true },
]

export const AREAS = [
  {
    id: 'minato',
    name: 'みなと',
    sub: 'ふねが いっぱい！ さかなも いっぱい',
    unlock: 0,
    sky: ['#8fd8ff', '#d8f4ff'],
    water: ['#4fb8e0', '#0d5f8f'],
    x: 22, y: 62,
    emoji: '⚓️',
    diff: 1,
  },
  {
    id: 'teibou',
    name: 'ていぼう',
    sub: 'ながい ていぼうから ねらおう',
    unlock: 3,
    sky: ['#a8e0ff', '#ffe8c0'],
    water: ['#3fa8d8', '#0a4f7f'],
    x: 48, y: 40,
    emoji: '🧱',
    diff: 1.15,
  },
  {
    id: 'irie',
    name: 'いりえ',
    sub: 'しずかな みずべ めずらしい いきもの',
    unlock: 7,
    sky: ['#bfe8d0', '#f0ffe8'],
    water: ['#3fb89f', '#0a5f5f'],
    x: 20, y: 26,
    emoji: '🌿',
    diff: 1.3,
  },
  {
    id: 'iwaba',
    name: 'いわば',
    sub: 'ごつごつ いわの あいだに おおもの',
    unlock: 12,
    sky: ['#ffd8b0', '#ffeed8'],
    water: ['#3f7fb8', '#062f5f'],
    x: 72, y: 58,
    emoji: '🪨',
    diff: 1.5,
  },
  {
    id: 'toudai',
    name: 'おきのとうだい',
    sub: 'うみの まんなか！ でんせつの さかな',
    unlock: 18,
    sky: ['#ffb8d0', '#ffe0f0'],
    water: ['#2f5fa8', '#04214f'],
    x: 80, y: 22,
    emoji: '🗼',
    diff: 1.8,
  },
]

export const RODS = [
  { id: 'rod1', name: 'たけの さおの', label: 'たけのさお', price: 0, power: 1.0, window: 1.0, desc: 'さいしょの さお' },
  { id: 'rod2', name: 'キラリざお', label: 'キラリざお', price: 500, power: 1.25, window: 1.15, desc: 'ちょっと つよい' },
  { id: 'rod3', name: 'ぎんいろざお', label: 'ぎんいろざお', price: 2000, power: 1.5, window: 1.3, desc: 'おおものも へっちゃら' },
  { id: 'rod4', name: 'にじいろざお', label: 'にじいろざお', price: 6000, power: 1.9, window: 1.5, desc: 'でんせつの さお！' },
]

export const BAITS = [
  { id: 'none', name: 'えさなし', price: 0, rare: 1.0, speed: 1.0, desc: 'とりあえず なげる' },
  { id: 'mushi', name: 'ゴカイ', price: 20, rare: 1.2, speed: 0.85, desc: 'さかなが すこし よってくる' },
  { id: 'ebi', name: 'エビえさ', price: 60, rare: 1.6, speed: 0.75, desc: 'めずらしい さかなが きやすい' },
  { id: 'hikari', name: 'ヒカリだま', price: 150, rare: 2.4, speed: 0.6, desc: 'レアな さかなが ドキドキ' },
  { id: 'niji', name: 'にじのえさ', price: 400, rare: 4.0, speed: 0.5, desc: 'でんせつを よぶ えさ' },
]

export const RARITY_LABEL = ['', 'ふつう', 'めずらしい', 'レア', 'でんせつ']
export const RARITY_COLOR = ['', '#7fc8e8', '#7fd88f', '#ffb84f', '#ff7fd8']

export function fishById(id) {
  return FISH.find((f) => f.id === id)
}
