import React, { useEffect, useState } from 'react'
import { LEVELS } from './game/levels'
import { CARDS, PHOTOS, COUPONS, LOVE_REASONS } from './game/content'
import { startMusic, stopMusic, audioSupported, winSfx, sfx, playSong, stopSong } from './game/audio'
import Platformer from './components/Platformer'

const SAVE_KEY = 'super-chotu-save'
const EMPTY = { unlocked: 0, hearts: 0, done: [], hugs: 0 }

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}
    return { ...EMPTY, ...raw, done: Array.isArray(raw.done) ? raw.done : [] }
  } catch { return { ...EMPTY } }
}

async function enterFullscreen() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
      return true
    }
  } catch { /* iOS / blocked — CSS fallback covers us */ }
  return !!document.fullscreenElement
}

async function exitFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
  } catch {}
}

/* ---------- Photo with graceful fallback ---------- */
function LevelPhoto({ level, big }) {
  const [failed, setFailed] = useState(false)
  const src = PHOTOS[level]
  if (failed || !src) {
    return (
      <div className={`photo-ph ${big ? 'big' : ''}`} aria-label="photo placeholder">
        <span className="ph-heart">♡</span>
        <p><strong>Our photo goes here</strong></p>
        <p className="tiny muted">Add <code>public/assets/level-{level + 1}.jpg</code> + rebuild — it appears like magic.</p>
      </div>
    )
  }
  return (
    <div className={`photo-frame ${big ? 'big' : ''}`}>
      <span className="photo-tape" aria-hidden="true" />
      <img src={src} alt={`Memory ${level + 1} for Chotu`} onError={() => setFailed(true)} loading="lazy" />
      <span className="photo-cap">♥ LEVEL {level + 1} · for Chotu</span>
    </div>
  )
}

/* ---------- Sealed envelope → open → love letter ---------- */
function Envelope({ level, stats, onNext, onMap, isLast }) {
  const card = CARDS[level]
  const coupon = COUPONS[level]
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const songTimer = React.useRef(null)

  // don't let a pending song outlive the envelope screen
  React.useEffect(() => () => { try { clearTimeout(songTimer.current) } catch {} }, [])

  const pop = () => {
    if (open) return
    sfx(880); setTimeout(() => sfx(1320, 0.14), 140)
    // final letter: song fades in 10s after the tap 🎂
    if (isLast) songTimer.current = setTimeout(() => playSong(), 10000)
    setOpen(true)
    try { navigator.vibrate?.([30, 40, 30]) } catch {}
    setTimeout(() => { setShown(true); winSfx() }, 950)
  }

  return (
    <main className="wrap env-wrap">
      <p className="kick ok center">★ LEVEL {level + 1} CLEAR — {stats.coins}/{stats.total} hearts · {stats.deaths} falls · {stats.time}s ★</p>

      {!shown ? (
        <div className="env-stage">
          <p className="env-hint">✉ A sealed envelope for you, Chotu… tap to open</p>
          <button
            className={`envelope ${open ? 'opening' : ''}`}
            onClick={pop}
            aria-label={`Open love letter for level ${level + 1}`}
            autoFocus
          >
            <span className="env-back" />
            <span className="env-letter-mini"><i />{card.file}</span>
            <span className="env-pocket" />
            <span className="env-flap" />
            <span className="env-seal">♥</span>
          </button>
          <p className="tiny muted center">{open ? 'opening…' : `FROM: Bujik · TO: Chotu · LVL ${level + 1}/7`}</p>
        </div>
      ) : (
        <div className="pop letter" role="dialog" aria-modal="true" aria-label={`${card.file} love letter`}>
          <p className="kick">💌 {card.file} · just opened</p>
          <h2>{card.title}</h2>
          <p className="body">{card.body}</p>
          {card.extras.map((e) => <p key={e} className="extra">▸ {e}</p>)}

          <LevelPhoto level={level} big />

          <div className="coupon" role="note" aria-label="coupon unlocked">
            <span className="coupon-icon">{coupon.icon}</span>
            <div>
              <strong>COUPON UNLOCKED: {coupon.title}</strong>
              <p className="tiny">{coupon.desc}</p>
            </div>
          </div>

          <div className="row">
            <button className="btn ghost" onClick={onMap}>WORLD MAP</button>
            {!isLast && <button className="btn" onClick={onNext} autoFocus>NEXT LEVEL ▶</button>}
            {isLast && <button className="btn" onClick={onMap} autoFocus>★ MEMORY ALBUM ★</button>}
          </div>
          {isLast && <p className="tiny center">🎵 keep this open… a song is on its way (10s) · Chotu, you finished all 7. Replay any level from the map anytime. — Bujik ♡</p>}
        </div>
      )}
    </main>
  )
}

/* ---------- Memory album on the map ---------- */
function Album({ done }) {
  return (
    <section className="album" aria-label="memory album">
      <h2 className="album-title">📸 MEMORY ALBUM · {done.length}/7</h2>
      <p className="tiny muted">Every flag = one envelope + one photo + one coupon. Collected ones stay here forever.</p>
      <div className="album-grid">
        {LEVELS.map((lv, i) => {
          const got = done.includes(i)
          return (
            <div key={lv.id} className={`slot ${got ? 'got' : 'locked'}`}>
              {got ? (
                <>
                  <LevelPhoto level={i} />
                  <small>♥ {CARDS[i].file}</small>
                </>
              ) : (
                <>
                  <div className="slot-lock">🔒</div>
                  <small>Clear LVL {i + 1}</small>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [save, setSave] = useState(load)
  const [playing, setPlaying] = useState(null)
  const [cleared, setCleared] = useState(null) // {level, stats}
  const [music, setMusic] = useState(false)
  const [toast, setToast] = useState('')
  const [confetti, setConfetti] = useState(0)
  const [fs, setFs] = useState(false)
  const [reason, setReason] = useState('')
  const [hugPop, setHugPop] = useState(0)

  // track real browser fullscreen (desktop + android chrome)
  useEffect(() => {
    const fn = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', fn)
    return () => document.removeEventListener('fullscreenchange', fn)
  }, [])

  const toggleFS = async () => {
    try {
      if (!document.fullscreenElement) await enterFullscreen()
      else await exitFullscreen()
      setFs(!!document.fullscreenElement)
    } catch { setToast('Fullscreen blocked — rotate + brightness up instead 🌙') }
  }

  // keep screen awake for midnight mobile play
  useEffect(() => {
    let lock = null
    if (playing !== null) {
      try { navigator.wakeLock?.request('screen').then((l) => { lock = l }).catch(() => {}) } catch {}
    }
    return () => { try { lock?.release() } catch {} }
  }, [playing])

  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)) } catch {}
  }, [save])

  useEffect(() => {
    if (!music) { stopMusic(); stopSong(); return }
    // your birthday song on loop; chiptune fallback if it can't play
    if (!playSong() && (!audioSupported() || !startMusic())) {
      setMusic(false); setToast('Audio not supported — game still full ♥')
    }
    return () => { stopMusic(); stopSong() }
  }, [music])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // auto fullscreen the moment a level starts (must stay in the tap gesture)
  const startLevel = async (i) => {
    if (i > save.unlocked) return
    sfx(700)
    setCleared(null)
    setPlaying(i)
    setReason('')
    await enterFullscreen()
    setFs(!!document.fullscreenElement)
    // best-effort landscape hint on phones (never blocks play)
    try { await screen.orientation?.lock?.('landscape')?.catch?.(() => {}) } catch {}
  }

  const onComplete = (stats) => {
    winSfx()
    try { navigator.vibrate?.(60) } catch {}
    const lvl = playing
    setSave((s) => ({
      ...s,
      unlocked: Math.max(s.unlocked, Math.min(LEVELS.length - 1, lvl + 1)),
      hearts: s.hearts + stats.coins,
      done: s.done.includes(lvl) ? s.done : [...s.done, lvl],
    }))
    if (lvl === LEVELS.length - 1) setConfetti((c) => c + 1)
    setToast(stats.coins === stats.total ? 'PERFECT — all hearts! Envelope incoming ✉' : `Level clear +${stats.coins} hearts ✉`)
    setCleared({ level: lvl, stats })
  }

  const quitToMap = async () => {
    setPlaying(null); setCleared(null)
    try { screen.orientation?.unlock?.() } catch {}
  }

  const hug = () => {
    sfx(990, 0.12, 'sine', 0.09)
    setSave((s) => ({ ...s, hugs: (s.hugs || 0) + 1 }))
    setHugPop((c) => c + 1)
    try { navigator.vibrate?.(25) } catch {}
  }

  const surpriseReason = () => {
    sfx(660)
    setReason(LOVE_REASONS[Math.floor(Math.random() * LOVE_REASONS.length)])
  }

  if (!booted) {
    return (
      <main className="boot">
        <div className="crt" />
        <div className="boot-box">
          <p className="kick">BUJIK SYSTEMS PRESENTS</p>
          <h1 className="title">SUPER<br />CHOTU BROS</h1>
          <p className="sub">A tiny Mario-style birthday game. 7 levels. One favourite person.</p>
          <div className="rules">
            <p>▶ Run right, jump gaps, dodge pink spikes, grab hearts, touch the flag.</p>
            <p>✉ Each flag seals an <strong>envelope</strong> — open it for a love letter + photo + coupon.</p>
            <p>📱 Buttons sit <strong>on the game screen</strong> · level auto-fills the whole screen (mobile + desktop).</p>
            <p>⌨ Arrows / A D + Space · ∞ lives, deaths just respawn</p>
          </div>
          <button className="btn big" onClick={() => { sfx(880); setBooted(true) }} autoFocus>▶ PRESS START</button>
        </div>
      </main>
    )
  }

  // ---- PLAYING: immersive fullscreen stage ----
  if (playing !== null && !cleared) {
    const lv = LEVELS[playing]
    return (
      <div className="os playing">
        <div className="crt" />
        <header className="top slim">
          <span><strong>LVL {playing + 1}/7</strong> · {lv.name}</span>
          <span className="hgroup">
            <span className="pill">♥ {save.hearts}</span>
            <button className="pill btnp" onClick={toggleFS} aria-label="toggle fullscreen">{fs ? '⛶ EXIT' : '⛶ FULL'}</button>
          </span>
        </header>
        <main className="wrap play-wrap">
          <Platformer level={lv} onComplete={onComplete} onQuit={quitToMap} isFullscreen={fs} onFullscreen={toggleFS} />
        </main>
      </div>
    )
  }

  // ---- LEVEL CLEAR: envelope opening ----
  if (cleared) {
    const last = cleared.level === LEVELS.length - 1
    return (
      <div className="os">
        <div className="crt" />
        {confetti > 0 && last && <div className="confetti">{Array.from({ length: 80 }, (_, i) => <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.1}s`, background: ['#B8FF72', '#FF8299', '#FFD779', '#F0F5DF'][i % 4] }} />)}</div>}
        {toast && <div className="toast" role="status">{toast}</div>}
        <Envelope
          level={cleared.level}
          stats={cleared.stats}
          isLast={last}
          onMap={quitToMap}
          onNext={() => startLevel(cleared.level + 1)}
        />
      </div>
    )
  }

  // ---- WORLD MAP + album + boyfriend extras ----
  const totalHearts = LEVELS.reduce((a, l) => a + l.coins.length, 0)
  return (
    <div className="os">
      <div className="crt" />
      <header className="top">
        <span className="brand"><i /> SUPER CHOTU BROS</span>
        <span className="hgroup">
          <span className="pill">♥ {save.hearts}</span>
          <button className="pill btnp" onClick={() => setMusic((m) => !m)} aria-pressed={music}>{music ? '♪ ON' : '♪ OFF'}</button>
          <button className="pill btnp" onClick={toggleFS} aria-label="toggle fullscreen">{fs ? '⛶ EXIT' : '⛶ FULL'}</button>
          <button className="pill btnp" onClick={() => { setSave({ ...EMPTY }); setToast('Progress reset — fresh start ♥') }}>RESET</button>
        </span>
      </header>
      <main className="wrap">
        <h1 className="map-title">Choose a level, Chotu.</h1>
        <p className="muted">Finish a run → sealed envelope → love letter + photo + coupon. Full-screen + on-screen buttons in every level.</p>

        <div className="love-bar" aria-label="love meter">
          <div className="love-fill" style={{ width: `${Math.min(100, Math.round((save.hearts / Math.max(1, totalHearts)) * 100))}%` }} />
          <span>LOVE METER · {save.hearts}/{totalHearts} hearts</span>
        </div>

        <div className="map">
          {LEVELS.map((lv, i) => {
            const locked = i > save.unlocked
            const done = save.done.includes(i)
            return (
              <button key={lv.id} className={`node ${locked ? 'locked' : ''} ${done ? 'done' : ''}`} disabled={locked} onClick={() => startLevel(i)} aria-label={`${lv.name} ${locked ? 'locked' : ''}`}>
                <span className="n">{done ? '♥' : i + 1}</span>
                <strong>{lv.name}</strong>
                <small>{lv.sub}</small>
                <small>{locked ? '🔒 clear previous' : done ? '✔ cleared — replay' : '▶ play · ✉ inside'}</small>
              </button>
            )
          })}
        </div>

        <div className="bf-row">
          <button className="btn hug" onClick={hug}>🤗 HUG CHOTU{save.hugs ? ` ×${save.hugs}` : ''}</button>
          <button className="btn ghost" onClick={surpriseReason}>💭 WHY I LOVE YOU</button>
        </div>
        {hugPop > 0 && <div className="hug-hearts" key={hugPop}>{Array.from({ length: 8 }, (_, i) => <span key={i} style={{ left: `${8 + i * 11}%`, animationDelay: `${i * 0.06}s` }}>♥</span>)}</div>}
        {reason && <p className="reason" role="status">💌 {reason}</p>}

        <Album done={save.done} />

        <section className="album coupons" aria-label="coupons">
          <h2 className="album-title">🎟 COUPONS · {save.done.length}/7 unlocked</h2>
          <div className="coupon-list">
            {COUPONS.map((c, i) => {
              const got = save.done.includes(i)
              return (
                <div key={c.title} className={`coupon mini ${got ? '' : 'locked'}`}>
                  <span className="coupon-icon">{got ? c.icon : '🔒'}</span>
                  <div><strong>{got ? c.title : `LVL ${i + 1} coupon`}</strong>
                  {got && <p className="tiny">{c.desc}</p>}</div>
                </div>
              )
            })}
          </div>
        </section>

        <p className="tiny muted center">Progress auto-saves in this browser · levels auto-fullscreen · photos: drop <code>level-1.jpg…level-7.jpg</code> in <code>public/assets/</code></p>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
