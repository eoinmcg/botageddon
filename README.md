# 🤖 ROBOCIDE

> **The year is 1984. The future is dead. The machines won. Humanity is a memory. Cats inherit the ruins.**

| ![Splash screen](https://raw.githubusercontent.com/eoinmcg/robocide/main/promo/splash.png) | ![screenshot](https://raw.githubusercontent.com/eoinmcg/robocide/main/promo/play.png) | ![gamplay](https://raw.githubusercontent.com/eoinmcg/robocide/main/promo/gameplay.gif) |
| :---: | :---: | :---: |

Twin stick shooter arcade action. A bot army is hell-bent on destroying all remaining moggies. Buckle up, kitty! Nine lives won't be enough to survive this mayhem! Go give those toasters hell.

### [🕹️ PLAY THE GAME IN YOUR BROWSER](https://eoinmcgrath.com/robocide)

---

## ⌨️ Controls
- **WASD / Arrows**: Move
- **Mouse**: Aim & Shoot
- **Gamepad**: Fully supported
- **[M]**: Mute music & SFX
- **[P]**: Pause
- **[O]**: Fullscreen

---

## 🛠 Tech & Development

This project is built for the **Gamedev.js Jam 2026** using the [LittleJS Engine](https://github.com/KilledByAPixel/LittleJS).

### Run Locally
Clone the repo and run:

Start local dev server: `npm run dev`

Create a zip: `npm run zip`

Host on [github pages](https://docs.github.com/en/pages): `npm run deploy` *

(* In your repo under settings > pages)

- [⚙️ Made with LittleJS](https://github.com/KilledByAPixel/LittleJS)
- [🎶 Music by Snabisch](https://snabisch.itch.io/free-music-sequences-for-pico-8)
- [🔊 Music Player: pico8-music](https://github.com/codyebberson/pico8-music)

Read more about how the game was made:
[post mortem](https://eoinmcgrath.com/robocide/postmortem.html)


## Architecture

**Entry Point** (src/main.js): Bootstraps the game, initializes the canvas context, and manages the primary game loop.

**Global Configuration** (src/data/config.js): A centralized source of truth for game constants, including screen resolution, physics parameters, and the sprite atlas mapping.

**Scene Manager** (src/core/sceneManager.js): A state machine that handles transitions between game states (e.g., switching from the Splash Screen to Active Gameplay).

**Base Scene** (src/scenes/scene.js): An abstract base class that provides standardized lifecycle methods and input handling to be inherited by all game levels.

**Base Sprite Class** (src/sprites/sprite.js): The core EngineObject. It handles the rendering pipeline for all entities, featuring built-in, inheritable logic for dynamic shadows and outlines.
