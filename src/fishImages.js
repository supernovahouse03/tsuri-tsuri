// src/assets/fish/<さかなID>.webp が あれば、SVG の かわりに その えを つかう。
// ファイルを おくだけで さしかわる（ビルド時に Vite が よみこむ）。
const mods = import.meta.glob('./assets/fish/*.webp', { eager: true, import: 'default' })

export const FISH_IMAGES = Object.fromEntries(
  Object.entries(mods).map(([p, url]) => [p.replace(/^.*\/(.+)\.webp$/, '$1'), url]),
)

export function fishImage(id) {
  return FISH_IMAGES[id]
}
