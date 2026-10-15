// Short pop-up story cards shown when a level is cleared.
// Full emotional text lives here so the platformer stays fast.
//
// PHOTOS: drop your photos in public/assets/ as:
//   level-1.jpg … level-7.jpg  (jpg/png/webp all work — see PHOTOS below)
// If a photo is missing the game shows a cute placeholder instead,
// so nothing ever breaks.
export const PHOTOS = [
  '/assets/level-1.jpg',
  '/assets/level-2.jpg',
  '/assets/level-3.jpg',
  '/assets/level-4.jpg',
  '/assets/level-5.jpg',
  '/assets/level-6.jpg',
  '/assets/level-7.jpg',
]

export const COUPONS = [
  { icon: '🤗', title: 'HUG COUPON', desc: 'Redeemable anytime, anywhere. No expiry. — Bujik' },
  { icon: '🎬', title: 'MOVIE NIGHT', desc: 'Your pick. Snacks on me + phone on silent.' },
  { icon: '🌙', title: 'MIDNIGHT CALL', desc: 'One long call, no clock-watching. Just us.' },
  { icon: '🍜', title: 'FAV FOOD DATE', desc: 'Your favourite food, my treat. Saaptiya? 😌' },
  { icon: '💌', title: 'UNSENT WISH', desc: 'Ask me for one honest answer. I promise truth.' },
  { icon: '🌅', title: 'SUNRISE PROMISE', desc: 'One morning walk / sunrise together, soon.' },
  { icon: '🎂', title: 'BIRTHDAY KING DAY', desc: 'Today you decide everything. I just smile. ♡' },
]

export const LOVE_REASONS = [
  'Your smile fixes my whole mood. ♥',
  'You listen — really listen.',
  '"Saaptiya?" hits different from you.',
  'You make ordinary days feel special.',
  'You believe in me even when I doubt myself.',
  'Your laugh = my favourite sound.',
  'You feel like home, Chotu.',
  'Late-night talks with you > everything.',
]
export const CARDS = [
  {
    file: 'WELCOME.exe', title: 'Hey, Chotu. You are the reason this exists.',
    body: 'Indha website normal birthday wish illa. Idhu en heart oda small folder. Naan solla marandha feelings, namma memories, un mela irukkura love — ellathayum konjam konjam ah inga save pannirukken. Take your time. This little world is yours.',
    extras: ['Favourite person: YOU. ALWAYS.', 'Love status: STILL LOADING...', 'Ending: TO BE UNLOCKED']
  },
  {
    file: 'MEMORIES', title: 'Sila moments mind la dhaan save aagum.',
    body: 'Chotu, ellaa memories um photo la capture panna mudiyadhu. Nee siricha oru second, random ah pesina conversation, un kitta pesina apram en mood better aana neram — idhellam enakku romba precious. Random convos, small smiles, little details, not-yet-made memories — ella folder um unakku dhaan.',
    extras: ['TIP: add our photos in chotu-exe / public/assets — inga hearts collect panna maari, anga memories save pannalaam.']
  },
  {
    file: 'WHY_YOU.txt', title: "Why you? Because it's you.",
    body: 'Oru single reason illa. Un smile, un comfort, un kooda naan naan ah irukka mudiyura freedom, un dreams mela enakku irukkira care — adhu dhaan answer. heart_scan.exe run panna result: "it\'s Chotu. just Chotu."',
    extras: ['reason_01: your smile changes my mood', 'reason_02: I can be myself around you', 'reason_04: your happiness matters to me']
  },
  {
    file: 'OUR_STORY', title: 'Namma story, save by save.',
    body: 'Dates illa, filters illa. Beginning → realisation → comfort → right now → not written yet. Konjam konjam ah mukkiyam aana bond. Checkpoint touch panna maari — namma story um save aagite irukku.',
    extras: ['SAVE POINT 05 — NOT WRITTEN YET: bayam illa, excitement dhaan.']
  },
  {
    file: 'UNSENT.txt', title: 'Small words, periya meaning.',
    body: '"Saaptiya?" = unna pathi care panren. "Reached ah?" = nee safe ah irukanum. "Enna aachu?" = judge panna illa, kekka dhaan irukken. "Good night" = en last thought nee. Chotu, en munnadi happy ah pretend panna vendam — un feelings, boundaries, nee nee ah irukkaradhu dhaan mukkiyam.',
    extras: []
  },
  {
    file: 'FUTURE.exe', title: 'Small promises, daily practice.',
    body: 'Periya guarantee illa. Daily practice dhaan: listen properly, celebrate wins + sit in tough days, respect dreams/space, be honest, make you laugh, show love in actions not just paragraphs.',
    extras: ['PATCH_001…006 QUEUED — practice, not perfection.']
  },
  {
    file: 'SECRET_LEVEL', title: 'HAPPY BIRTHDAY, CHOTU',
    body: 'Happy Birthday, en Chotu. ❤️ Indha world la evlo per irundhaalum, en heart un kitta vandhu dhaan settle aagudhu. Nee en life ah perfect aakkala — imperfect days kooda meaningful ah maarudhu. Unakku happiness + peace + confidence + health + dreams achieve panna courage kidaikkanum. Bad day vandhaalum adhu un whole life illa. Future birthdays la un smile paathu ‘I\'m glad it\'s you’ nu solla neraya chances kidaikkanum. Love, always — Bujik ♡',
    extras: ['ACCESS GRANTED · ending: TO BE CONTINUED']
  }
]
