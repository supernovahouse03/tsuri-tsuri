// かんたんな こうかおん（WebAudio）

let ctx = null
let enabled = true

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setSound(on) {
  enabled = on
}

function tone(freq, dur = 0.12, type = 'sine', vol = 0.15, delay = 0) {
  if (!enabled) return
  const a = ac()
  if (!a) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, a.currentTime + delay)
  g.gain.setValueAtTime(0.0001, a.currentTime + delay)
  g.gain.exponentialRampToValueAtTime(vol, a.currentTime + delay + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + delay + dur)
  o.connect(g).connect(a.destination)
  o.start(a.currentTime + delay)
  o.stop(a.currentTime + delay + dur + 0.02)
}

export const sfx = {
  tap: () => tone(660, 0.08, 'triangle', 0.12),
  cast: () => {
    tone(500, 0.1, 'sine', 0.1)
    tone(760, 0.12, 'sine', 0.1, 0.08)
  },
  splash: () => {
    tone(220, 0.18, 'sawtooth', 0.06)
    tone(140, 0.22, 'sine', 0.08, 0.03)
  },
  nibble: () => tone(880, 0.05, 'square', 0.06),
  hit: () => {
    tone(1046, 0.1, 'square', 0.14)
    tone(1318, 0.14, 'square', 0.14, 0.07)
  },
  reel: () => tone(300 + Math.random() * 180, 0.05, 'square', 0.08),
  catch: () => {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, 'triangle', 0.16, i * 0.09))
  },
  rare: () => {
    ;[659, 784, 988, 1318, 1568].forEach((f, i) => tone(f, 0.22, 'triangle', 0.16, i * 0.11))
  },
  miss: () => {
    tone(300, 0.18, 'sine', 0.1)
    tone(200, 0.24, 'sine', 0.1, 0.12)
  },
  coin: () => {
    tone(988, 0.08, 'square', 0.12)
    tone(1318, 0.12, 'square', 0.12, 0.06)
  },
  eat: () => {
    tone(440, 0.08, 'triangle', 0.12)
    tone(560, 0.08, 'triangle', 0.12, 0.09)
    tone(700, 0.16, 'triangle', 0.13, 0.18)
  },
}
