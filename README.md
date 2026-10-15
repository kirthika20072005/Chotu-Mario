# SUPER CHOTU BROS — Mario-style birthday game

Fresh React + Vite platformer. The old `chotu-exe` OS world is untouched — this is a second game.

## Play
```bash
cd chotu-mario
npm install
npm run dev
```
Keyboard: Arrows / A D move, Space / Up / W jump. Mobile: ◀ ▶ + JUMP buttons.

## How it works
- World map with 7 levels: WELCOME, MEMORIES, WHY_YOU, OUR_STORY, UNSENT, FUTURE, SECRET_LEVEL.
- Finish a run by touching the flag → its love-letter card pops out (content in `src/game/content.js`).
- Next level unlocks. Progress + hearts in `localStorage` (`super-chotu-save`).
- Infinite lives — spikes/falls just respawn (checkpoint on some levels).
- Music: Web Audio chiptune, OFF by default.

## Build / deploy
```bash
npm run build
npm run preview
```
`dist/` is static — Netlify Drop / Vercel / GitHub Pages. `base: './'` set.

## Customize
- Difficulty/geometry: `src/game/levels.js`
- Letter text: `src/game/content.js`
- Colors: `src/styles.css` `:root`
