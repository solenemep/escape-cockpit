# Escape Cockpit

A 3D browser escape room: you're in the pilot's seat of a plane approaching one of three random destinations (Barcelona, Paris, Athens). Solve 4 puzzles to recover the landing data before the timer runs out, then land.

**Live demo:** https://escape-cockpit.netlify.app/

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`). Look around with the mouse (yaw only, clamped) — no other controls needed.

Other scripts:

```bash
npm run build    # type-check + production build
npm run preview  # serve the production build locally
```

## How to play

You have **4 minutes** (top-left timer) to recover the landing data before the plane is out of control.

The **console** (bottom-center) drives the whole game: it always shows the hint for whatever you're currently solving, plus the input for that puzzle. Solved/locked progress is tracked in the field grid bottom-left; reference data you'll need along the way lights up in the grid bottom-right as it becomes relevant.

1. **Airport code** (observation) — a post-it note (top-right) shows the correct skyline and code alongside two decoys. Match it to the skyline visible through the cockpit window, then type the code into the console.
2. **ETA** (logic) — solving the airport code reveals `DISTANCE REMAINING` (bottom-right). Compute `time + distance / speed` (the **CALC** tool, bottom-right, helps with the math) and type the result as `HH:MM`.
3. **Runway** (interaction) — `WIND DIRECTION` (bottom-right) lights up. Drag the dial shown in the console to match that heading and hold it steady (~2s) until the light turns green; the runway field fills in on its own.
4. **Combine** (combination) — type the final code in the format shown in the hint (airport code – ETA – runway). Getting it right lands the plane and ends the run.

## Answers

Spoilers, for testing or if you're stuck.

| City      | Airport code (type) | ETA (type) | Runway heading (dial to) | Combine (type) |
| --------- | ------------------- | ---------- | ------------------------ | -------------- |
| Barcelona | `BCN`               | `14:31`    | `90°`                    | `BCN-14:31-09` |
| Paris     | `CDG`               | `20:10`    | `270°`                   | `CDG-20:10-27` |
| Athens    | `ATH`               | `08:42`    | `140°`                   | `ATH-08:42-14` |

Runway isn't typed — drag the dial to the listed heading (±5° tolerance) and hold for 2s; the runway field fills in automatically. ETA is accepted within ±1 minute.

## Architecture

```
src/
  App.tsx                — top-level layout; wires useGameState() to the UI
  gameState.ts           — state machine: step/answers/timer, submitAnswer + one submit* per puzzle
  config/
    cityConfig.ts        — per-city data (CityConfig), palette → status-color map, computeEta/Runway/Combine
    gameConfig.ts        — GameStep/DataStatus/FieldStatus types, REQUIRED_FIELDS + AUX_FIELDS, hint text
  components/            — presentational pieces: LandingData, FieldGrid, HintConsole, PuzzleInput, RunwayPuzzle, Calculator, MapPostIt, IntroBanner, EndScreen, ResetButton, TimerCountdown
  scene/CockpitScene.tsx — Babylon.js scene: cockpit model, fixed/clamped camera, city skyline background
  styles/
    panel.ts             — shared bordered-panel style, palette-driven
    field-animations.css — solved-pulse and active-point animations for LandingData fields
```

Data flow is one-directional: `CityConfig` (in `cityConfig.ts`) is the single source of truth per destination — it feeds the 3D background, every puzzle's correct answer, and the UI palette. `useGameState()` owns all mutable state and exposes derived, ready-to-render arrays (`requiredFieldStatuses`, `auxFieldStatuses`) plus one `submit*` function per puzzle; `App.tsx` and the components underneath are otherwise stateless, just rendering what the hook gives them.

## Design decisions

- **Stack**: React + TypeScript + Vite, Babylon.js for the 3D cockpit/scene — no game engine needed for a single static scene with a few draggable/clickable UI elements.
- **One `CityConfig` per destination** instead of separate data files/branches per city: adding a 4th destination is editing one array entry, never touching puzzle logic.
- **Palette-driven UI, no hardcoded status colors**: each panel's locked/active/solved/available color comes from the current city's palette, so every destination reads as visually distinct without any component knowing city-specific colors.
- **Animated feedback, not just color**: a field pulses in its own status color the instant it's newly solved, and reference fields get a small moving light while they're the one relevant to the current puzzle — `LandingData` detects both by watching its own `value`/`status` props, no extra game state needed.
- **2D UI overlay over the 3D canvas**, rather than in-world/billboarded panels: simpler to build and iterate on, and the camera's yaw range is narrow enough that fixed screen-space panels never feel disconnected from the scene.

## AI usage

Built with Claude Code, following a spec-first workflow — the process is preserved in the repo itself:

- [`[1] instructions.md`](<[1] instructions.md>) — the original challenge brief, saved for reference.
- [`[2] concept.md`](<[2] concept.md>) — the game's concept/design, written by hand (theme, story, puzzle ideas).
- [`[3] specs.md`](<[3] specs.md>) — a detailed technical spec, generated by AI from the concept above, then reviewed and corrected.
- [`[4] plan.md`](<[4] plan.md>) — an agile-style implementation plan generated by AI from the spec: small, independently shippable steps, each leaving the app in a runnable state before moving to the next.
- Implemented each step with AI assistance, reviewing and steering the generated code at every step rather than accepting it blindly — several bugs were caught and fixed this way, along with refactoring and a fair number of different implementation-choice changes as the design got clearer in practice.
- Committed after each completed step, one commit per step (`step 1` … `step 10`), so the history reads as a sequence of working increments.

Where AI helped most:

- Getting productive fast in genuinely unfamiliar territory — first time working with Babylon.js and a 3D cockpit scene; AI made that ramp-up far quicker than starting from docs cold.
- Automating the repetitive parts of UI/CSS work (layout, panel styling, palette wiring), so iteration on design stayed fast instead of hand-typing every style object.
- Scaffolding new pieces from a description (a puzzle component, a config helper) and mechanical refactors.
