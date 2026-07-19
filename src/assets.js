// src/assets/<グループ>/<ID>.webp が あれば つかう。なければ SVG に フォールバック。
// ファイルを おく/けす だけで きりかわる。
const pick = (mods) =>
  Object.fromEntries(Object.entries(mods).map(([p, url]) => [p.replace(/^.*\/(.+)\.webp$/, '$1'), url]))

const FISH = pick(import.meta.glob('./assets/fish/*.webp', { eager: true, import: 'default' }))
const CHAR = pick(import.meta.glob('./assets/char/*.webp', { eager: true, import: 'default' }))
const ROD = pick(import.meta.glob('./assets/rod/*.webp', { eager: true, import: 'default' }))
const SUSHI = pick(import.meta.glob('./assets/sushi/*.webp', { eager: true, import: 'default' }))
const PLATE = pick(import.meta.glob('./assets/plate/*.webp', { eager: true, import: 'default' }))
const AREA = pick(import.meta.glob('./assets/area/*.webp', { eager: true, import: 'default' }))
const SHOP = pick(import.meta.glob('./assets/shop/*.webp', { eager: true, import: 'default' }))

export const fishImage = (id) => FISH[id]
export const charImage = (id) => CHAR[id]
export const rodImage = (id) => ROD[id]
export const sushiImage = (id) => SUSHI[id]
export const plateImage = (rarity) => PLATE[`plate${Math.min(4, Math.max(1, rarity))}`]
export const areaImage = (id) => AREA[id]
export const shopImage = (id) => SHOP[id]
