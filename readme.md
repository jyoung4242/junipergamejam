# Juniper Game Jam Entry

**Title:** STEAMSPIN

**Developer:** mookie4242

**Game Jam:** The Very Serious Juniper Dev Game Jam

**Submission Date:** June 27, 2026

---

## About

This is a browser-based game built with **ExcaliburJS** for The Very Serious Juniper Dev Game Jam. The game was created around the jam
theme **"spin to win"** and is driven by gameplay, puzzles, and mechanical interactions.

The project uses **zero generative art**. All visuals, sounds, and assets are handcrafted or assembled from static sources.

---

## Gameplay

Players interact with rotating puzzle elements and machinery to solve challenges and progress through levels. The core loop focuses on
spinning controls, aligning objects, and using the environment to create successful outcomes.

### How to Play

- Use keyboard and mouse controls to interact with the game.
  - keyboard only works for button/menu navigation
  - mouse is primary device for game tiles
    - left click selects tile to swap
    - right click rotates tile for alignment
- Spin or rotate elements to align gears, pipes, or other mechanisms.
- Solve each puzzle by finding the right configuration and timing.
- Complete objectives and attempt to beat your best time!

---

## Development Approach

I built this game using **ExcaliburJS** with a focus on:

- procedurally generated puzzle images
- mechanical puzzle design around the theme
- a lightweight, fast browser experience
- hand-crafted asset integration instead of generative content

The development process emphasized iteration: prototyping spinning mechanics, refining visual feedback, and balancing puzzle difficulty
for a polished jam build.

The key consideration for a solo-developed, 7 day jame was keeping the scoping of the game tight, so that I had time to do all the
'other' things needed for a jam, like itch page, readme, playtesting, and debugging.

> [!NOTE]  
> STEAMSPIN uses my custom UIFramework for the buttons, panels, and labels! Also, it uses a custom Scene for its Loader which is a bit
> experimental for ExcaliburJS!

---

## Project Structure

- `src/` — game source files, scenes, UI, actors, and utilities
- `public/` — static files and assets served by Vite
- `index.html` — game entry page
- `package.json` — dependencies and build scripts

---

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite to play the game in your browser.

---

## Asset Credits

- UI pack was used for this game by Positron on Itch.io
  - Link: https://positron.itch.io/steampunk-fantasy-ui-pack
- Audio (SFX): generated with JSFXR and utilizes the JSFXR plugin for excaliburJS
  - Link: https://sfxr.me/
- Audio (Music): music (2 looping tracks) were provided by torone on Itch.io
  - Link: https://torone.itch.io/
- Engine: ExcaliburJS
  - Link: https://excaliburjs.com/

---

## Notes

This entry is prepared for the June 27, 2026 jam deadline. If you want to review the full game logic, open `src/Scenes/game.ts`,
`src/Actors/`, and `src/UI/`.
