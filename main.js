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
const seer = $('seer')
const number = $('number')
const omen = $('omen')
const ask = $('ask')

const random = (max) => {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

ask.addEventListener('click', () => {
  ask.disabled = true
  seer.classList.add('thinking')
  number.classList.remove('reveal')
  omen.textContent = 'The mists are swirling…'
  const spin = setInterval(() => (number.textContent = random(100)), 70)

  setTimeout(() => {
    clearInterval(spin)
    number.textContent = random(100)
    number.classList.add('reveal')
    seer.classList.remove('thinking')
    omen.textContent = OMENS[random(OMENS.length)]
    ask.disabled = false
  }, 1800)
})

// Sound starts on the first click anywhere, like the 2022 version
const ambience = createAmbience()
const soundBtn = $('sound')
const showSound = (on) => {
  soundBtn.textContent = on ? '🔊' : '🔇'
  soundBtn.setAttribute('aria-pressed', String(on))
}
soundBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  showSound(ambience.toggle())
})
document.addEventListener('click', () => {
  if (!ambience.isOn()) showSound(ambience.toggle())
}, { once: true })
