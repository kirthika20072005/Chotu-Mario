import React, { useEffect, useRef, useState } from 'react'
import { jumpSfx, coinSfx, hurtSfx, sfx } from '../game/audio'

const W = 960, H = 540, GRAV = 0.62, SPEED = 3.8, JUMP = -12.8

const SKIES = {
  sunset:   { top: '#1b2a4a', mid: '#c65b7c', low: '#FFD779', hill: '#3a2b4a', ground: '#17251A', star: 0.25, sun: '#FFD779', sunY: 330 },
  blue:     { top: '#123a63', mid: '#2f7fae', low: '#9fd8c9', hill: '#1d5a4a', ground: '#17251A', star: 0, sun: '#FFF3B0', sunY: 110 },
  night:    { top: '#05070f', mid: '#0d1626', low: '#1b2a4a', hill: '#101c2e', ground: '#0d1510', star: 1, sun: '#F0F5DF', sunY: 110, moon: true },
  dusk:     { top: '#241a3a', mid: '#8a4a6e', low: '#e08a5a', hill: '#2c2340', ground: '#17251A', star: 0.4, sun: '#FF9E6e', sunY: 360 },
  cave:     { top: '#030507', mid: '#0a0f16', low: '#14202c', hill: '#0d141d', ground: '#0a0f0c', star: 0.15, sun: null, lantern: true },
  dawn:     { top: '#2a3a63', mid: '#e08a7e', low: '#FFE3A3', hill: '#33455a', ground: '#17251A', star: 0.3, sun: '#FFF3B0', sunY: 380 },
  midnight: { top: '#02040a', mid: '#0a1030', low: '#1b2a6e', hill: '#0d1430', ground: '#0d1510', star: 1, sun: '#F0F5DF', sunY: 90, moon: true, fireworks: true }
}

function vibrate(ms) {
  try { navigator.vibrate?.(ms) } catch {}
}

export default function Platformer({ level, onComplete, onQuit, isFullscreen, onFullscreen }) {
  const canvasRef = useRef(null)
  const [hud, setHud] = useState({ coins: 0, total: level.coins.length, deaths: 0, time: 0 })
  const [paused, setPaused] = useState(false)
  const [whisper, setWhisper] = useState('')
  const touch = useRef({ left: false, right: false, jump: false })
  const pausedRef = useRef(false)
  pausedRef.current = paused

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let dead = false
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const keys = {}
    let jumpQueued = false
    const down = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault()
      if (!keys[e.code] && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW')) jumpQueued = true
      keys[e.code] = true
    }
    const up = (e) => {
      keys[e.code] = false
      // variable jump cut
      if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && player.vy < -5) player.vy = -5
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    const coins = level.coins.map((c) => ({ ...c, taken: false }))
    const movers = (level.movers || []).map((m) => ({ ...m, ox: m.x, oy: m.y, t: Math.random() * 6 }))
    let player = { ...level.spawn, w: 26, h: 36, vx: 0, vy: 0, onGround: false, face: 1, jumps: 0, coyote: 0, buffer: 0 }
    let camX = 0
    let checkpoint = null
    let deaths = 0, coinsGot = 0
    let start = performance.now()
    let lastHud = 0, whisperT = 0
    const parts = [] // coin sparkles + landing dust + fireworks
    const flies = Array.from({ length: 26 }, (_, i) => ({ x: Math.random() * level.width, y: 120 + Math.random() * 300, p: Math.random() * 6 }))

    const statics = level.platforms
    const sky = SKIES[level.sky] || SKIES.blue

    function collide(px, py, pw, ph, s) {
      return px < s.x + s.w && px + pw > s.x && py < s.y + s.h && py + ph > s.y
    }
    function allSolids() { return [...statics, ...movers] }

    function respawn() {
      deaths++; hurtSfx(); vibrate(80)
      burst(player.x + 13, player.y + 18, '#FF8299', 10)
      const p = checkpoint || level.spawn
      player = { x: p.x, y: p.y - 46, w: 26, h: 36, vx: 0, vy: 0, onGround: false, face: 1, jumps: 0, coyote: 0, buffer: 0 }
    }
    function burst(x, y, color, n) {
      if (reduced) return
      for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 5, vy: -Math.random() * 5, life: 30 + Math.random() * 20, color })
    }

    function step(now) {
      // movers
      for (const m of movers) {
        m.t += 0.016 * m.speed
        if (m.axis === 'x') m.x = m.ox + Math.sin(m.t) * m.range
        else m.y = m.oy + Math.sin(m.t) * m.range
      }

      const t = touch.current
      const left = keys.ArrowLeft || keys.KeyA || t.left
      const right = keys.ArrowRight || keys.KeyD || t.right
      const jumpHeld = keys.ArrowUp || keys.Space || keys.KeyW || t.jump
      if (t.jump && !t._prevJump) jumpQueued = true
      t._prevJump = t.jump

      if (jumpQueued) { player.buffer = 9; jumpQueued = false }
      else if (player.buffer > 0) player.buffer--

      player.vx = 0
      if (left) { player.vx = -SPEED; player.face = -1 }
      if (right) { player.vx = SPEED; player.face = 1 }
      player.vy = Math.min(17, player.vy + GRAV)

      const wantJump = jumpHeld && player.buffer > 0
      if (player.onGround) { player.coyote = 8; player.jumps = 0 }
      else if (player.coyote > 0) player.coyote--

      if (wantJump && (player.onGround || player.coyote > 0)) {
        player.vy = JUMP; player.onGround = false; player.coyote = 0; player.buffer = 0; player.jumps = 1
        jumpSfx(); vibrate(12); burst(player.x + 13, player.y + 36, '#B8FF72', 6)
      } else if (wantJump && level.doubleJump && player.jumps < 2 && !player.onGround) {
        // DOUBLE JUMP — flip sparkle
        player.vy = JUMP * 0.88; player.jumps = 2; player.buffer = 0
        jumpSfx(); vibrate(15); burst(player.x + 13, player.y + 18, '#FFD779', 10)
      }

      // X
      player.x += player.vx
      player.x = Math.max(0, Math.min(level.width - player.w, player.x))
      for (const s of allSolids()) {
        if (collide(player.x, player.y, player.w, player.h, s)) {
          if (player.vx > 0) player.x = s.x - player.w
          else if (player.vx < 0) player.x = s.x + s.w
        }
      }
      // ride mover horizontally
      for (const m of movers) {
        if (collide(player.x, player.y + 2, player.w, player.h, m) && player.vy >= 0) {
          player.x += (m.axis === 'x' ? Math.cos(m.t) * m.range * 0.016 * m.speed : 0)
        }
      }
      // Y
      player.y += player.vy
      const wasAir = !player.onGround
      player.onGround = false
      for (const s of allSolids()) {
        if (collide(player.x, player.y, player.w, player.h, s)) {
          if (player.vy > 0) {
            player.y = s.y - player.h; player.vy = 0; player.onGround = true; player.jumps = 0
            if (wasAir) burst(player.x + 13, player.y + 36, 'rgba(240,245,223,.7)', 4)
          } else if (player.vy < 0) { player.y = s.y + s.h; player.vy = 0 }
        }
      }
      // bounce pads
      for (const b of (level.bounce || [])) {
        if (collide(player.x, player.y, player.w, player.h, b) && player.vy >= 0) {
          player.vy = -17; player.onGround = false; sfx(300); vibrate(25)
          burst(player.x + 13, b.y, '#FF8299', 10)
        }
      }
      if (player.y > H + 90) respawn()

      for (const c of coins) {
        if (!c.taken && Math.abs(player.x + 13 - c.x) < 24 && Math.abs(player.y + 18 - c.y) < 30) {
          c.taken = true; coinsGot++; coinSfx(); vibrate(20)
          burst(c.x, c.y, '#FFD779', 12)
        }
      }
      for (const sp of (level.spikes || [])) {
        if (collide(player.x + 5, player.y + 5, player.w - 10, player.h - 5, sp)) { respawn(); break }
      }
      if (level.checkpoint && !checkpoint) {
        const c = level.checkpoint
        if (collide(player.x, player.y, player.w, player.h, c)) {
          checkpoint = { x: c.x, y: c.y }; coinSfx(); vibrate(30)
          setWhisper('CHECKPOINT — respawn saved ♥'); whisperT = now
        }
      }
      for (const wsp of (level.whispers || [])) {
        if (!wsp._shown && Math.abs(player.x - wsp.x) < 60) {
          wsp._shown = true; setWhisper(wsp.text); whisperT = now
        }
      }

      const g = level.goal
      if (player.x + player.w > g.x && player.x < g.x + g.w && player.y + player.h > g.y) {
        const secs = Math.round((performance.now() - start) / 1000)
        onComplete({ coins: coinsGot, total: coins.length, deaths, time: secs })
        return true
      }
      camX = Math.max(0, Math.min(level.width - W, player.x - W * 0.38))

      // particles
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life--
        if (p.life <= 0) parts.splice(i, 1)
      }
      // midnight fireworks
      if (sky.fireworks && !reduced && Math.random() < 0.02) {
        burst(camX + Math.random() * W, 80 + Math.random() * 150, ['#B8FF72', '#FF8299', '#FFD779'][Math.floor(Math.random() * 3)], 16)
      }
      return false
    }

    function drawSky(now) {
      const gr = ctx.createLinearGradient(0, 0, 0, H)
      gr.addColorStop(0, sky.top); gr.addColorStop(0.55, sky.mid); gr.addColorStop(1, sky.low)
      ctx.fillStyle = gr
      ctx.fillRect(0, 0, W, H)
      // sun / moon
      if (sky.sun) {
        const sx = W - 170 - camX * 0.05
        ctx.fillStyle = sky.sun
        if (sky.moon) {
          ctx.fillRect(sx, sky.sunY, 46, 46)
          ctx.fillStyle = sky.top
          ctx.fillRect(sx + 12, sky.sunY - 6, 40, 40)
        } else {
          // pixel sun with scanline cut
          ctx.fillRect(sx - 20, sky.sunY - 20, 100, 100)
          ctx.fillStyle = sky.mid
          for (let i = 0; i < 4; i++) ctx.fillRect(sx - 20, sky.sunY + 30 + i * 14, 100, 5)
        }
      }
      // stars
      if (sky.star > 0) {
        ctx.fillStyle = '#F0F5DF'
        for (let i = 0; i < 40; i++) {
          const sx = ((i * 173 - camX * 0.15) % (W + 40) + W + 40) % (W + 40) - 20
          const sy = (i * 97) % 260 + 10
          const tw = reduced ? 1 : (0.4 + 0.6 * Math.abs(Math.sin(now / 700 + i)))
          ctx.globalAlpha = sky.star * tw
          ctx.fillRect(sx, sy, 3, 3)
        }
        ctx.globalAlpha = 1
      }
      // clouds (skip in cave)
      if (!sky.lantern) {
        ctx.fillStyle = 'rgba(240,245,223,.75)'
        for (let i = 0; i < 5; i++) {
          const cx = ((i * 430 - camX * 0.3) % (W + 300) + W + 300) % (W + 300) - 150
          const cy = 60 + (i * 53) % 130
          ctx.fillRect(cx, cy, 64, 12); ctx.fillRect(cx + 12, cy - 8, 40, 8)
        }
      }
      // hills
      ctx.fillStyle = sky.hill
      for (let i = 0; i < 9; i++) {
        const hx = i * 400 - (camX * 0.4 % 400)
        ctx.fillRect(hx, 400, 250, 140)
        ctx.fillStyle = 'rgba(0,0,0,.18)'
        ctx.fillRect(hx, 400, 250, 6)
        ctx.fillStyle = sky.hill
      }
    }

    function draw(now) {
      drawSky(now)
      ctx.save()
      ctx.translate(-camX, 0)

      for (const s of statics) {
        ctx.fillStyle = sky.ground
        ctx.fillRect(s.x, s.y, s.w, s.h)
        ctx.fillStyle = level.sky === 'blue' ? '#4aa3df' : '#78D84D'
        ctx.fillRect(s.x, s.y, s.w, 5)
        ctx.strokeStyle = 'rgba(0,0,0,.5)'
        ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1)
      }
      // movers — amber drifters
      for (const m of movers) {
        ctx.fillStyle = '#FFD779'
        ctx.fillRect(m.x, m.y, m.w, m.h)
        ctx.fillStyle = '#000'
        ctx.fillRect(m.x, m.y, m.w, 4)
        ctx.font = '9px monospace'
        ctx.fillText('RIDE', m.x + 8, m.y + 12)
      }
      // bounce pads
      for (const b of (level.bounce || [])) {
        const squash = 1 + Math.sin(now / 200) * 0.06
        ctx.fillStyle = '#FF8299'
        ctx.fillRect(b.x, b.y + (20 - 20 * squash), b.w, 20 * squash)
        ctx.fillStyle = '#000'
        ctx.font = 'bold 10px monospace'
        ctx.fillText('BOING', b.x + 8, b.y + 13)
      }
      if (level.checkpoint) {
        const c = level.checkpoint
        ctx.fillStyle = checkpoint ? '#B8FF72' : '#FF8299'
        ctx.fillRect(c.x, c.y, c.w, c.h)
        ctx.fillStyle = '#000'; ctx.font = '10px monospace'
        ctx.fillText('SAVE', c.x + 4, c.y + 24)
      }
      ctx.fillStyle = '#FF8299'
      for (const sp of (level.spikes || [])) {
        for (let x = sp.x; x < sp.x + sp.w; x += 12) {
          ctx.beginPath()
          ctx.moveTo(x, sp.y + sp.h); ctx.lineTo(x + 6, sp.y); ctx.lineTo(x + 12, sp.y + sp.h)
          ctx.fill()
        }
      }
      // whispers — floating notes
      ctx.font = '11px monospace'
      for (const wsp of (level.whispers || [])) {
        const float = reduced ? 0 : Math.sin(now / 500 + wsp.x) * 4
        ctx.fillStyle = 'rgba(0,0,0,.75)'
        const tw = ctx.measureText(wsp.text).width + 14
        ctx.fillRect(wsp.x - tw / 2, wsp.y - 26 + float, tw, 20)
        ctx.fillStyle = '#FFD779'
        ctx.fillText(wsp.text, wsp.x - tw / 2 + 7, wsp.y - 12 + float)
      }
      // coins
      const bob = reduced ? 0 : Math.sin(now / 300) * 3
      for (const c of coins) {
        if (c.taken) continue
        ctx.fillStyle = '#FFD779'
        ctx.fillRect(c.x - 7, c.y - 7 + bob, 14, 14)
        ctx.fillStyle = '#FF8299'
        ctx.fillRect(c.x - 4, c.y - 4 + bob, 8, 8)
      }
      // fireflies at night/cave/midnight
      if ((sky.star > 0.5 || sky.lantern) && !reduced) {
        for (const f of flies) {
          f.p += 0.03
          const fx = f.x, fy = f.y + Math.sin(f.p) * 14
          if (fx < camX - 30 || fx > camX + W + 30) continue
          ctx.fillStyle = '#B8FF72'
          ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(f.p * 2))
          ctx.fillRect(fx, fy, 4, 4)
        }
        ctx.globalAlpha = 1
      }
      // lantern glow in cave around player
      if (sky.lantern) {
        const grd = ctx.createRadialGradient(player.x + 13, player.y + 18, 30, player.x + 13, player.y + 18, 220)
        grd.addColorStop(0, 'rgba(255,215,121,.20)')
        grd.addColorStop(1, 'rgba(0,0,0,.55)')
        ctx.fillStyle = grd
        ctx.fillRect(camX - 40, 0, W + 80, H)
      }
      // particles
      for (const p of parts) {
        ctx.globalAlpha = Math.min(1, p.life / 25)
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 5, 5)
      }
      ctx.globalAlpha = 1

      // goal
      const g = level.goal
      ctx.fillStyle = '#B8FF72'
      ctx.fillRect(g.x, g.y - 20, 6, g.h + 20)
      const wave = reduced ? 0 : Math.sin(now / 250) * 3
      ctx.fillStyle = level.castle ? '#FFD779' : '#B8FF72'
      ctx.fillRect(g.x + 6, g.y - 20, 36 + wave, 22)
      ctx.fillStyle = '#000'; ctx.font = 'bold 11px monospace'
      ctx.fillText(level.castle ? 'BDAY' : 'FLAG', g.x + 8, g.y - 5)
      if (level.castle) {
        ctx.fillStyle = '#17251A'
        ctx.fillRect(g.x - 34, g.y + 40, 128, 60)
        ctx.fillStyle = '#FFD779'
        ctx.fillRect(g.x - 34, g.y + 40, 128, 8)
        ctx.fillStyle = '#FF8299'
        ctx.fillRect(g.x + 16, g.y + 62, 24, 38) // door
      }
      // player with glow at night
      const px = player.x, py = player.y
      if (sky.lantern || sky.star >= 1) {
        ctx.fillStyle = 'rgba(184,255,114,.18)'
        ctx.fillRect(px - 10, py - 10, 46, 56)
      }
      const hop = player.onGround ? 0 : -2
      const run = player.vx !== 0 && player.onGround && !reduced ? (Math.floor(now / 120) % 2) * 2 : 0
      ctx.fillStyle = '#000'
      ctx.fillRect(px - 2, py - 2 + hop, 30, 40)
      ctx.fillStyle = '#FF8299'
      ctx.fillRect(px, py + hop, 26, 14)
      ctx.fillStyle = '#0B100D'
      ctx.fillRect(px + (player.face > 0 ? 14 : 7), py + 5 + hop, 5, 5)
      ctx.fillStyle = '#F0F5DF'
      ctx.fillRect(px + 3, py + 16 + hop, 20, 12)
      ctx.fillStyle = '#B8FF72'
      ctx.fillRect(px + 1, py + 28 + hop + run, 10, 8)
      ctx.fillRect(px + 15, py + 28 + hop - run, 10, 8)

      ctx.restore()
      ctx.fillStyle = 'rgba(240,245,223,.9)'
      ctx.font = '12px monospace'
      ctx.fillText(level.sub, 12, 22)
      if (level.doubleJump) {
        ctx.fillStyle = '#FFD779'
        ctx.fillText('DOUBLE-JUMP: ON', W - 150, 22)
      }
    }

    function loop(now) {
      if (dead) return
      let finished = false
      try {
        if (!pausedRef.current) {
          finished = step(now)
          draw(now)
          if (whisper && now - whisperT > 2200) setWhisper('')
          if (!finished && now - lastHud > 250) {
            lastHud = now
            setHud({ coins: coinsGot, total: coins.length, deaths, time: Math.round((now - start) / 1000) })
          }
        } else {
          draw(now)
        }
      } catch (err) {
        // one bad frame (e.g. audio) must never freeze the game
        try { console.error('frame error', err) } catch {}
      }
      // finished (flag reached) stops the loop; everything else keeps running
      if (!finished) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id])

  const hold = (k, v) => (e) => {
    e.preventDefault()
    try { e.target.setPointerCapture?.(e.pointerId) } catch {}
    if (v && k === 'jump') {
      // edge trigger handled via _edge in loop; also allow hold
    }
    touch.current[k] = v
  }

  const [showPad, setShowPad] = useState(() => {
    try { return localStorage.getItem('chotu-pad') !== 'off' } catch { return true }
  })
  const togglePad = () => {
    setShowPad((v) => {
      try { localStorage.setItem('chotu-pad', v ? 'off' : 'on') } catch {}
      return !v
    })
  }

  return (
    <div className="stage stage-full">
      <div className="stage-hud overlay-hud">
        <span>♥ {hud.coins}/{hud.total}</span>
        <span>☠ {hud.deaths}</span>
        <span>⏱ {hud.time}s</span>
        {level.doubleJump && <span className="pill mini">2×JUMP</span>}
        <span className="spacer" />
        <button className="mini-btn" onClick={togglePad} aria-label={showPad ? 'hide controls' : 'show controls'} title="Show / hide buttons">🎮</button>
        <button className="mini-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'resume' : 'pause'}>{paused ? '▶' : '⏸'}</button>
        {onFullscreen && (
          <button className="mini-btn" onClick={onFullscreen} aria-label="toggle fullscreen">{isFullscreen ? '⛶' : '⛶ FULL'}</button>
        )}
        <button className="mini-btn" onClick={onQuit}>QUIT</button>
      </div>
      <div className="canvas-wrap fill">
        <canvas ref={canvasRef} width={960} height={540} className="game-canvas fill" aria-label={`${level.name} playable level`} />
        {paused && (
          <div className="paused" role="status">
            <p>⏸ PAUSED — midnight break?</p>
            <button className="btn" onClick={() => setPaused(false)}>RESUME ▶</button>
          </div>
        )}
        {whisper && <div className="whisper" role="status">✦ {whisper}</div>}
      </div>
      {/* DOCKED controls — below the game, same screen, never covers playfield */}
      {showPad && (
        <div className="touch touch-docked" aria-label="on-screen game controls">
          <div className="t-left">
            <button aria-label="move left" onPointerDown={hold('left', true)} onPointerUp={hold('left', false)} onPointerCancel={hold('left', false)} onPointerLeave={hold('left', false)} onLostPointerCapture={hold('left', false)} onContextMenu={(e) => e.preventDefault()}>◀</button>
            <button aria-label="move right" onPointerDown={hold('right', true)} onPointerUp={hold('right', false)} onPointerCancel={hold('right', false)} onPointerLeave={hold('right', false)} onLostPointerCapture={hold('right', false)} onContextMenu={(e) => e.preventDefault()}>▶</button>
          </div>
          <button className="jump" aria-label="jump" onPointerDown={hold('jump', true)} onPointerUp={hold('jump', false)} onPointerCancel={hold('jump', false)} onPointerLeave={hold('jump', false)} onLostPointerCapture={hold('jump', false)} onContextMenu={(e) => e.preventDefault()}>JUMP ▲</button>
        </div>
      )}
      <p className="hint slim-hint">{level.hint}</p>
    </div>
  )
}
