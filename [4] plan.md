# Implementation Plan

Each step below should leave the app in a runnable, visibly-working state before moving to the next. Stop after each step for a check before continuing.

- [x] **1. Project scaffolding**
      Vite + React + TypeScript app, basic shell (empty page, no game logic). `npm run dev` serves a blank page with no errors.

- [x] **2. Babylon.js canvas mounted**
      Empty Babylon scene rendering inside the React app (a canvas with a basic camera/light, no cockpit model yet). Confirms the Babylon/React integration and resize handling work.

- [x] **3. City config, random picking, skyline layer, and RESET**
      `cities.ts` with the 3 `CityConfig` objects, using the real skyline/background images and palettes gathered upfront (no placeholders to swap later). On load, one city is picked at random and its skyline plane renders in the scene. A RESET button re-picks a random city and re-renders the skyline — the first, minimal version of reset, extended later once there's more state to reset.

- [x] **4. Cockpit model loaded, camera constrained**
      glTF cockpit model loads into the scene, positioned so the existing skyline plane reads as visible through its window. Camera fixed at the pilot seat, yaw-only rotation clamped to the limited arc, pitch/roll locked. Player can look left/right with the mouse and nothing else.

- [x] **5. Game state machine + timer + game-over state + hint console + themed Field component**
      `GameState` (steps `airport → eta → runway → combine → won`, plus `game_over`) wired up with the 240s countdown visible on screen. No puzzle UI yet, but the timer hitting 0 shows the game-over screen, the hint console displays the text for `currentStep`, and a shared `Field` component exists with locked/active/solved/error visual states, colored using the current city's `palette` (from step 3).

- [x] **6. Puzzle 1 — Airport code**
      MAP button hotspot opens the skyline+code overlay (correct + decoys). Input field validates against `airportCode`; correct entry shows `distanceRemaining` and advances `currentStep` to `eta`.

- [x] **7. Puzzle 2 — ETA**
      Read-only `speed`/`currentTime` fields, ETA input field, validated against the derived formula (with tolerance). Correct entry advances to `runway`.

- [x] **8. Puzzle 3 — Runway**
      Wind arrow indicator + draggable dial. Stability/hold logic against the tolerance window; correct hold auto-fills the runway field and advances to `combine`.

- [ ] **9. Puzzle 4 — Combine + win state**
      Final code input, validated against the concatenated format. Correct entry unlocks the LAND button; pressing LAND shows the win state.

- [ ] **10. Deploy + README**
      Deploy to Vercel/Netlify/GitHub Pages. README with local run instructions and the AI-usage note required by the challenge brief.
