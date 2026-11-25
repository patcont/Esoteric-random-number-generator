import { createAmbience } from './ambience.js'

const OMENS = [
  'The stars align in your favor.',
  'An unexpected message is on its way.',
  'Trust the path you have already chosen.',
  'Fortune favors the patient today.',
  'A small risk will bring a large reward.',
  'Someone is thinking of you right now.',
  'The moon whispers: not yet, but soon.',
  'Old knowledge will solve a new problem.',
]

const $ = (id) => document.getElementById(id)
const ball = $('ball')
const number = $('number')
const omen = $('omen')
const ask = $('ask')

const random = (max) => {
  // crypto-quality randomness, because the gods deserve it
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

ask.addEventListener('click', () => {
  ask.disabled = true
  ball.classList.remove('reveal')
  ball.classList.add('thinking')
  omen.textContent = 'The mists are swirling…'

  // Spin through numbers before the final answer
  const spin = setInterval(() => (number.textContent = random(100)), 70)

  setTimeout(() => {
    clearInterval(spin)
    number.textContent = random(100)
    omen.textContent = OMENS[random(OMENS.length)]
    ball.classList.remove('thinking')
    ball.classList.add('reveal')
    ask.disabled = false
    ask.textContent = 'Ask again'
  }, 1800)
})

// Optional ambient sound, generated in the browser (no audio files)
const ambience = createAmbience()
const soundBtn = $('sound')
soundBtn.addEventListener('click', () => {
  const on = ambience.toggle()
  soundBtn.textContent = on ? '🔊' : '🔇'
  soundBtn.setAttribute('aria-pressed', String(on))
})

// Twinkling starfield
const stars = document.querySelector('.stars')
for (let i = 0; i < 120; i++) {
  const s = document.createElement('i')
  s.style.left = `${Math.random() * 100}%`
  s.style.top = `${Math.random() * 100}%`
  s.style.animationDelay = `${Math.random() * 4}s`
  s.style.setProperty('--size', `${1 + Math.random() * 2}px`)
  stars.append(s)
}
