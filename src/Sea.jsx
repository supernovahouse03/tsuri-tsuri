import { useMemo } from 'react'
import { FISH } from './data'
import { areaImage } from './assets'
import { FishArt } from './art'

// よこから みた うみ の け しき（さかなが およいでいる）
export default function Sea({ area, children }) {
  const swimmers = useMemo(() => {
    const pool = FISH.filter((f) => !f.junk && (f.area === area.id || f.area === 'all'))
    const list = []
    const n = 14
    for (let i = 0; i < n; i++) {
      const f = pool[Math.floor(Math.random() * pool.length)] || FISH[0]
      list.push({
        key: `${i}-${f.id}`,
        fish: f,
        top: 4 + Math.random() * 44, // % of うみのなか
        size: (f.rarity >= 3 ? 74 : 46) + Math.random() * 34,
        dur: 14 + Math.random() * 22,
        delay: -Math.random() * 30,
        dir: Math.random() < 0.5 ? 1 : -1,
        bob: 2 + Math.random() * 5,
        bdur: 2 + Math.random() * 2.5,
        op: 0.5 + Math.random() * 0.5,
      })
    }
    return list
  }, [area.id])

  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 12,
        dur: 5 + Math.random() * 8,
        delay: -Math.random() * 12,
      })),
    [area.id],
  )

  const bg = areaImage(area.id)

  return (
    <div className="sea" style={{ '--sky1': area.sky[0], '--sky2': area.sky[1], '--w1': area.water[0], '--w2': area.water[1] }}>
      <div className={`sky ${bg ? 'photo' : ''}`} style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
        {!bg && (
          <>
            <div className="sun" />
            <div className="cloud c1" />
            <div className="cloud c2" />
            <div className="cloud c3" />
            <Scenery area={area} />
          </>
        )}
      </div>

      <div className="water">
        <div className="waterline" />
        <div className="rays" />
        {swimmers.map((s) => (
          <div
            key={s.key}
            className="swimmer"
            style={{
              top: `${s.top}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
              animationName: s.dir > 0 ? 'swimR' : 'swimL',
              opacity: s.op,
            }}
          >
            <div className="bobber" style={{ animationDuration: `${s.bdur}s`, '--bob': `${s.bob}px` }}>
              <FishArt fish={s.fish} size={s.size} flip={s.dir > 0} />
            </div>
          </div>
        ))}
        {bubbles.map((b) => (
          <div
            key={b.key}
            className="bubble"
            style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
          />
        ))}
        <div className="seabed">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="weed" style={{ left: `${4 + i * 11}%`, height: 30 + ((i * 37) % 50), animationDelay: `${-i * 0.7}s` }} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`r${i}`} className="rock" style={{ left: `${8 + i * 16}%`, width: 40 + ((i * 23) % 50) }} />
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}

function Scenery({ area }) {
  if (area.id === 'minato') {
    return (
      <div className="scenery">
        <div className="boat b1">⛵️</div>
        <div className="boat b2">🚢</div>
        <div className="town">🏘️ 🏠 🏢 🏠</div>
      </div>
    )
  }
  if (area.id === 'teibou') {
    return (
      <div className="scenery">
        <div className="town">🏘️ 🏠 🏭</div>
        <div className="pier" />
      </div>
    )
  }
  if (area.id === 'irie') {
    return (
      <div className="scenery">
        <div className="town">🌲 🌳 🏡 🌳 🌲</div>
      </div>
    )
  }
  if (area.id === 'iwaba') {
    return (
      <div className="scenery">
        <div className="town">⛰️ 🪨 ⛰️</div>
      </div>
    )
  }
  return (
    <div className="scenery">
      <div className="boat b1">🗼</div>
      <div className="town">🌅</div>
    </div>
  )
}
