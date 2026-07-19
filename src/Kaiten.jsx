import { useEffect, useRef, useState } from 'react'
import { fishById, RARITY_COLOR, RARITY_LABEL } from './data'
import { CharArt, FishArt, PlateArt, SushiArt } from './art'
import { sfx } from './sound'

// おさらの いろ（レアど で かわる = かいてんずし の おさら）
const PLATE_COLOR = ['#e8eef2', '#f2f5f7', '#7fc8e8', '#ffb84f', '#ffd85f']
const PLATE_YEN = ['', '100', '200', '400', '?']

const AMBIENT_POOL = ['aji', 'saba', 'iwashi', 'ika', 'ebi', 'kisu', 'maguro', 'kani']

let seq = 1

export default function Kaiten({ save, setSave, char, onBack }) {
  const [ambient, setAmbient] = useState([])
  const [ordered, setOrdered] = useState(null) // {uid, item, fish}
  const [arrived, setArrived] = useState(false)
  const [eating, setEating] = useState(null)
  const [talk, setTalk] = useState('いらっしゃい！ したの パネルで ちゅうもん してね')
  const timer = useRef(null)

  const sushiKinds = Object.keys(save.sushi).length

  // ながれてくる おさら（ふんいき）
  useEffect(() => {
    const caught = Object.keys(save.zukan).filter((id) => !fishById(id)?.junk)
    const pool = caught.length >= 3 ? caught : AMBIENT_POOL
    const spawn = () => {
      setAmbient((list) => {
        if (list.length > 5) return list
        const id = pool[Math.floor(Math.random() * pool.length)]
        return [...list, { uid: seq++, fishId: id, dur: 13 + Math.random() * 4 }]
      })
    }
    spawn()
    timer.current = setInterval(spawn, 2300)
    return () => clearInterval(timer.current)
  }, [save.zukan])

  function order(item) {
    if (ordered) {
      setTalk('いま にぎってる とちゅう！ もうちょっと まってね')
      return
    }
    const fish = fishById(item.fishId)
    if (fish.junk) {
      sfx.miss()
      setTalk('ごめん！ それは おすしに できないよ〜')
      return
    }
    sfx.tap()
    setSave((s) => ({ ...s, bucket: s.bucket.filter((b) => b.uid !== item.uid) }))
    setOrdered({ uid: seq++, item, fish })
    setArrived(false)
    setTalk(`${fish.name} いっちょう！ レーンで はこぶよ〜`)
  }

  function take() {
    if (!ordered || !arrived) return
    sfx.eat()
    const { fish, item } = ordered
    const smile = 1 + fish.rarity + Math.round(item.size / 40)
    const coins = Math.round(fish.price * 0.35)
    setSave((s) => ({
      ...s,
      sushi: { ...s.sushi, [fish.id]: (s.sushi[fish.id] || 0) + 1 },
      smiles: s.smiles + smile,
      coins: s.coins + coins,
    }))
    setEating({ fish, size: item.size, smile, coins })
    setOrdered(null)
    setArrived(false)
    setTalk('まいど！ つぎは なに にする？')
    setTimeout(() => setEating(null), 2400)
  }

  return (
    <div className="screen kaiten">
      <div className="topbar">
        <button className="mini-btn" onClick={onBack}>
          ← マップ
        </button>
        <h2 className="head sm">🍣 かいてんずし</h2>
        <div className="coins">😄 {save.smiles}</div>
        <div className="coins">🪙 {save.coins}</div>
      </div>

      {/* ---- おみせの なか ---- */}
      <div className="shop-scene">
        <div className="noren">
          <span>つ</span>
          <span>り</span>
          <span>つ</span>
          <span>り</span>
          <span>寿司</span>
        </div>

        <div className="oshinagaki">
          <div className="fuda">本日の おすすめ</div>
          <div className="fuda">大とろ</div>
          <div className="fuda">いくら</div>
        </div>

        <div className="neta-case">
          <div className="case-glass" />
          <div className="case-row">
            {Object.keys(save.sushi)
              .slice(0, 6)
              .map((id) => (
                <SushiArt key={id} fish={fishById(id)} size={46} />
              ))}
            {sushiKinds === 0 && <span className="case-empty">ネタケース（たべると ふえるよ）</span>}
          </div>
        </div>

        <div className="itamae">
          <div className="itamae-body">
            <div className="itamae-hat" />
            <div className="itamae-face">
              <span className="eye l" />
              <span className="eye r" />
              <span className="mouth" />
            </div>
            <div className="itamae-coat" />
          </div>
        </div>

        <div className="talk-bubble">{talk}</div>
      </div>

      {/* ---- レーン ---- */}
      <div className="lane-wrap">
        <div className="lane-rail top" />
        <div className="lane">
          <div className="belt" />
          <div className="pickup" />

          {ambient.map((a) => {
            const f = fishById(a.fishId)
            if (!f) return null
            return (
              <div
                key={a.uid}
                className="plate-run"
                style={{ animationDuration: `${a.dur}s` }}
                onAnimationEnd={() => setAmbient((l) => l.filter((x) => x.uid !== a.uid))}
              >
                <Plate fish={f} />
              </div>
            )
          })}

          {ordered && (
            <div
              key={ordered.uid}
              className={`plate-run ordered ${arrived ? 'stopped' : ''}`}
              onAnimationEnd={() => {
                setArrived(true)
                sfx.coin()
                setTalk('とうちゃく！ 「とる！」を おしてね')
              }}
            >
              <div className="order-flag">ちゅうもん</div>
              <Plate fish={ordered.fish} big />
            </div>
          )}
        </div>
        <div className="lane-rail bottom" />
      </div>

      {/* ---- カウンター ---- */}
      <div className="counter-top">
        <div className="counter-items">
          <div className="cup" title="おちゃ" />
          <div className="soy" />
          <div className="gari" />
          <div className="hashi" />
        </div>
        <div className="counter-char">
          <CharArt char={char} size={92} />
        </div>
        {arrived && (
          <button className="take-btn" onClick={take}>
            🖐 とる！
          </button>
        )}
      </div>

      {/* ---- タッチパネル ---- */}
      <div className="panel">
        <div className="panel-head">
          <b>タッチパネル ちゅうもん</b>
          <small>つった さかな: {save.bucket.length}</small>
        </div>
        {save.bucket.length === 0 ? (
          <p className="empty sm">さかなが ないよ！ つりに いこう 🎣</p>
        ) : (
          <div className="panel-grid">
            {save.bucket.map((it) => {
              const f = fishById(it.fishId)
              return (
                <button key={it.uid} className="panel-item" onClick={() => order(it)} disabled={!!ordered}>
                  <span className="pi-plate" style={{ background: PLATE_COLOR[f.rarity] }} />
                  <FishArt fish={f} size={54} />
                  <b>{f.name}</b>
                  <small>{it.size}cm</small>
                </button>
              )
            })}
          </div>
        )}
        <div className="panel-foot">さかなを タップ → レーンで おすしが とどくよ 🍣</div>
      </div>

      {eating && (
        <div className="modal-wrap">
          <div className="modal eat">
            <SushiArt fish={eating.fish} size={200} />
            <h3 style={{ color: RARITY_COLOR[eating.fish.rarity] }}>
              {eating.fish.name}の おすし
              <small>{RARITY_LABEL[eating.fish.rarity]} / {eating.size}cm</small>
            </h3>
            <p className="eat-line">
              <CharArt char={char} size={80} />
              <span>おいしーい！！ 😋</span>
            </p>
            <p className="gain">
              😄 +{eating.smile} ／ 🪙 +{eating.coins}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Plate({ fish, big }) {
  return (
    <div className="plate">
      <div className="plate-sushi">
        <SushiArt fish={fish} size={big ? 74 : 62} />
      </div>
      <PlateArt color={PLATE_COLOR[fish.rarity]} size={big ? 104 : 88} />
      <span className="plate-yen" style={{ color: fish.rarity >= 3 ? '#a8621f' : '#5f7080' }}>
        {PLATE_YEN[fish.rarity]}えん
      </span>
    </div>
  )
}
