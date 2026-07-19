import { useEffect, useRef, useState, useCallback } from 'react'
import { AREAS, BAITS, CHARACTERS, FISH, RARITY_COLOR, RARITY_LABEL, RODS, fishById } from './data'
import { CharArt, FishArt, RodArt } from './art'
import Sea from './Sea'
import Kaiten from './Kaiten'
import { rodImage } from './assets'
import { fishInfo } from './fishInfo'
import { sfx, setSound } from './sound'

const SAVE_KEY = 'tsuri-tsuri-save-v1'

const initialSave = () => ({
  charId: null,
  coins: 100,
  rodId: 'rod1',
  baitId: 'none',
  baits: { mushi: 3 },
  zukan: {}, // fishId -> {count, best}
  bucket: [], // {uid, fishId, size}
  sushi: {}, // fishId -> count
  smiles: 0,
  sound: true,
})

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return initialSave()
    return { ...initialSave(), ...JSON.parse(raw) }
  } catch {
    return initialSave()
  }
}

let uidSeq = 1

export default function App() {
  const [save, setSave] = useState(load)
  const [screen, setScreen] = useState(() => (load().charId ? 'map' : 'title'))
  const [areaId, setAreaId] = useState('minato')

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  }, [save])

  useEffect(() => {
    setSound(save.sound)
  }, [save.sound])

  const char = CHARACTERS.find((c) => c.id === save.charId) || CHARACTERS[0]
  const area = AREAS.find((a) => a.id === areaId) || AREAS[0]
  const zukanCount = Object.keys(save.zukan).length

  const upd = useCallback((fn) => setSave((s) => ({ ...s, ...fn(s) })), [])

  return (
    <div className="app">
      {screen === 'title' && <Title onStart={() => setScreen('select')} />}
      {screen === 'select' && (
        <Select
          onPick={(id) => {
            sfx.catch()
            upd(() => ({ charId: id }))
            setScreen('map')
          }}
        />
      )}
      {screen === 'map' && (
        <MapScreen
          save={save}
          char={char}
          zukanCount={zukanCount}
          onGo={(id) => {
            sfx.tap()
            setAreaId(id)
            setScreen('fishing')
          }}
          onShop={() => {
            sfx.tap()
            setScreen('shop')
          }}
          onSushi={() => {
            sfx.tap()
            setScreen('sushi')
          }}
          onZukan={() => {
            sfx.tap()
            setScreen('zukan')
          }}
          onSound={() => upd((s) => ({ sound: !s.sound }))}
          onReset={() => {
            sfx.cast()
            localStorage.removeItem(SAVE_KEY)
            setSave(initialSave())
            setAreaId('minato')
            setScreen('title')
          }}
        />
      )}
      {screen === 'fishing' && <Fishing save={save} setSave={setSave} char={char} area={area} onBack={() => setScreen('map')} />}
      {screen === 'shop' && <Shop save={save} setSave={setSave} onBack={() => setScreen('map')} />}
      {screen === 'sushi' && <Kaiten save={save} setSave={setSave} char={char} onBack={() => setScreen('map')} />}
      {screen === 'zukan' && <Zukan save={save} onBack={() => setScreen('map')} />}
    </div>
  )
}

/* ---------------- タイトル ---------------- */

function Title({ onStart }) {
  const [lanUrl, setLanUrl] = useState(null)

  useEffect(() => {
    // ランチャーが おいた lan.json（おなじ WiFi の URL）
    let alive = true
    fetch('./lan.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.url && !location.href.startsWith(d.url)) setLanUrl(d.url)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="screen title">
      <div className="title-sea">
        <Sea area={AREAS[0]} />
      </div>
      <div className="title-inner">
        <h1 className="logo">
          <span>つ</span>
          <span>り</span>
          <span>つ</span>
          <span>り</span>
          <br />
          <span className="logo-sub">ゲーム</span>
        </h1>
        <p className="title-msg">みなとまちで さかなを つろう！</p>
        <button
          className="big-btn go"
          onClick={() => {
            sfx.cast()
            onStart()
          }}
        >
          ▶ はじめる
        </button>
        {lanUrl && (
          <div className="lan-chip">
            📱 iPad・スマホからは
            <b>{lanUrl}</b>
            <small>おなじ WiFi に つないでね</small>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- キャラえらび ---------------- */

function Select({ onPick }) {
  const [sel, setSel] = useState(null)
  return (
    <div className="screen select">
      <h2 className="head">だれと つりに いく？</h2>
      <div className="char-grid">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            className={`char-card ${sel === c.id ? 'on' : ''}`}
            onClick={() => {
              sfx.tap()
              setSel(c.id)
            }}
          >
            <CharArt char={c} size={110} />
            <div className="char-name">{c.name}</div>
            <div className="char-kind">{c.kind}</div>
            <div className="char-perk">{c.perk}</div>
          </button>
        ))}
      </div>
      <button className="big-btn go" disabled={!sel} onClick={() => sel && onPick(sel)}>
        この こと いく！
      </button>
    </div>
  )
}

/* ---------------- マップ ---------------- */

function MapScreen({ save, char, zukanCount, onGo, onShop, onSushi, onZukan, onSound, onReset }) {
  const [askReset, setAskReset] = useState(false)
  return (
    <div className="screen map">
      <div className="topbar">
        <div className="coins">🪙 {save.coins}</div>
        <div className="coins">😄 {save.smiles}</div>
        <div className="coins">📖 {zukanCount}/{FISH.length}</div>
        <button className="mini-btn" onClick={onSound}>
          {save.sound ? '🔊' : '🔇'}
        </button>
        <button
          className="mini-btn"
          onClick={() => {
            sfx.tap()
            setAskReset(true)
          }}
        >
          🔄
        </button>
      </div>

      <h2 className="head">どこで つる？</h2>

      <div className="map-board">
        <div className="map-sea" />
        <div className="map-land" />
        {AREAS.map((a) => {
          const locked = zukanCount < a.unlock
          return (
            <button
              key={a.id}
              className={`pin ${locked ? 'locked' : ''}`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              onClick={() => !locked && onGo(a.id)}
            >
              <span className="pin-emoji">{locked ? '🔒' : a.emoji}</span>
              <span className="pin-name">{a.name}</span>
              {locked && <span className="pin-lock">さかな {a.unlock}しゅるいで あける</span>}
            </button>
          )
        })}
        <div className="map-char">
          <CharArt char={char} size={78} />
        </div>
      </div>

      <div className="map-actions">
        <button className="big-btn shop" onClick={onShop}>
          🏪 どうぐやさん
        </button>
        <button className="big-btn sushi" onClick={onSushi}>
          🍣 おすしやさん
        </button>
        <button className="big-btn book" onClick={onZukan}>
          📖 ずかん
        </button>
      </div>

      {askReset && (
        <div className="modal-wrap">
          <div className="modal">
            <div style={{ fontSize: 60 }}>🔄</div>
            <h3>さいしょから はじめる？</h3>
            <p className="reset-warn">
              つった さかな・おかね・どうぐは
              <br />
              ぜんぶ きえちゃうよ！
            </p>
            <button className="big-btn shop" onClick={onReset}>
              はい、さいしょから！
            </button>
            <button
              className="big-btn go"
              onClick={() => {
                sfx.tap()
                setAskReset(false)
              }}
            >
              やっぱり やめる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- つり ---------------- */

const PHASE = { READY: 'ready', CAST: 'cast', WAIT: 'wait', HIT: 'hit', REEL: 'reel', RESULT: 'result' }

function pickFish(areaId, baitRare, charRare) {
  const rareMul = baitRare * charRare
  const pool = FISH.filter((f) => f.area === areaId || (f.area === 'all' && Math.random() < 0.18))
  const weights = pool.map((f) => {
    const base = [0, 100, 34, 9, 1.2][f.rarity]
    const boost = f.rarity >= 2 ? Math.pow(rareMul, f.rarity - 1) : 1
    return base * boost * (f.junk ? 0.5 : 1)
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i]
    if (r <= 0) return pool[i]
  }
  return pool[0]
}

function Fishing({ save, setSave, char, area, onBack }) {
  const [phase, setPhase] = useState(PHASE.READY)
  const [msg, setMsg] = useState('ボタンを おして さおを なげよう！')
  const [nibble, setNibble] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [shake, setShake] = useState(false)
  const [pops, setPops] = useState([])

  const target = useRef(null)
  const phaseRef = useRef(phase)
  const reelState = useRef({ p: 0 })
  const reelInfo = useRef(null)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  const timers = useRef([])
  const hitAt = useRef(0)
  const rafId = useRef(0)
  const lastTap = useRef(0)

  const rod = RODS.find((r) => r.id === save.rodId) || RODS[0]
  const hasRodImg = !!rodImage(rod.id)
  const bait = BAITS.find((b) => b.id === save.baitId) || BAITS[0]
  const baitCount = save.baits[bait.id] ?? (bait.id === 'none' ? Infinity : 0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    cancelAnimationFrame(rafId.current)
  }
  useEffect(() => () => clearTimers(), [])

  const addPop = (text) => {
    const id = uidSeq++
    setPops((p) => [...p, { id, text }])
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1100)
  }

  const perkQuick = char.perkKey === 'quick' ? 0.65 : 1
  const perkWindow = char.perkKey === 'window' ? 1.55 : 1
  const perkPower = char.perkKey === 'power' ? 1.35 : 1
  const perkRare = char.perkKey === 'rare' ? 1.5 : 1

  function cast() {
    if (bait.id !== 'none' && baitCount <= 0) {
      setMsg('えさが ないよ！ どうぐやさんで かおう')
      return
    }
    sfx.cast()
    setPhase(PHASE.CAST)
    setResult(null)
    setProgress(0)
    setMsg('とんでけー！')
    timers.current.push(
      setTimeout(() => {
        sfx.splash()
        setPhase(PHASE.WAIT)
        setMsg('しずかに まとう… ピクピク…')
        scheduleWait()
      }, 700),
    )
  }

  function scheduleWait() {
    const f = pickFish(area.id, bait.rare, perkRare)
    target.current = f
    const base = 1600 + Math.random() * 4200
    const delay = base * bait.speed * perkQuick
    // とちゅうの フェイク ピクピク
    const fakes = 1 + Math.floor(Math.random() * 3)
    for (let i = 1; i <= fakes; i++) {
      timers.current.push(
        setTimeout(() => {
          sfx.nibble()
          setNibble(true)
          setTimeout(() => setNibble(false), 260)
        }, (delay * i) / (fakes + 1)),
      )
    }
    timers.current.push(setTimeout(() => startHit(), delay))
  }

  function startHit() {
    sfx.hit()
    setPhase(PHASE.HIT)
    setMsg('ヒット！！ いま おして！')
    hitAt.current = performance.now()
    const win = 950 * rod.window * perkWindow
    timers.current.push(
      setTimeout(() => {
        if (phaseRef.current !== PHASE.HIT) return
        sfx.miss()
        setMsg('あぁ… にげられた〜')
        setResult({ kind: 'miss' })
        setPhase(PHASE.RESULT)
      }, win),
    )
  }

  function startReel() {
    clearTimers()
    const f = target.current
    const size = Math.round(f.min + Math.random() * (f.max - f.min))
    const sizeRatio = (size - f.min) / Math.max(1, f.max - f.min)
    const resist = (0.5 + f.rarity * 0.26 + sizeRatio * 0.4) * area.diff
    setPhase(PHASE.REEL)
    setMsg('れんだ！ れんだ！ ひっぱれー！')
    reelInfo.current = { fish: f, size }
    let last = performance.now()
    const limit = performance.now() + 12000
    const tickRef = { p: 15 }
    reelState.current = tickRef

    const loop = (now) => {
      const dt = (now - last) / 1000
      last = now
      tickRef.p -= resist * 10 * dt
      if (tickRef.p <= 0) {
        tickRef.p = 0
        sfx.miss()
        setProgress(0)
        setMsg('にげられちゃった〜')
        setResult({ kind: 'miss' })
        setPhase(PHASE.RESULT)
        return
      }
      if (tickRef.p >= 100) {
        finishCatch(f, size)
        return
      }
      if (now > limit) {
        sfx.miss()
        setMsg('うで が つかれた〜 にげられた！')
        setResult({ kind: 'miss' })
        setPhase(PHASE.RESULT)
        return
      }
      setProgress(tickRef.p)
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
  }

  function tapReel() {
    const now = performance.now()
    if (now - lastTap.current < 45) return
    lastTap.current = now
    const gain = 6.5 * rod.power * perkPower
    reelState.current.p = Math.min(100, reelState.current.p + gain)
    setProgress(reelState.current.p)
    if (reelState.current.p >= 100) {
      const info = reelInfo.current
      if (info) finishCatch(info.fish, info.size)
      return
    }
    sfx.reel()
    setShake(true)
    setTimeout(() => setShake(false), 70)
    addPop('グイッ')
  }

  function finishCatch(f, size) {
    if (!reelInfo.current) return // 2じゅうで つれないように
    reelInfo.current = null
    cancelAnimationFrame(rafId.current)
    if (f.rarity >= 3) sfx.rare()
    else sfx.catch()
    const coins = Math.round(f.price * (0.7 + (size / f.max) * 0.6))
    setSave((s) => {
      const z = { ...s.zukan }
      const prev = z[f.id]
      z[f.id] = { count: (prev?.count || 0) + 1, best: Math.max(prev?.best || 0, size) }
      const baits = { ...s.baits }
      if (bait.id !== 'none') baits[bait.id] = Math.max(0, (baits[bait.id] || 0) - 1)
      const bucket = [...s.bucket, { uid: uidSeq++, fishId: f.id, size }].slice(-24)
      return { ...s, zukan: z, baits, bucket, coins: s.coins + coins }
    })
    setResult({ kind: 'catch', fish: f, size, coins, isNew: !save.zukan[f.id] })
    setPhase(PHASE.RESULT)
    setMsg('やったー！！')
  }

  function onMainButton() {
    if (phase === PHASE.READY || phase === PHASE.RESULT) {
      cast()
    } else if (phase === PHASE.CAST) {
      // まだ
    } else if (phase === PHASE.WAIT) {
      clearTimers()
      sfx.miss()
      setMsg('はやすぎ〜！ もういちど')
      setResult({ kind: 'early' })
      setPhase(PHASE.RESULT)
    } else if (phase === PHASE.HIT) {
      startReel()
    } else if (phase === PHASE.REEL) {
      tapReel()
    }
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onMainButton()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const btnLabel =
    phase === PHASE.READY || phase === PHASE.RESULT
      ? '🎣 なげる！'
      : phase === PHASE.CAST
        ? '…'
        : phase === PHASE.WAIT
          ? 'まって…'
          : phase === PHASE.HIT
            ? '⚡️ いま！おす！'
            : 'れんだ！！'

  const btnClass =
    phase === PHASE.HIT ? 'hitbtn' : phase === PHASE.REEL ? 'reelbtn' : phase === PHASE.WAIT ? 'waitbtn' : 'castbtn'

  // うき の いち
  const floatY = phase === PHASE.CAST ? -50 : phase === PHASE.HIT ? 14 : 0

  return (
    <div className={`screen fishing ${shake ? 'shake' : ''} ${hasRodImg ? 'has-rod-img' : ''}`}>
      <Sea area={area}>
        <div className="fishing-layer">
          <div className="dock">
            <div className="dock-top" />
            <div className="piling p1" />
            <div className="piling p2" />
          </div>

          <div className={`angler ${phase === PHASE.REEL ? 'pulling' : ''}`}>
            <CharArt char={char} size={130} pose={phase === PHASE.REEL ? 'pull' : 'idle'} rod={!hasRodImg} />
            {hasRodImg && <RodArt rodId={rod.id} width={190} />}
          </div>

          <svg className="line-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#ffffffcc" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className={`float ${phase === PHASE.WAIT && nibble ? 'nib' : ''} ${phase === PHASE.HIT ? 'dive' : ''}`} style={{ transform: `translate(-50%,-50%) translateY(${floatY}px)` }}>
            <div className="ball" />
          </div>

          {phase === PHASE.REEL && target.current && (
            <div className="hooked" style={{ top: `${64 - progress * 0.26}%` }}>
              <FishArt fish={target.current} size={70} />
            </div>
          )}

          {phase === PHASE.HIT && <div className="hit-banner">ヒット！</div>}

          {pops.map((p) => (
            <div key={p.id} className="pop" style={{ left: `${35 + Math.random() * 30}%` }}>
              {p.text}
            </div>
          ))}
        </div>
      </Sea>

      <div className="fish-ui">
        <div className="fish-top">
          <button className="mini-btn" onClick={onBack}>
            ← マップ
          </button>
          <div className="place">{area.name}</div>
          <div className="coins">🪙 {save.coins}</div>
        </div>

        <div className="msg-box">{msg}</div>

        {phase === PHASE.REEL && (
          <div className="gauge">
            <div className="gauge-fill" style={{ width: `${progress}%` }} />
            <span className="gauge-label">ひっぱれ！ {Math.round(progress)}%</span>
          </div>
        )}

        <div className="bait-row">
          <span className="bait-label">えさ:</span>
          {BAITS.filter((b) => b.id === 'none' || (save.baits[b.id] || 0) > 0).map((b) => (
            <button
              key={b.id}
              className={`bait-chip ${save.baitId === b.id ? 'on' : ''}`}
              onClick={() => {
                sfx.tap()
                setSave((s) => ({ ...s, baitId: b.id }))
              }}
            >
              {b.name}
              {b.id !== 'none' && <em>×{save.baits[b.id] || 0}</em>}
            </button>
          ))}
        </div>

        <button className={`big-btn ${btnClass}`} onPointerDown={onMainButton}>
          {btnLabel}
        </button>
      </div>

      {phase === PHASE.RESULT && result?.kind === 'catch' && (
        <div className="modal-wrap">
          <div className="modal catch">
            {result.isNew && <div className="new-tag">はじめて つった！</div>}
            <div className="modal-fish">
              <FishArt fish={result.fish} size={190} />
            </div>
            <h3 style={{ color: RARITY_COLOR[result.fish.rarity] }}>
              {result.fish.name}
              <small>{RARITY_LABEL[result.fish.rarity]}</small>
            </h3>
            <p className="size">{result.size} cm</p>
            <p className="gain">🪙 +{result.coins}</p>
            <button
              className="big-btn go"
              onClick={() => {
                sfx.tap()
                setPhase(PHASE.READY)
                setResult(null)
                setMsg('つぎも つるぞ！')
              }}
            >
              つぎ！
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- ショップ ---------------- */

function Shop({ save, setSave, onBack }) {
  const [tab, setTab] = useState('rod')
  const rodIdx = RODS.findIndex((r) => r.id === save.rodId)

  const buyRod = (r, i) => {
    if (i <= rodIdx) return
    if (save.coins < r.price) {
      sfx.miss()
      return
    }
    sfx.coin()
    setSave((s) => ({ ...s, coins: s.coins - r.price, rodId: r.id }))
  }

  const buyBait = (b, n) => {
    const cost = b.price * n
    if (save.coins < cost) {
      sfx.miss()
      return
    }
    sfx.coin()
    setSave((s) => ({ ...s, coins: s.coins - cost, baits: { ...s.baits, [b.id]: (s.baits[b.id] || 0) + n } }))
  }

  const sellAll = () => {
    if (!save.bucket.length) return
    sfx.coin()
    setSave((s) => {
      const total = s.bucket.reduce((sum, it) => {
        const f = fishById(it.fishId)
        return sum + Math.round(f.price * (0.5 + (it.size / f.max) * 0.4))
      }, 0)
      return { ...s, coins: s.coins + total, bucket: [] }
    })
  }

  return (
    <div className="screen shop-screen">
      <div className="topbar">
        <button className="mini-btn" onClick={onBack}>
          ← マップ
        </button>
        <h2 className="head sm">🏪 どうぐやさん</h2>
        <div className="coins">🪙 {save.coins}</div>
      </div>

      <div className="tabs">
        <button className={tab === 'rod' ? 'on' : ''} onClick={() => { sfx.tap(); setTab('rod') }}>
          つりざお
        </button>
        <button className={tab === 'bait' ? 'on' : ''} onClick={() => { sfx.tap(); setTab('bait') }}>
          えさ
        </button>
        <button className={tab === 'sell' ? 'on' : ''} onClick={() => { sfx.tap(); setTab('sell') }}>
          さかなを うる
        </button>
      </div>

      <div className="shop-list">
        {tab === 'rod' &&
          RODS.map((r, i) => {
            const owned = i <= rodIdx
            return (
              <div key={r.id} className={`shop-item ${owned ? 'owned' : ''}`}>
                <div className="item-icon">{rodImage(r.id) ? <img src={rodImage(r.id)} alt="" width="104" /> : '🎣'}</div>
                <div className="item-info">
                  <b>{r.label}</b>
                  <small>{r.desc}</small>
                  <small>ちから ×{r.power} / タイミング ×{r.window}</small>
                </div>
                {owned ? (
                  <span className="owned-tag">{i === rodIdx ? 'つかってる' : 'もってる'}</span>
                ) : (
                  <button className="buy-btn" disabled={save.coins < r.price} onClick={() => buyRod(r, i)}>
                    🪙 {r.price}
                  </button>
                )}
              </div>
            )
          })}

        {tab === 'bait' &&
          BAITS.filter((b) => b.id !== 'none').map((b) => (
            <div key={b.id} className="shop-item">
              <div className="item-icon">🪱</div>
              <div className="item-info">
                <b>{b.name}</b>
                <small>{b.desc}</small>
                <small>もってる: {save.baits[b.id] || 0}こ</small>
              </div>
              <div className="buy-col">
                <button className="buy-btn" disabled={save.coins < b.price} onClick={() => buyBait(b, 1)}>
                  1こ 🪙{b.price}
                </button>
                <button className="buy-btn sm" disabled={save.coins < b.price * 5} onClick={() => buyBait(b, 5)}>
                  5こ 🪙{b.price * 5}
                </button>
              </div>
            </div>
          ))}

        {tab === 'sell' && (
          <>
            {save.bucket.length === 0 && <p className="empty">クーラーボックスは からっぽ。さかなを つってこよう！</p>}
            <div className="bucket-grid">
              {save.bucket.map((it) => {
                const f = fishById(it.fishId)
                return (
                  <div key={it.uid} className="bucket-card">
                    <FishArt fish={f} size={64} />
                    <b>{f.name}</b>
                    <small>{it.size}cm</small>
                  </div>
                )
              })}
            </div>
            {save.bucket.length > 0 && (
              <button className="big-btn go" onClick={sellAll}>
                ぜんぶ うる（{save.bucket.length}ひき）
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ---------------- ずかん ---------------- */

function Zukan({ save, onBack }) {
  const [sel, setSel] = useState(null)
  const got = (f) => save.zukan[f.id]

  if (sel) {
    const f = FISH.find((x) => x.id === sel)
    return <FishPage fish={f} rec={save.zukan[sel]} onBack={() => setSel(null)} />
  }

  return (
    <div className="screen zukan-screen">
      <div className="topbar">
        <button className="mini-btn" onClick={onBack}>
          ← マップ
        </button>
        <h2 className="head sm">📖 さかな ずかん</h2>
        <div className="coins">
          {Object.keys(save.zukan).length}/{FISH.length}
        </div>
      </div>
      <p className="sub-line">つった さかなを タップすると くわしく みられるよ</p>
      <div className="zukan-grid">
        {FISH.map((f) => {
          const g = got(f)
          return (
            <button
              key={f.id}
              className={`z-card ${g ? '' : 'unknown'}`}
              style={g ? { borderColor: RARITY_COLOR[f.rarity] } : undefined}
              disabled={!g}
              onClick={() => {
                sfx.tap()
                setSel(f.id)
              }}
            >
              {g ? (
                <>
                  <FishArt fish={f} size={78} />
                  <b>{f.name}</b>
                  <small style={{ color: RARITY_COLOR[f.rarity] }}>{RARITY_LABEL[f.rarity]}</small>
                  <small>さいだい {g.best}cm</small>
                  <small>×{g.count}</small>
                </>
              ) : (
                <>
                  <div className="qmark">？</div>
                  <b>？？？</b>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- さかな 1ぴき の ページ ---------------- */

function FishPage({ fish, rec, onBack }) {
  const info = fishInfo(fish.id)
  const idx = FISH.findIndex((f) => f.id === fish.id)
  return (
    <div className="screen fish-page">
      <div className="topbar">
        <button className="mini-btn" onClick={onBack}>
          ← ずかん
        </button>
        <h2 className="head sm">No.{String(idx + 1).padStart(2, '0')}</h2>
        <div className="coins" style={{ color: RARITY_COLOR[fish.rarity] }}>
          {RARITY_LABEL[fish.rarity]}
        </div>
      </div>

      <div className="fp-scroll">
        <div className="fp-hero" style={{ borderColor: RARITY_COLOR[fish.rarity] }}>
          <FishArt fish={fish} size={280} />
        </div>

        <h3 className="fp-name">{fish.name}</h3>
        {info && <p className="fp-wa">{info.wa}</p>}

        <div className="fp-rec">
          <div>
            <span>つった かず</span>
            <b>{rec?.count ?? 0}ひき</b>
          </div>
          <div>
            <span>さいだい</span>
            <b>{rec?.best ?? '-'}cm</b>
          </div>
          <div>
            <span>ねだん</span>
            <b>🪙{fish.price}</b>
          </div>
        </div>

        {info ? (
          <>
            <div className="fp-table">
              <div>
                <span>なかま</span>
                <b>{info.group}</b>
              </div>
              <div>
                <span>おおきさ</span>
                <b>{info.size}</b>
              </div>
              <div>
                <span>すみか</span>
                <b>{info.where}</b>
              </div>
              <div>
                <span>たべもの</span>
                <b>{info.food}</b>
              </div>
              <div>
                <span>しゅん</span>
                <b>{info.season}</b>
              </div>
            </div>

            <h4 className="fp-h">💡 しっていると すごい！</h4>
            <ul className="fp-facts">
              {info.facts.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="empty">じょうほうを しらべちゅう…</p>
        )}
      </div>
    </div>
  )
}
