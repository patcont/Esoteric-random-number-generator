// Ritual music + crackling fireplace, synthesized with the Web Audio API (no audio files).
// The 2022 version played two MP3s; this recreates the same mood in code.

const SCALE = [0, 3, 5, 7, 10, 12, 15] // minor pentatonic-ish, in semitones
const ROOT = 220 // A3

export function createAmbience() {
  let ctx = null
  let timers = []

  function start() {
    ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2)
    master.connect(ctx.destination)

    // echo for the melody
    const delay = ctx.createDelay()
    delay.delayTime.value = 0.42
    const feedback = ctx.createGain()
    feedback.gain.value = 0.38
    delay.connect(feedback).connect(delay)
    delay.connect(master)

    // drone: low fifth
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    lp.connect(master)
    for (const [f, g] of [[55, 0.16], [82.4, 0.08], [110.3, 0.05]]) {
      const o = ctx.createOscillator()
      const og = ctx.createGain()
      o.type = 'sawtooth'
      o.frequency.value = f
      og.gain.value = g
      o.connect(og).connect(lp)
      o.start()
    }

    // ritual melody: a slow, random walk on the scale
    let idx = 2
    const note = () => {
      idx = Math.max(0, Math.min(SCALE.length - 1, idx + [-2, -1, 1, 2][Math.floor(Math.random() * 4)]))
      const f = ROOT * 2 ** (SCALE[idx] / 12)
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = f
      const now = ctx.currentTime
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.09, now + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)
      o.connect(g)
      g.connect(master)
      g.connect(delay)
      o.start(now)
      o.stop(now + 1.7)
      timers.push(setTimeout(note, [600, 600, 900, 1200][Math.floor(Math.random() * 4)]))
    }
    timers.push(setTimeout(note, 1500))

    // frame drum: soft thump every 2.4 s
    const drum = () => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      const now = ctx.currentTime
      o.frequency.setValueAtTime(110, now)
      o.frequency.exponentialRampToValueAtTime(45, now + 0.25)
      g.gain.setValueAtTime(0.35, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
      o.connect(g).connect(master)
      o.start(now)
      o.stop(now + 0.45)
      timers.push(setTimeout(drum, 2400))
    }
    timers.push(setTimeout(drum, 800))

    // fire crackles: short bursts of filtered noise
    const len = Math.floor(ctx.sampleRate * 0.05)
    const noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 200)
    const crackle = () => {
      const src = ctx.createBufferSource()
      const hp = ctx.createBiquadFilter()
      const g = ctx.createGain()
      src.buffer = noise
      hp.type = 'highpass'
      hp.frequency.value = 1500 + Math.random() * 3000
      g.gain.value = 0.25 + Math.random() * 0.6
      src.connect(hp).connect(g).connect(master)
      src.start()
      timers.push(setTimeout(crackle, 50 + Math.random() * 500))
    }
    crackle()
  }

  function stop() {
    timers.forEach(clearTimeout)
    timers = []
    ctx?.close()
    ctx = null
  }

  return {
    isOn: () => Boolean(ctx),
    toggle() {
      if (ctx) stop()
      else start()
      return Boolean(ctx)
    },
  }
}
