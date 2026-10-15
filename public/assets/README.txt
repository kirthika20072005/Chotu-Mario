CHOTU PHOTOS — how to add boyfriend photos:

1. Add 7 photos named exactly:
     level-1.jpg
     level-2.jpg
     ...
     level-7.jpg
   (.jpg / .png / .webp all work — just update PHOTOS in src/game/content.js
    if you use a different extension.)

2. Recommended: square-ish, < 500KB each (use tinyjpg.com).

3. Rebuild + redeploy:
     npm run build

Missing photo? Game shows a cute placeholder — nothing breaks.
Coupons + love letters live in src/game/content.js (COUPONS, CARDS).
