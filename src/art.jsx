// さかな と キャラクター の え（ぜんぶ SVG）

export function FishArt({ fish, size = 80, flip = false }) {
  const c = fish.color
  const d = fish.color2
  const s = fish.shape
  const eye = (x, y, r = 3.2) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" />
      <circle cx={x + 0.8} cy={y} r={r * 0.55} fill="#20303f" />
      <circle cx={x + 1.6} cy={y - 1} r={r * 0.2} fill="#fff" />
    </g>
  )

  let body = null
  if (s === 'normal' || s === 'slim' || s === 'big') {
    const h = s === 'slim' ? 14 : s === 'big' ? 26 : 20
    body = (
      <g>
        <path d={`M74 50 L92 34 L92 66 Z`} fill={d} />
        <ellipse cx="48" cy="50" rx="30" ry={h} fill={c} />
        <path d={`M20 50 Q48 ${50 - h} 78 50 Q48 ${50 + h * 0.2} 20 50`} fill={d} opacity="0.35" />
        <path d="M48 32 L58 24 L62 36 Z" fill={d} />
        <path d="M44 66 L52 76 L56 64 Z" fill={d} opacity="0.85" />
        <path d="M30 44 Q26 50 30 56" stroke={d} strokeWidth="2.5" fill="none" />
        {eye(30, 46, 4)}
        <path d="M20 52 Q24 55 21 57" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'long') {
    body = (
      <g>
        <path d="M88 50 L98 40 L98 60 Z" fill={d} />
        <path d="M14 50 Q30 30 50 50 Q70 70 90 50 Q70 62 50 58 Q30 54 14 50" fill={c} />
        <ellipse cx="22" cy="50" rx="12" ry="9" fill={c} />
        <path d="M14 50 Q22 42 32 48" stroke={d} strokeWidth="2" fill="none" />
        {eye(19, 47, 3.4)}
        <path d="M12 53 Q17 56 22 54" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'round') {
    body = (
      <g>
        <path d="M78 50 L94 38 L94 62 Z" fill={d} />
        <circle cx="46" cy="50" r="28" fill={c} />
        <circle cx="46" cy="56" r="20" fill={d} opacity="0.2" />
        <path d="M46 22 L54 14 L58 26 Z" fill={d} />
        {eye(30, 44, 4.5)}
        {eye(48, 42, 4.5)}
        <path d="M28 58 Q36 66 46 58" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="60" r="2" fill={d} />
        <circle cx="52" cy="66" r="2" fill={d} />
      </g>
    )
  } else if (s === 'flat') {
    body = (
      <g>
        <path d="M84 50 L96 42 L96 60 Z" fill={d} />
        <ellipse cx="46" cy="52" rx="34" ry="16" fill={c} />
        <ellipse cx="46" cy="52" rx="26" ry="9" fill={d} opacity="0.25" />
        {eye(28, 44, 4)}
        {eye(38, 42, 4)}
        <path d="M14 54 Q20 58 26 55" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'octo') {
    body = (
      <g>
        <ellipse cx="46" cy="38" rx="24" ry="22" fill={c} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${28 + i * 9} 56 Q${24 + i * 9} 74 ${34 + i * 9} 80`}
            stroke={c}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <ellipse cx="46" cy="34" rx="18" ry="12" fill="#fff" opacity="0.25" />
        {eye(36, 36, 5)}
        {eye(56, 36, 5)}
        <path d="M40 48 Q46 54 52 48" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'squid') {
    body = (
      <g>
        <path d="M46 12 L68 56 L24 56 Z" fill={c} />
        <ellipse cx="46" cy="56" rx="22" ry="12" fill={c} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${32 + i * 9} 64 Q${30 + i * 9} 78 ${38 + i * 9} 84`} stroke={d} strokeWidth="5" fill="none" strokeLinecap="round" />
        ))}
        {eye(38, 54, 4.5)}
        {eye(56, 54, 4.5)}
      </g>
    )
  } else if (s === 'shrimp') {
    body = (
      <g>
        <path d="M20 50 Q30 26 58 30 Q80 34 82 54 Q84 72 68 74" fill="none" stroke={c} strokeWidth="18" strokeLinecap="round" />
        <path d="M84 62 L96 54 L96 72 Z" fill={d} />
        <path d="M26 44 L10 34" stroke={d} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 50 L8 46" stroke={d} strokeWidth="2.5" strokeLinecap="round" />
        {eye(28, 44, 3.4)}
      </g>
    )
  } else if (s === 'crab') {
    body = (
      <g>
        <ellipse cx="48" cy="52" rx="26" ry="18" fill={c} />
        <path d="M24 44 Q10 34 16 26 Q26 26 26 38" fill={c} />
        <path d="M72 44 Q86 34 80 26 Q70 26 70 38" fill={c} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M${32 + i * 6} 66 L${26 + i * 6} 78`} stroke={d} strokeWidth="4" strokeLinecap="round" />
            <path d={`M${58 + i * 6} 66 L${64 + i * 6} 78`} stroke={d} strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}
        {eye(40, 42, 4)}
        {eye(58, 42, 4)}
        <path d="M40 58 Q48 64 58 58" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'jelly') {
    body = (
      <g>
        <path d="M20 52 Q22 24 48 24 Q74 24 76 52 Q48 62 20 52" fill={c} opacity="0.85" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${28 + i * 12} 54 Q${24 + i * 12} 70 ${32 + i * 12} 82`} stroke={d} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
        {eye(38, 42, 3.6)}
        {eye(56, 42, 3.6)}
      </g>
    )
  } else if (s === 'shell') {
    body = (
      <g>
        <path d="M18 66 Q48 12 78 66 Z" fill={c} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M48 22 L${26 + i * 15} 66`} stroke={d} strokeWidth="2" opacity="0.5" />
        ))}
        <rect x="16" y="64" width="64" height="8" rx="4" fill={d} />
        {eye(40, 56, 3.4)}
        {eye(56, 56, 3.4)}
      </g>
    )
  } else if (s === 'shark') {
    body = (
      <g>
        <path d="M84 50 L98 36 L94 62 Z" fill={d} />
        <path d="M16 52 Q40 28 84 50 Q40 72 16 52" fill={c} />
        <path d="M46 32 L54 12 L62 38 Z" fill={d} />
        <path d="M42 64 L48 78 L56 62 Z" fill={d} />
        <path d="M16 52 Q28 60 42 58" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" />
        {eye(30, 46, 3.6)}
      </g>
    )
  } else if (s === 'dragon') {
    body = (
      <g>
        <path d="M92 46 L104 32 L100 60 Z" fill={d} />
        <path d="M12 52 Q34 24 56 52 Q78 80 96 48 Q78 92 56 62 Q34 34 12 52" fill={c} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${28 + i * 18} ${40 + (i % 2) * 20} l6 -14 l6 14 z`} fill={d} />
        ))}
        <ellipse cx="20" cy="50" rx="14" ry="11" fill={c} />
        <path d="M12 40 L6 28 L20 36 Z" fill={d} />
        {eye(18, 46, 4)}
        <path d="M8 54 Q14 58 20 55" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )
  } else if (s === 'fancy') {
    body = (
      <g>
        <path d="M76 50 L98 30 L98 70 Z" fill={d} />
        <ellipse cx="46" cy="50" rx="30" ry="22" fill={c} />
        <path d="M46 28 Q56 10 66 26 Q56 30 46 28" fill={d} />
        <path d="M40 72 Q46 88 58 76" fill={d} opacity="0.8" />
        <ellipse cx="46" cy="50" rx="20" ry="13" fill="#fff" opacity="0.25" />
        {eye(30, 44, 4.5)}
        <path d="M20 54 Q26 58 32 55" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="58" y="44" fontSize="14">✨</text>
      </g>
    )
  } else if (s === 'boot') {
    body = (
      <g>
        <path d="M34 16 h22 v40 h20 q10 0 10 12 v10 h-52 z" fill={c} />
        <rect x="32" y="70" width="54" height="8" rx="4" fill={d} />
        <rect x="32" y="16" width="26" height="8" rx="4" fill={d} />
      </g>
    )
  } else if (s === 'can') {
    body = (
      <g>
        <rect x="34" y="24" width="30" height="50" rx="6" fill={c} />
        <ellipse cx="49" cy="24" rx="15" ry="6" fill={d} />
        <rect x="34" y="42" width="30" height="12" fill={d} opacity="0.5" />
      </g>
    )
  } else if (s === 'chest') {
    body = (
      <g>
        <rect x="20" y="42" width="60" height="32" rx="5" fill={c} />
        <path d="M20 44 q30 -26 60 0 z" fill={d} />
        <rect x="42" y="46" width="16" height="18" rx="3" fill={d} />
        <circle cx="50" cy="55" r="3" fill="#fff" />
        <text x="72" y="38" fontSize="16">✨</text>
      </g>
    )
  }

  return (
    <svg viewBox="0 0 110 100" width={size} height={(size * 100) / 110} style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible' }}>
      {body}
    </svg>
  )
}

export function CharArt({ char, size = 120, pose = 'idle' }) {
  const c = char.color
  const d = char.color2
  const isCat = char.body === 'cat'
  const armY = pose === 'pull' ? -8 : 0
  return (
    <svg viewBox="0 0 120 140" width={size} height={(size * 140) / 120} style={{ overflow: 'visible' }}>
      {/* しっぽ */}
      {isCat ? (
        <path d="M86 104 Q108 100 100 76" stroke={d} strokeWidth="9" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M86 104 Q104 108 102 92" stroke={d} strokeWidth="11" fill="none" strokeLinecap="round" />
      )}
      {/* からだ */}
      <ellipse cx="60" cy="104" rx="28" ry="26" fill={c} />
      <ellipse cx="60" cy="110" rx="17" ry="16" fill="#fff" opacity="0.6" />
      {/* あし */}
      <ellipse cx="46" cy="128" rx="10" ry="7" fill={d} />
      <ellipse cx="74" cy="128" rx="10" ry="7" fill={d} />
      {/* うで */}
      <g transform={`translate(0 ${armY})`}>
        <ellipse cx="88" cy="96" rx="9" ry="7" fill={c} />
      </g>
      <ellipse cx="32" cy="100" rx="9" ry="7" fill={c} />
      {/* あたま */}
      {isCat && (
        <>
          <path d="M34 48 L32 22 L54 36 Z" fill={c} />
          <path d="M86 48 L88 22 L66 36 Z" fill={c} />
          <path d="M38 44 L37 30 L50 39 Z" fill="#ffb8c8" />
          <path d="M82 44 L83 30 L70 39 Z" fill="#ffb8c8" />
        </>
      )}
      <ellipse cx="60" cy="58" rx="32" ry="28" fill={c} />
      {!isCat && (
        <>
          <path d="M34 38 Q16 30 18 58 Q22 74 36 62 Z" fill={d} />
          <path d="M86 38 Q104 30 102 58 Q98 74 84 62 Z" fill={d} />
        </>
      )}
      {/* かお */}
      <ellipse cx="60" cy="68" rx="16" ry="12" fill="#fff" opacity="0.75" />
      <circle cx="48" cy="54" r="6" fill="#2a3440" />
      <circle cx="50.5" cy="51.5" r="2.2" fill="#fff" />
      <circle cx="72" cy="54" r="6" fill="#2a3440" />
      <circle cx="74.5" cy="51.5" r="2.2" fill="#fff" />
      <ellipse cx="60" cy="64" rx="5" ry="4" fill={d} />
      <path d="M60 68 Q54 76 48 70" stroke="#2a3440" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M60 68 Q66 76 72 70" stroke="#2a3440" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="66" rx="7" ry="5" fill="#ff9fb0" opacity="0.6" />
      <ellipse cx="82" cy="66" rx="7" ry="5" fill="#ff9fb0" opacity="0.6" />
      {isCat && (
        <>
          <path d="M40 62 L26 58" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M40 66 L26 68" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M80 62 L94 58" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M80 66 L94 68" stroke="#2a3440" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export function SushiArt({ fish, size = 90 }) {
  return (
    <svg viewBox="0 0 100 80" width={size} height={(size * 80) / 100}>
      <ellipse cx="50" cy="62" rx="34" ry="12" fill="#fff8ee" />
      <rect x="16" y="44" width="68" height="20" rx="10" fill="#fffdf7" />
      <path d="M14 44 Q50 22 86 44 Q50 56 14 44" fill={fish.color} />
      <path d="M14 44 Q50 30 86 44" stroke={fish.color2} strokeWidth="3" fill="none" opacity="0.6" />
      <rect x="44" y="40" width="12" height="26" rx="2" fill="#2f4f3f" />
      <circle cx="30" cy="42" r="2" fill="#fff" opacity="0.8" />
      <circle cx="64" cy="40" r="2" fill="#fff" opacity="0.8" />
    </svg>
  )
}
