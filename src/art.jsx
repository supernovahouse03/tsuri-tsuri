import { useId } from 'react'

/* いろの あかるさを かえる */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))))
  return `#${((f(r) << 16) | (f(g) << 8) | f(b)).toString(16).padStart(6, '0')}`
}

function Eye({ x, y, r = 4.6 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" />
      <circle cx={x} cy={y} r={r * 0.78} fill="#f7f3ea" />
      <circle cx={x + r * 0.12} cy={y} r={r * 0.5} fill="#1d2733" />
      <circle cx={x + r * 0.42} cy={y - r * 0.4} r={r * 0.22} fill="#fff" />
    </g>
  )
}

/* ============ さかな ============ */

export function FishArt({ fish, size = 80, flip = false }) {
  const raw = useId()
  const uid = raw.replace(/:/g, '')
  const c = fish.color
  const d = fish.color2
  const light = shade(c, 0.42)
  const belly = shade(c, 0.78)
  const finC = shade(d, 0.12)
  const finDark = shade(d, -0.2)
  const s = fish.shape

  const bodyGrad = `bg${uid}`
  const finGrad = `fg${uid}`
  const clipId = `cl${uid}`
  const scaleId = `sc${uid}`

  const defs = (
    <defs>
      <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={shade(d, 0.15)} />
        <stop offset="34%" stopColor={c} />
        <stop offset="70%" stopColor={light} />
        <stop offset="100%" stopColor={belly} />
      </linearGradient>
      <linearGradient id={finGrad} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={finC} stopOpacity="0.95" />
        <stop offset="100%" stopColor={finDark} stopOpacity="0.75" />
      </linearGradient>
      <pattern id={scaleId} width="9" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8 A 5 5 0 0 1 9 8" fill="none" stroke={shade(d, -0.05)} strokeWidth="0.9" opacity="0.28" />
        <path d="M-4.5 4 A 5 5 0 0 1 4.5 4" fill="none" stroke={shade(d, -0.05)} strokeWidth="0.9" opacity="0.28" />
        <path d="M4.5 4 A 5 5 0 0 1 13.5 4" fill="none" stroke={shade(d, -0.05)} strokeWidth="0.9" opacity="0.28" />
      </pattern>
    </defs>
  )

  /* ---- ふつうの さかな（ひれ つき）---- */
  function finFish({ h, tail = 'fork', pattern = 'scales', snout = 12 }) {
    const body = `M ${snout} 50
      C ${snout + 8} ${50 - h * 0.82}, 38 ${50 - h}, 60 ${50 - h * 0.94}
      C 78 ${50 - h * 0.84}, 92 ${50 - h * 0.42}, 96 50
      C 92 ${50 + h * 0.42}, 78 ${50 + h * 0.84}, 60 ${50 + h * 0.94}
      C 38 ${50 + h}, ${snout + 8} ${50 + h * 0.82}, ${snout} 50 Z`

    let tailPath
    if (tail === 'crescent') {
      tailPath = `M 92 50 C 104 ${50 - h * 0.3}, 112 ${50 - h * 1.5}, 122 ${50 - h * 1.75}
        C 116 ${50 - h * 0.6}, 114 ${50 + h * 0.6}, 122 ${50 + h * 1.75}
        C 112 ${50 + h * 1.5}, 104 ${50 + h * 0.3}, 92 50 Z`
    } else if (tail === 'round') {
      tailPath = `M 92 50 C 104 ${50 - h * 1.05}, 118 ${50 - h * 0.7}, 118 50
        C 118 ${50 + h * 0.7}, 104 ${50 + h * 1.05}, 92 50 Z`
    } else if (tail === 'point') {
      tailPath = `M 92 50 C 104 ${50 - h * 0.8}, 116 ${50 - h * 0.5}, 124 50
        C 116 ${50 + h * 0.5}, 104 ${50 + h * 0.8}, 92 50 Z`
    } else {
      tailPath = `M 92 50 C 102 ${50 - h * 0.5}, 110 ${50 - h * 1.35}, 118 ${50 - h * 1.5}
        C 110 ${50 - h * 0.45}, 110 ${50 + h * 0.45}, 118 ${50 + h * 1.5}
        C 110 ${50 + h * 1.35}, 102 ${50 + h * 0.5}, 92 50 Z`
    }

    return (
      <g>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>

        {/* おびれ・せびれ・しりびれ */}
        <path d={tailPath} fill={`url(#${finGrad})`} />
        <path
          d={`M 40 ${50 - h * 0.9} C 46 ${50 - h * 1.85}, 66 ${50 - h * 1.7}, 76 ${50 - h * 0.7} Z`}
          fill={`url(#${finGrad})`}
        />
        <path
          d={`M 52 ${50 + h * 0.88} C 56 ${50 + h * 1.55}, 66 ${50 + h * 1.45}, 74 ${50 + h * 0.72} Z`}
          fill={`url(#${finGrad})`}
        />

        {/* からだ */}
        <path d={body} fill={`url(#${bodyGrad})`} />
        <g clipPath={`url(#${clipId})`}>
          {pattern === 'scales' && <rect x="0" y="0" width="130" height="100" fill={`url(#${scaleId})`} />}
          {pattern === 'stripes' &&
            [0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M ${24 + i * 15} ${50 - h} q 6 ${h * 0.5} 0 ${h}`}
                stroke={shade(d, -0.25)}
                strokeWidth="4"
                fill="none"
                opacity="0.45"
              />
            ))}
          {pattern === 'bands' &&
            [0, 1, 2, 3].map((i) => (
              <rect key={i} x={26 + i * 17} y={50 - h * 1.1} width="7" height={h * 2.2} fill={shade(d, -0.3)} opacity="0.35" />
            ))}
          {pattern === 'spots' &&
            [
              [40, 40, 3.6],
              [55, 52, 4.6],
              [68, 42, 3.2],
              [48, 62, 3],
              [72, 58, 3.8],
              [60, 34, 2.6],
            ].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={shade(d, -0.2)} opacity="0.4" />)}
          {/* せなかの かげ と おなかの ひかり */}
          <path d={`M 0 ${50 - h * 0.35} H 130 V ${50 - h * 2} H 0 Z`} fill={shade(d, -0.35)} opacity="0.18" />
          <ellipse cx="52" cy={50 + h * 0.65} rx="34" ry={h * 0.34} fill="#fff" opacity="0.35" />
        </g>

        {/* むなびれ */}
        <path
          d={`M 38 ${50 + h * 0.18} C 44 ${50 + h * 0.9}, 52 ${50 + h * 1.0}, 54 ${50 + h * 0.35} Z`}
          fill={finDark}
          opacity="0.7"
        />
        {/* えら */}
        <path
          d={`M 31 ${50 - h * 0.6} C 25 50, 25 50, 31 ${50 + h * 0.6}`}
          stroke={shade(d, -0.2)}
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <Eye x={24} y={50 - h * 0.28} r={Math.min(5, 2.6 + h * 0.11)} />
        <path d={`M ${snout} ${50 + h * 0.2} q 5 3.5 9 2`} stroke={shade(d, -0.25)} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  /* ---- うなぎ・たちうお などの ながい さかな（うねうね）---- */
  function eelFish({ thick = 8, waves = 1.9 }) {
    const N = 26
    const cx = (t) => 14 + t * 100
    const cy = (t) => 50 + Math.sin(t * Math.PI * waves) * 14 * (1 - t * 0.25)
    // あたま から しっぽ に むかって ほそくなる
    const half = (t) => Math.max(1.2, thick * (1 - Math.pow(t, 1.7) * 0.95))

    const top = []
    const bot = []
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const x = cx(t)
      const y = cy(t)
      // せっせん の むき に あわせて あつみ を つける
      const dt = 0.01
      const dx = cx(Math.min(1, t + dt)) - cx(Math.max(0, t - dt))
      const dy = cy(Math.min(1, t + dt)) - cy(Math.max(0, t - dt))
      const len = Math.hypot(dx, dy) || 1
      const nx = (-dy / len) * half(t)
      const ny = (dx / len) * half(t)
      top.push(`${(x + nx).toFixed(1)} ${(y + ny).toFixed(1)}`)
      bot.push(`${(x - nx).toFixed(1)} ${(y - ny).toFixed(1)}`)
    }
    const body = `M ${top.join(' L ')} L ${bot.reverse().join(' L ')} Z`
    const tailX = cx(1)
    const tailY = cy(1)

    // せびれ（せなか に そった リボン）
    const finTop = []
    const finBase = []
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const x = cx(t)
      const y = cy(t)
      const dt = 0.01
      const dx = cx(Math.min(1, t + dt)) - cx(Math.max(0, t - dt))
      const dy = cy(Math.min(1, t + dt)) - cy(Math.max(0, t - dt))
      const len = Math.hypot(dx, dy) || 1
      const f = half(t) + 5 * (1 - t * 0.5)
      finTop.push(`${(x + (-dy / len) * f).toFixed(1)} ${(y + (dx / len) * f).toFixed(1)}`)
      finBase.push(`${(x + (-dy / len) * half(t) * 0.6).toFixed(1)} ${(y + (dx / len) * half(t) * 0.6).toFixed(1)}`)
    }
    const finPath = `M ${finTop.join(' L ')} L ${finBase.reverse().join(' L ')} Z`

    const headY = cy(0)
    return (
      <g>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
        {/* おびれ */}
        <path
          d={`M ${tailX - 6} ${tailY} L ${tailX + 14} ${tailY - 11} C ${tailX + 6} ${tailY}, ${tailX + 6} ${tailY}, ${tailX + 14} ${tailY + 11} Z`}
          fill={`url(#${finGrad})`}
        />
        <path d={finPath} fill={`url(#${finGrad})`} opacity="0.9" />
        <path d={body} fill={`url(#${bodyGrad})`} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="130" height="100" fill={`url(#${scaleId})`} opacity="0.55" />
        </g>
        {/* あたま */}
        <ellipse cx="16" cy={headY} rx={thick * 1.7} ry={thick * 1.15} fill={c} />
        <ellipse cx="14" cy={headY + thick * 0.4} rx={thick * 1.3} ry={thick * 0.55} fill={belly} opacity="0.7" />
        <path
          d={`M ${16 - thick * 1.7} ${headY + thick * 0.25} q ${thick * 1.1} ${thick * 0.5} ${thick * 2.1} ${thick * 0.05}`}
          stroke={shade(d, -0.32)}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path d={`M ${16 + thick * 0.9} ${headY - thick * 0.5} q 3 ${thick * 0.9} 0 ${thick * 1.5}`} stroke={shade(d, -0.2)} strokeWidth="1.6" fill="none" opacity="0.6" />
        <Eye x={13} y={headY - thick * 0.45} r={3.2} />
      </g>
    )
  }

  /* ---- ヒラメ（ひらたい さかな）---- */
  function flatFish() {
    const body = `M 12 54 C 22 30, 56 20, 82 34 C 98 42, 104 52, 96 62 C 78 76, 34 76, 12 54 Z`
    return (
      <g>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
        <path d="M 92 48 C 106 38, 118 44, 120 54 C 118 66, 104 70, 92 60 Z" fill={`url(#${finGrad})`} />
        <path d="M 16 44 C 34 20, 70 16, 88 32" stroke={`url(#${finGrad})`} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M 18 62 C 40 78, 74 76, 92 64" stroke={`url(#${finGrad})`} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d={body} fill={`url(#${bodyGrad})`} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="130" height="100" fill={`url(#${scaleId})`} />
          {[
            [34, 44, 4],
            [52, 38, 5],
            [68, 46, 4.4],
            [46, 60, 4.6],
            [74, 58, 3.6],
            [60, 66, 3],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={shade(d, -0.25)} opacity="0.35" />
          ))}
        </g>
        <Eye x={26} y={44} r={4.4} />
        <Eye x={38} y={38} r={4.4} />
        <path d="M 13 56 q 7 5 13 2" stroke={shade(d, -0.3)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  /* ---- サメ ---- */
  function sharkFish() {
    const body = `M 8 52 C 26 30, 58 26, 84 38 C 96 43, 104 48, 108 52
      C 100 62, 74 74, 46 70 C 26 67, 14 60, 8 52 Z`
    return (
      <g>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
        <path d="M 100 50 C 112 40, 118 26, 124 18 C 124 40, 122 52, 116 58 C 122 62, 124 70, 124 78 C 114 70, 106 60, 100 55 Z" fill={`url(#${finGrad})`} />
        <path d="M 50 32 C 56 12, 68 12, 74 34 Z" fill={`url(#${finGrad})`} />
        <path d="M 40 66 C 44 82, 58 82, 62 68 Z" fill={`url(#${finGrad})`} />
        <path d={body} fill={`url(#${bodyGrad})`} />
        <g clipPath={`url(#${clipId})`}>
          <path d="M 0 52 H 130 V 0 H 0 Z" fill={shade(d, -0.32)} opacity="0.25" />
          <ellipse cx="50" cy="64" rx="40" ry="10" fill="#fff" opacity="0.45" />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${30 + i * 6} ${46 + i} q -3 6 0 11`} stroke={shade(d, -0.3)} strokeWidth="1.6" fill="none" opacity="0.6" />
        ))}
        <Eye x={20} y={48} r={3.6} />
        <path d="M 8 56 C 16 62, 26 64, 34 62" stroke={shade(d, -0.35)} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M ${13 + i * 5} ${58 + i * 0.6} l 2 3 l 2 -3`} fill="#fff" opacity="0.9" />
        ))}
      </g>
    )
  }

  /* ---- タコ ---- */
  function octo() {
    return (
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M ${28 + i * 9} 58 C ${22 + i * 9} 74, ${34 + i * 9} 78, ${28 + i * 9} 90`}
            stroke={i % 2 ? shade(c, -0.08) : c}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <ellipse cx="52" cy="42" rx="30" ry="27" fill={`url(#${bodyGrad})`} />
        <ellipse cx="46" cy="32" rx="17" ry="11" fill="#fff" opacity="0.3" />
        {[
          [36, 52],
          [50, 58],
          [64, 52],
          [44, 64],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.4" fill={shade(d, -0.1)} opacity="0.5" />
        ))}
        <Eye x={40} y={40} r={6} />
        <Eye x={64} y={40} r={6} />
        <path d="M 46 54 q 6 6 12 0" stroke={shade(d, -0.25)} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  /* ---- イカ ---- */
  function squid() {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${34 + i * 8} 66 C ${30 + i * 8} 80, ${40 + i * 8} 84, ${36 + i * 8} 94`}
            stroke={shade(c, -0.05)}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <path d="M 52 6 C 40 8, 26 26, 30 40 C 22 34, 14 30, 12 34 C 18 42, 28 50, 34 54 L 70 54 C 76 50, 86 42, 92 34 C 90 30, 82 34, 74 40 C 78 26, 64 8, 52 6 Z" fill={`url(#${bodyGrad})`} />
        <ellipse cx="52" cy="58" rx="22" ry="13" fill={`url(#${bodyGrad})`} />
        <ellipse cx="46" cy="26" rx="10" ry="16" fill="#fff" opacity="0.28" />
        <Eye x={42} y={56} r={5.4} />
        <Eye x={62} y={56} r={5.4} />
      </g>
    )
  }

  /* ---- エビ ---- */
  function shrimp() {
    return (
      <g>
        <path d="M 100 62 C 114 52, 122 56, 124 66 C 118 74, 106 76, 98 70 Z" fill={`url(#${finGrad})`} />
        <path
          d="M 26 54 C 32 28, 62 22, 84 34 C 100 42, 106 58, 98 72"
          stroke={`url(#${bodyGrad})`}
          strokeWidth="21"
          fill="none"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${42 + i * 13} ${30 + i * 5} q 3 12 -2 22`}
            stroke={shade(d, -0.12)}
            strokeWidth="2.4"
            fill="none"
            opacity="0.55"
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${44 + i * 12} ${56 + i * 5} l -4 12`} stroke={shade(d, 0.1)} strokeWidth="3" strokeLinecap="round" />
        ))}
        <path d="M 28 44 C 14 32, 6 26, 2 20" stroke={shade(d, -0.1)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 28 50 C 14 44, 6 42, 0 40" stroke={shade(d, -0.1)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <ellipse cx="30" cy="50" rx="13" ry="12" fill={c} />
        <Eye x={26} y={44} r={3.8} />
      </g>
    )
  }

  /* ---- カニ ---- */
  function crab() {
    return (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M ${38 - i * 2} ${62 + i * 4} C ${26 - i * 6} ${70 + i * 5}, ${22 - i * 6} ${80 + i * 4}, ${26 - i * 5} ${88}`} stroke={shade(d, 0.05)} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d={`M ${68 + i * 2} ${62 + i * 4} C ${80 + i * 6} ${70 + i * 5}, ${84 + i * 6} ${80 + i * 4}, ${80 + i * 5} ${88}`} stroke={shade(d, 0.05)} strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ))}
        <path d="M 26 44 C 10 34, 4 20, 12 12 C 22 14, 26 26, 28 36 C 24 30, 18 26, 14 26 C 18 32, 24 38, 30 42 Z" fill={c} />
        <path d="M 80 44 C 96 34, 102 20, 94 12 C 84 14, 80 26, 78 36 C 82 30, 88 26, 92 26 C 88 32, 82 38, 76 42 Z" fill={c} />
        <path d="M 20 52 C 24 34, 40 26, 53 26 C 66 26, 82 34, 86 52 C 88 66, 72 74, 53 74 C 34 74, 18 66, 20 52 Z" fill={`url(#${bodyGrad})`} />
        <path d="M 26 44 C 40 38, 66 38, 80 44" stroke={shade(d, -0.15)} strokeWidth="2" fill="none" opacity="0.45" />
        <Eye x={42} y={44} r={5} />
        <Eye x={64} y={44} r={5} />
        <path d="M 44 60 q 9 7 18 0" stroke={shade(d, -0.3)} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="58" r="3" fill="#fff" opacity="0.35" />
      </g>
    )
  }

  /* ---- クラゲ ---- */
  function jelly() {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${30 + i * 11} 56 C ${26 + i * 11} 70, ${36 + i * 11} 76, ${32 + i * 11} 92`}
            stroke={d}
            strokeWidth="3.4"
            fill="none"
            opacity="0.65"
            strokeLinecap="round"
          />
        ))}
        <path d="M 20 54 C 20 26, 40 16, 53 16 C 66 16, 86 26, 86 54 C 70 62, 36 62, 20 54 Z" fill={`url(#${bodyGrad})`} opacity="0.82" />
        <path d="M 30 44 C 32 28, 42 22, 50 22" stroke="#fff" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M 20 54 C 36 60, 70 60, 86 54" stroke={d} strokeWidth="2.4" fill="none" opacity="0.5" />
        <Eye x={42} y={42} r={4.2} />
        <Eye x={62} y={42} r={4.2} />
        <path d="M 48 50 q 5 4 9 0" stroke={shade(d, -0.2)} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  /* ---- かい ---- */
  function shell() {
    return (
      <g>
        <path d="M 16 68 C 18 34, 36 16, 53 16 C 70 16, 88 34, 90 68 Z" fill={`url(#${bodyGrad})`} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M 53 18 C ${44 + i * 4} 38, ${30 + i * 9} 54, ${22 + i * 12} 68`} stroke={shade(d, -0.1)} strokeWidth="1.8" fill="none" opacity="0.45" />
        ))}
        <path d="M 16 68 C 40 62, 66 62, 90 68 L 90 74 C 66 78, 40 78, 16 74 Z" fill={shade(d, 0.1)} />
        <Eye x={44} y={56} r={4} />
        <Eye x={62} y={56} r={4} />
      </g>
    )
  }

  /* ---- ドラゴン ---- */
  function dragon() {
    const body = `M 12 52 C 30 22, 52 62, 70 40 C 86 20, 106 42, 120 30
      C 112 52, 96 64, 78 58 C 60 52, 48 74, 30 70 C 20 68, 14 60, 12 52 Z`
    return (
      <g>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
        <path d="M 112 26 L 128 10 L 126 34 L 130 48 L 112 44 Z" fill={`url(#${finGrad})`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M ${26 + i * 19} ${46 - (i % 2) * 14} l 7 -16 l 8 14 z`} fill={shade(d, 0.2)} />
        ))}
        <path d={body} fill={`url(#${bodyGrad})`} />
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="130" height="100" fill={`url(#${scaleId})`} />
        </g>
        <ellipse cx="18" cy="50" rx="15" ry="12" fill={c} />
        <path d="M 12 40 L 2 26 L 20 36 Z" fill={shade(d, 0.2)} />
        <path d="M 22 38 L 24 24 L 30 38 Z" fill={shade(d, 0.2)} />
        <Eye x={16} y={46} r={4.4} />
        <path d="M 6 54 q 8 6 16 2" stroke={shade(d, -0.3)} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M 4 52 l -4 -3 M 4 56 l -4 3" stroke={shade(d, 0.2)} strokeWidth="1.8" strokeLinecap="round" />
      </g>
    )
  }

  /* ---- でんせつの きれいな さかな ---- */
  function fancy() {
    const h = 24
    return (
      <g>
        <clipPath id={clipId}>
          <path d={`M 12 50 C 22 ${50 - h * 0.9}, 42 ${50 - h}, 62 ${50 - h * 0.9} C 82 ${50 - h * 0.7}, 92 ${50 - h * 0.4}, 96 50 C 92 ${50 + h * 0.4}, 82 ${50 + h * 0.7}, 62 ${50 + h * 0.9} C 42 ${50 + h}, 22 ${50 + h * 0.9}, 12 50 Z`} />
        </clipPath>
        <path d="M 92 50 C 106 20, 120 14, 128 10 C 122 34, 122 66, 128 90 C 120 86, 106 80, 92 50 Z" fill={`url(#${finGrad})`} opacity="0.9" />
        <path d="M 34 28 C 42 4, 70 6, 78 30 Z" fill={`url(#${finGrad})`} />
        <path d="M 44 72 C 50 92, 70 90, 74 70 Z" fill={`url(#${finGrad})`} />
        <path
          d={`M 12 50 C 22 ${50 - h * 0.9}, 42 ${50 - h}, 62 ${50 - h * 0.9} C 82 ${50 - h * 0.7}, 92 ${50 - h * 0.4}, 96 50 C 92 ${50 + h * 0.4}, 82 ${50 + h * 0.7}, 62 ${50 + h * 0.9} C 42 ${50 + h}, 22 ${50 + h * 0.9}, 12 50 Z`}
          fill={`url(#${bodyGrad})`}
        />
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="130" height="100" fill={`url(#${scaleId})`} />
          <ellipse cx="52" cy="64" rx="34" ry="10" fill="#fff" opacity="0.4" />
          <path d="M 0 40 H 130 V 0 H 0 Z" fill={shade(d, -0.3)} opacity="0.15" />
        </g>
        <Eye x={25} y={44} r={5} />
        <path d="M 12 54 q 7 5 13 1" stroke={shade(d, -0.3)} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <g fill="#fff" opacity="0.9">
          <path d="M 74 30 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" />
          <path d="M 40 66 l 1.4 3.4 l 3.4 1.4 l -3.4 1.4 l -1.4 3.4 l -1.4 -3.4 l -3.4 -1.4 l 3.4 -1.4 z" />
        </g>
      </g>
    )
  }

  /* ---- ゴミ など ---- */
  function boot() {
    return (
      <g>
        <path d="M 34 14 C 34 12, 36 10, 40 10 L 58 10 C 62 10, 64 12, 64 16 L 64 52 C 64 56, 68 58, 74 58 L 86 58 C 94 58, 98 64, 98 72 L 98 78 L 34 78 Z" fill={`url(#${bodyGrad})`} />
        <rect x="30" y="72" width="72" height="10" rx="5" fill={shade(d, -0.15)} />
        <rect x="32" y="10" width="34" height="9" rx="4" fill={shade(d, 0.2)} />
        <path d="M 42 24 L 42 66" stroke="#fff" strokeWidth="3" opacity="0.25" />
      </g>
    )
  }
  function can() {
    return (
      <g>
        <rect x="36" y="24" width="32" height="52" rx="4" fill={`url(#${bodyGrad})`} />
        <ellipse cx="52" cy="24" rx="16" ry="6" fill={shade(d, 0.25)} />
        <ellipse cx="52" cy="24" rx="10" ry="3.4" fill={shade(d, -0.1)} />
        <rect x="36" y="42" width="32" height="14" fill={shade(d, -0.05)} opacity="0.55" />
        <path d="M 41 26 L 41 74" stroke="#fff" strokeWidth="3" opacity="0.35" />
      </g>
    )
  }
  function chest() {
    return (
      <g>
        <path d="M 18 44 C 18 24, 88 24, 88 44 L 88 46 L 18 46 Z" fill={shade(d, 0.1)} />
        <rect x="18" y="46" width="70" height="30" rx="4" fill={`url(#${bodyGrad})`} />
        <rect x="18" y="40" width="70" height="7" fill={shade(d, -0.1)} />
        <rect x="16" y="70" width="74" height="8" rx="3" fill={shade(d, -0.1)} />
        <rect x="46" y="42" width="14" height="22" rx="3" fill={shade(d, -0.2)} />
        <circle cx="53" cy="54" r="3.6" fill="#ffe9a8" />
        <g fill="#fff8c8">
          <path d="M 92 30 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" />
        </g>
      </g>
    )
  }

  let art = null
  if (s === 'normal') art = finFish({ h: 21, tail: 'fork', pattern: fish.pattern || 'scales' })
  else if (s === 'slim') art = finFish({ h: 13, tail: 'fork', pattern: fish.pattern || 'scales', snout: 8 })
  else if (s === 'big') art = finFish({ h: 25, tail: 'crescent', pattern: fish.pattern || 'stripes' })
  else if (s === 'round') art = finFish({ h: 30, tail: 'round', pattern: fish.pattern || 'spots', snout: 18 })
  else if (s === 'long') art = eelFish({ thick: fish.id === 'tachiuo' ? 6 : 8, waves: fish.id === 'suzuki' ? 1.2 : 1.9 })
  else if (s === 'flat') art = flatFish()
  else if (s === 'shark') art = sharkFish()
  else if (s === 'octo') art = octo()
  else if (s === 'squid') art = squid()
  else if (s === 'shrimp') art = shrimp()
  else if (s === 'crab') art = crab()
  else if (s === 'jelly') art = jelly()
  else if (s === 'shell') art = shell()
  else if (s === 'dragon') art = dragon()
  else if (s === 'fancy') art = fancy()
  else if (s === 'boot') art = boot()
  else if (s === 'can') art = can()
  else if (s === 'chest') art = chest()
  else art = finFish({ h: 20 })

  return (
    <svg
      viewBox="0 0 130 100"
      width={size}
      height={(size * 100) / 130}
      style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible' }}
    >
      {defs}
      {art}
    </svg>
  )
}

/* ============ キャラクター ============ */

export function CharArt({ char, size = 120, pose = 'idle', rod = false }) {
  const c = char.color
  const d = char.color2
  const isCat = char.body === 'cat'
  const pull = pose === 'pull'
  // うでの さきっぽ（ここから さおが でる）
  const pawX = 90
  const pawY = pull ? 84 : 92

  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} style={{ overflow: 'visible' }}>
      {/* しっぽ */}
      {isCat ? (
        <path d="M 86 104 Q 108 100 100 76" stroke={d} strokeWidth="9" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 86 104 Q 104 108 102 92" stroke={d} strokeWidth="11" fill="none" strokeLinecap="round" />
      )}
      {/* からだ */}
      <ellipse cx="60" cy="104" rx="28" ry="26" fill={c} />
      <ellipse cx="60" cy="110" rx="17" ry="16" fill="#fff" opacity="0.6" />
      <ellipse cx="46" cy="128" rx="10" ry="7" fill={d} />
      <ellipse cx="74" cy="128" rx="10" ry="7" fill={d} />
      {/* ひだりの うで */}
      <path d="M 34 98 C 24 100, 20 106, 26 110" stroke={c} strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* あたま */}
      {isCat && (
        <>
          <path d="M 34 48 L 32 22 L 54 36 Z" fill={c} />
          <path d="M 86 48 L 88 22 L 66 36 Z" fill={c} />
          <path d="M 38 44 L 37 30 L 50 39 Z" fill="#ffb8c8" />
          <path d="M 82 44 L 83 30 L 70 39 Z" fill="#ffb8c8" />
        </>
      )}
      <ellipse cx="60" cy="58" rx="32" ry="28" fill={c} />
      {!isCat && (
        <>
          <path d="M 34 38 Q 16 30 18 58 Q 22 74 36 62 Z" fill={d} />
          <path d="M 86 38 Q 104 30 102 58 Q 98 74 84 62 Z" fill={d} />
        </>
      )}
      <ellipse cx="60" cy="68" rx="16" ry="12" fill="#fff" opacity="0.75" />
      <circle cx="48" cy="54" r="6" fill="#2a3440" />
      <circle cx="50.5" cy="51.5" r="2.2" fill="#fff" />
      <circle cx="72" cy="54" r="6" fill="#2a3440" />
      <circle cx="74.5" cy="51.5" r="2.2" fill="#fff" />
      <ellipse cx="60" cy="64" rx="5" ry="4" fill={d} />
      <path d="M 60 68 Q 54 76 48 70" stroke="#2a3440" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M 60 68 Q 66 76 72 70" stroke="#2a3440" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="66" rx="7" ry="5" fill="#ff9fb0" opacity="0.6" />
      <ellipse cx="82" cy="66" rx="7" ry="5" fill="#ff9fb0" opacity="0.6" />
      {isCat && (
        <>
          <path d="M 40 62 L 26 58" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 40 66 L 26 68" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 80 62 L 94 58" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 80 66 L 94 68" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}

      {/* みぎの うで（さおを もつ）*/}
      <path
        d={`M 82 104 C ${86} ${98}, ${pawX - 2} ${pawY + 6}, ${pawX} ${pawY}`}
        stroke={c}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      {rod && (
        <g>
          {/* つりざお: てのひら から ななめうえ へ */}
          <line
            x1={pawX - 6}
            y1={pawY + 6}
            x2={195}
            y2={pull ? 4 : 15}
            stroke="#7a4f22"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* グリップ と リール */}
          <line x1={pawX - 14} y1={pawY + 12} x2={pawX + 10} y2={pawY - 4} stroke="#2f3a45" strokeWidth="8" strokeLinecap="round" />
          <circle cx={pawX + 4} cy={pawY + 8} r="6" fill="#8f9aa5" stroke="#5c6670" strokeWidth="2" />
        </g>
      )}
      {/* てのひら（さおの うえ）*/}
      <ellipse cx={pawX} cy={pawY} rx="9.5" ry="8" fill={c} />
      <ellipse cx={pawX} cy={pawY + 1} rx="5" ry="4" fill={d} opacity="0.45" />
    </svg>
  )
}

/* ============ おすし ============ */

export function SushiArt({ fish, size = 90 }) {
  const raw = useId()
  const uid = raw.replace(/:/g, '')
  const c = fish.color
  const d = fish.color2
  const netaG = `n${uid}`
  const riceG = `r${uid}`
  const isRoll = fish.shape === 'shell' || fish.shape === 'jelly'

  return (
    <svg viewBox="0 0 100 74" width={size} height={(size * 74) / 100}>
      <defs>
        <linearGradient id={netaG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(c, 0.35)} />
          <stop offset="55%" stopColor={c} />
          <stop offset="100%" stopColor={shade(d, 0.05)} />
        </linearGradient>
        <linearGradient id={riceG} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#efe6d6" />
        </linearGradient>
      </defs>
      {/* かげ */}
      <ellipse cx="50" cy="66" rx="33" ry="5" fill="#000" opacity="0.12" />
      {/* シャリ */}
      <path d="M 16 62 C 14 46, 24 40, 50 40 C 76 40, 86 46, 84 62 C 70 68, 30 68, 16 62 Z" fill={`url(#${riceG})`} />
      {[
        [26, 52],
        [36, 58],
        [48, 52],
        [60, 58],
        [72, 52],
        [42, 46],
        [64, 46],
        [30, 62],
        [56, 63],
        [76, 58],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.2" ry="2.2" fill="#fff" opacity="0.9" />
      ))}
      {/* ネタ */}
      {isRoll ? (
        <>
          <ellipse cx="50" cy="40" rx="34" ry="13" fill="#2c4a34" />
          <ellipse cx="50" cy="38" rx="27" ry="9" fill={`url(#${riceG})`} />
          <ellipse cx="50" cy="38" rx="12" ry="6" fill={`url(#${netaG})`} />
        </>
      ) : (
        <>
          <path d="M 12 40 C 20 24, 40 18, 52 18 C 66 18, 84 26, 88 40 C 74 48, 26 48, 12 40 Z" fill={`url(#${netaG})`} />
          <path d="M 18 34 C 32 26, 66 26, 82 34" stroke="#fff" strokeWidth="2.6" fill="none" opacity="0.4" />
          <path d="M 24 40 C 40 34, 62 34, 78 40" stroke={shade(d, -0.1)} strokeWidth="2" fill="none" opacity="0.35" />
          <path d="M 12 40 C 26 48, 74 48, 88 40 C 74 44, 26 44, 12 40 Z" fill={shade(d, -0.15)} opacity="0.3" />
          {/* のり */}
          <path d="M 42 22 h 14 v 32 h -14 z" fill="#2c4a34" opacity="0.9" />
        </>
      )}
    </svg>
  )
}

/* ============ おさら（かいてんずし）============ */

export function PlateArt({ color = '#e8eef2', size = 92 }) {
  return (
    <svg viewBox="0 0 120 34" width={size} height={(size * 34) / 120}>
      <ellipse cx="60" cy="20" rx="56" ry="13" fill={shade(color, -0.22)} />
      <ellipse cx="60" cy="16" rx="56" ry="13" fill={color} />
      <ellipse cx="60" cy="15" rx="44" ry="9.5" fill={shade(color, 0.35)} />
      <ellipse cx="60" cy="14" rx="30" ry="6" fill={shade(color, 0.15)} opacity="0.5" />
    </svg>
  )
}
