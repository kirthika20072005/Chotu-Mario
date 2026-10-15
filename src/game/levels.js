// 960x540 logical world. Each level has a sky theme + innovations.
// sky: sunset | blue | night | dusk | cave | dawn | midnight
export const LEVELS = [
  {
    id: 0, name: 'WELCOME.exe', sub: 'WORLD 1-1 · Sunset Run',
    sky: 'sunset', doubleJump: false,
    hint: 'Run right, grab hearts, touch the flag. Mobile: hold ▶ + tap JUMP. Double-jump unlocks at 1-3.',
    width: 2200,
    spawn: { x: 60, y: 400 },
    goal: { x: 2050, y: 420, w: 30, h: 80 },
    platforms: [
      { x: 0, y: 500, w: 600, h: 40 }, { x: 680, y: 500, w: 500, h: 40 },
      { x: 1260, y: 500, w: 420, h: 40 }, { x: 1760, y: 500, w: 440, h: 40 },
      { x: 300, y: 400, w: 120, h: 18 }, { x: 800, y: 380, w: 120, h: 18 },
      { x: 1350, y: 380, w: 140, h: 18 }
    ],
    movers: [],
    bounce: [{ x: 950, y: 480, w: 60, h: 20 }],
    coins: [{ x: 350, y: 350 }, { x: 850, y: 330 }, { x: 1100, y: 440 }, { x: 1420, y: 330 }, { x: 1900, y: 440 }],
    whispers: [{ x: 500, y: 340, text: 'for Chotu ♥' }, { x: 1600, y: 340, text: 'Bujik was here' }],
    spikes: []
  },
  {
    id: 1, name: 'MEMORIES', sub: 'WORLD 1-2 · Blue Sky Meadows',
    sky: 'blue', doubleJump: false,
    hint: 'Blue-day stroll. Pink bounce pads launch you. Hearts = memories.',
    width: 2600,
    spawn: { x: 60, y: 400 },
    goal: { x: 2450, y: 420, w: 30, h: 80 },
    platforms: [
      { x: 0, y: 500, w: 520, h: 40 }, { x: 600, y: 500, w: 380, h: 40 },
      { x: 1060, y: 500, w: 380, h: 40 }, { x: 1520, y: 500, w: 400, h: 40 },
      { x: 2000, y: 500, w: 600, h: 40 },
      { x: 250, y: 390, w: 110, h: 18 }, { x: 700, y: 370, w: 110, h: 18 },
      { x: 1150, y: 370, w: 120, h: 18 }, { x: 1620, y: 380, w: 120, h: 18 }, { x: 2150, y: 380, w: 130, h: 18 }
    ],
    movers: [{ x: 1200, y: 430, w: 110, h: 16, axis: 'x', range: 120, speed: 1.2 }],
    bounce: [{ x: 450, y: 480, w: 60, h: 20 }],
    coins: [{ x: 290, y: 340 }, { x: 740, y: 320 }, { x: 1200, y: 320 }, { x: 1670, y: 330 }, { x: 1900, y: 440 }, { x: 2200, y: 330 }],
    whispers: [{ x: 900, y: 300, text: 'that laugh ♥' }, { x: 2050, y: 320, text: 'late-night talks' }],
    spikes: [{ x: 990, y: 484, w: 60, h: 16 }]
  },
  {
    id: 2, name: 'WHY_YOU.txt', sub: 'WORLD 1-3 · Night Heights',
    sky: 'night', doubleJump: true,
    hint: 'NEW: DOUBLE-JUMP unlocked! Tap JUMP again mid-air. Moon + fireflies guide you.',
    width: 2800,
    spawn: { x: 60, y: 400 },
    goal: { x: 2640, y: 340, w: 30, h: 80 },
    platforms: [
      { x: 0, y: 500, w: 440, h: 40 }, { x: 520, y: 460, w: 200, h: 18 },
      { x: 800, y: 410, w: 200, h: 18 }, { x: 1080, y: 460, w: 260, h: 18 },
      { x: 1420, y: 500, w: 340, h: 40 }, { x: 1840, y: 460, w: 200, h: 18 },
      { x: 2120, y: 420, w: 200, h: 18 }, { x: 2400, y: 420, w: 400, h: 40 }
    ],
    movers: [
      { x: 1500, y: 430, w: 110, h: 16, axis: 'y', range: 60, speed: 1.4 },
      { x: 1950, y: 400, w: 110, h: 16, axis: 'x', range: 100, speed: 1.1 }
    ],
    bounce: [],
    coins: [{ x: 600, y: 410 }, { x: 880, y: 360 }, { x: 1200, y: 410 }, { x: 1930, y: 410 }, { x: 2200, y: 370 }, { x: 2550, y: 370 }],
    whispers: [{ x: 880, y: 340, text: 'reason_01: your smile' }, { x: 2200, y: 350, text: 'just Chotu.' }],
    spikes: [{ x: 1150, y: 444, w: 70, h: 16 }, { x: 1500, y: 484, w: 70, h: 16 }]
  },
  {
    id: 3, name: 'OUR_STORY', sub: 'WORLD 1-4 · Dusk Climb',
    sky: 'dusk', doubleJump: true,
    hint: 'Checkpoint mid-way saves you. Floating platforms drift — ride them.',
    width: 3000,
    spawn: { x: 60, y: 400 },
    goal: { x: 2840, y: 340, w: 30, h: 80 },
    checkpoint: { x: 1500, y: 440, w: 40, h: 60 },
    platforms: [
      { x: 0, y: 500, w: 500, h: 40 }, { x: 580, y: 450, w: 180, h: 18 },
      { x: 840, y: 400, w: 180, h: 18 }, { x: 1100, y: 450, w: 320, h: 18 },
      { x: 1500, y: 500, w: 420, h: 40 }, { x: 2000, y: 450, w: 180, h: 18 },
      { x: 2260, y: 400, w: 180, h: 18 }, { x: 2520, y: 420, w: 480, h: 40 }
    ],
    movers: [{ x: 1250, y: 420, w: 120, h: 16, axis: 'y', range: 70, speed: 1.2 }],
    bounce: [{ x: 700, y: 480, w: 60, h: 20 }],
    coins: [{ x: 630, y: 400 }, { x: 900, y: 350 }, { x: 1250, y: 400 }, { x: 1700, y: 440 }, { x: 2060, y: 400 }, { x: 2320, y: 350 }],
    whispers: [{ x: 1150, y: 380, text: 'save point ♥' }, { x: 2600, y: 350, text: 'right now, us' }],
    spikes: [{ x: 500, y: 484, w: 70, h: 16 }, { x: 1930, y: 484, w: 60, h: 16 }]
  },
  {
    id: 4, name: 'UNSENT.txt', sub: 'WORLD 1-5 · Midnight Cave',
    sky: 'cave', doubleJump: true,
    hint: 'Midnight cave — Chotu glows. Follow lanterns + whispers. Slow is fast.',
    width: 3000,
    spawn: { x: 60, y: 400 },
    goal: { x: 2840, y: 420, w: 30, h: 80 },
    platforms: [
      { x: 0, y: 500, w: 460, h: 40 }, { x: 560, y: 500, w: 300, h: 40 },
      { x: 960, y: 500, w: 300, h: 40 }, { x: 1360, y: 500, w: 300, h: 40 },
      { x: 1760, y: 500, w: 320, h: 40 }, { x: 2180, y: 500, w: 820, h: 40 },
      { x: 600, y: 390, w: 120, h: 18 }, { x: 1400, y: 390, w: 120, h: 18 }, { x: 2250, y: 390, w: 130, h: 18 }
    ],
    movers: [{ x: 1000, y: 430, w: 110, h: 16, axis: 'x', range: 140, speed: 1.3 }],
    bounce: [],
    coins: [{ x: 650, y: 340 }, { x: 1100, y: 440 }, { x: 1450, y: 340 }, { x: 1920, y: 440 }, { x: 2310, y: 340 }, { x: 2650, y: 440 }],
    whispers: [{ x: 650, y: 320, text: '"Saaptiya?" = I care' }, { x: 1450, y: 320, text: '"Reached ah?" = be safe' }, { x: 2310, y: 320, text: 'no pretending here' }],
    spikes: [{ x: 880, y: 484, w: 70, h: 16 }, { x: 1680, y: 484, w: 70, h: 16 }, { x: 2100, y: 484, w: 70, h: 16 }]
  },
  {
    id: 5, name: 'FUTURE.exe', sub: 'WORLD 1-6 · Dawn Peak',
    sky: 'dawn', doubleJump: true,
    hint: 'Sunrise climb. Ride drifters, bounce high. Last practice before the castle.',
    width: 3200,
    spawn: { x: 60, y: 400 },
    goal: { x: 3040, y: 340, w: 30, h: 80 },
    checkpoint: { x: 1600, y: 440, w: 40, h: 60 },
    platforms: [
      { x: 0, y: 500, w: 400, h: 40 }, { x: 480, y: 450, w: 160, h: 18 },
      { x: 720, y: 400, w: 160, h: 18 }, { x: 960, y: 450, w: 200, h: 18 },
      { x: 1240, y: 500, w: 300, h: 40 }, { x: 1620, y: 500, w: 320, h: 40 },
      { x: 2020, y: 450, w: 160, h: 18 }, { x: 2260, y: 400, w: 160, h: 18 },
      { x: 2500, y: 450, w: 180, h: 18 }, { x: 2760, y: 420, w: 440, h: 40 }
    ],
    movers: [
      { x: 1300, y: 430, w: 110, h: 16, axis: 'x', range: 120, speed: 1.4 },
      { x: 2350, y: 420, w: 110, h: 16, axis: 'y', range: 60, speed: 1.2 }
    ],
    bounce: [{ x: 1050, y: 480, w: 60, h: 20 }],
    coins: [{ x: 530, y: 400 }, { x: 780, y: 350 }, { x: 1350, y: 440 }, { x: 2080, y: 400 }, { x: 2320, y: 350 }, { x: 2900, y: 370 }],
    whispers: [{ x: 780, y: 330, text: 'listen first ♥' }, { x: 2320, y: 330, text: 'actions > paragraphs' }],
    spikes: [{ x: 1160, y: 484, w: 70, h: 16 }, { x: 1940, y: 484, w: 70, h: 16 }, { x: 2700, y: 404, w: 50, h: 16 }]
  },
  {
    id: 6, name: 'SECRET_LEVEL', sub: 'WORLD 8-CASTLE · Midnight Birthday',
    sky: 'midnight', doubleJump: true,
    hint: 'Fireworks castle. Grab every heart. Flag = HAPPY BIRTHDAY.',
    width: 2400,
    castle: true,
    spawn: { x: 60, y: 400 },
    goal: { x: 2240, y: 340, w: 34, h: 90 },
    platforms: [
      { x: 0, y: 500, w: 700, h: 40 }, { x: 780, y: 500, w: 400, h: 40 },
      { x: 1260, y: 500, w: 400, h: 40 }, { x: 1740, y: 500, w: 660, h: 40 },
      { x: 400, y: 390, w: 130, h: 18 }, { x: 900, y: 380, w: 130, h: 18 }, { x: 1350, y: 380, w: 140, h: 18 }
    ],
    movers: [{ x: 1650, y: 430, w: 120, h: 16, axis: 'y', range: 70, speed: 1.5 }],
    bounce: [{ x: 600, y: 480, w: 64, h: 20 }],
    coins: [{ x: 450, y: 340 }, { x: 950, y: 330 }, { x: 1420, y: 330 }, { x: 1900, y: 440 }, { x: 2100, y: 440 }],
    whispers: [{ x: 950, y: 310, text: 'for your eyes only' }, { x: 1900, y: 400, text: 'almost there ♥' }],
    spikes: [{ x: 1180, y: 484, w: 60, h: 16 }]
  }
]
