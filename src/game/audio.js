let ctx = null
let musicTimer = null
let master = null
const SEQ = [261.63, 329.63, 392.0, 523.25, 587.33, 523.25, 440.0, 392.0]
let step = 0

function ac() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function audioSupported() {
  return typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext)
}

export function startMusic() {
  const a = ac()
  if (!a) return false
  stopMusic()
  master = a.createGain()
  master.gain.value = 0.045
  master.connect(a.destination)
  musicTimer = setInterval(() => {
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = 'square'
    o.frequency.value = SEQ[step++ % SEQ.length]
    g.gain.setValueAtTime(0, a.currentTime)
    g.gain.linearRampToValueAtTime(1, a.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.3)
    o.connect(g); g.connect(master)
    o.start(); o.stop(a.currentTime + 0.32)
  }, 320)
  return true
}

export function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null }
  try { master?.disconnect() } catch {}
  master = null
}

export function sfx(freq = 600, dur = 0.09, type = 'square', vol = 0.07) {
  const a = ac()
  if (!a) return
  try {
    const o = a.createOscillator()
    const g = a.createGain()
    o.type = type; o.frequency.value = freq; g.gain.value = vol
    o.connect(g); g.connect(a.destination)
    o.start(); o.stop(a.currentTime + dur)
  } catch {}
}

export const jumpSfx = () => sfx(520, 0.12)
export const coinSfx = () => { sfx(880, 0.08); setTimeout(() => sfx(1320, 0.12), 70) }
export const hurtSfx = () => sfx(160, 0.2, 'sawtooth')
export const winSfx = () => { [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => sfx(f, 0.14), i * 110)) }

// Birthday song (public/assets/birthday.mp3) — played for the music
// toggle and when the final envelope opens.
let song = null
export function playSong(src = '/assets/birthday.mp3') {
  try {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return false
    if (!song) { song = new Audio(src); song.loop = true; song.volume = 0.85; song.preload = 'auto' }
    song.play().catch(() => {})
    return true
  } catch { return false }
}
export function stopSong() {
  try { song?.pause() } catch {}
}
