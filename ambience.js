// A low mystic drone plus fire crackles, synthesized with the Web Audio API.
export function createAmbience() {
  let ctx = null
  let master = null
  let crackleTimer = null

  function start() {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0
    master.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2)
    master.connect(ctx.destination)

    // Drone: two slightly detuned low oscillators through a soft filter
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500
    filter.connect(master)
    for (const [freq, type] of [[110, 'sine'], [110.6, 'triangle'], [165, 'sine']]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.value = 0.12
      osc.connect(g).connect(filter)
      osc.start()
    }

    // Crackles: short bursts of filtered noise at random intervals
    const noise = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 200)

    const crackle = () => {
      const src = ctx.createBufferSource()
      const hp = ctx.createBiquadFilter()
      const g = ctx.createGain()
      src.buffer = noise
      hp.type = 'highpass'
      hp.frequency.value = 1500 + Math.random() * 3000
      g.gain.value = 0.2 + Math.random() * 0.5
      src.connect(hp).connect(g).connect(master)
      src.start()
      crackleTimer = setTimeout(crackle, 60 + Math.random() * 600)
    }
    crackle()
  }

  function stop() {
    clearTimeout(crackleTimer)
    ctx?.close()
    ctx = null
  }

  return {
    toggle() {
      if (ctx) stop()
      else start()
      return Boolean(ctx)
    },
  }
}
