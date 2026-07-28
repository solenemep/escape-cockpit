# Specs

## Global State Machine

Steps: `airport → eta → runway → combine → won` (plus `game_over`, reachable from any step when the timer hits 0).

- Only the field for `currentStep` accepts input. Earlier fields are solved (green, read-only). Later fields are locked (gray).
- Wrong submission: field flashes an error state and clears; `currentStep` does not advance; timer is unaffected (it was already running).
- Timer: 240s countdown, always running from game start, independent of puzzle progress. Reaching 0 → `game_over`, regardless of `currentStep`.
- Win: submitting the correct combined code unlocks **LAND**; pressing it → `won`.
- `RESET` (available from `won` or `game_over`, or mid-game): re-randomizes the destination and restarts the state machine and timer.

## City Config (data model)

One object per destination (Barcelona, Paris, Athens), centralized in a single config file:

- `id`, `name`
- `airportCode` — 3-letter code
- `skyline` — correct skyline image
- `decoys` — array of `{ code, skyline }` from the other cities, shown alongside the correct one on the MAP
- `distanceRemaining` — nm
- `speed` — knots
- `currentTime` — in-fiction clock time at game start
- `windDirection` — degrees, determines the correct runway
- `palette` — `{ primary, accent, background }` hex values; applied to field highlight colors, hint console styling, and the skyline plane's lighting/tint so each city reads as visually distinct

Derived (computed once from the above, not stored): `eta = currentTime + distanceRemaining / speed`, `runway = round(windDirection / 10)` zero-padded to 2 digits.

## Puzzle 1 — Airport code (Observation)

- "MAP" button opens an overlay listing the correct skyline + code alongside decoys from the other two cities.
- Input: text field, matched case-insensitively against `airportCode`.
- Correct → field turns green, `distanceRemaining` field populates, unlocks Puzzle 2.

## Puzzle 2 — ETA (Logic)

- Read-only fields: `speed`, `currentTime`. Input field: ETA.
- Expected value: `eta` (see derived above), formatted `HH:MM`. Compare with small tolerance (e.g. ±1 min) to allow for rounding.
- Correct → unlocks Puzzle 3.

## Puzzle 3 — Runway (Interaction)

- Wind arrow indicator displays `windDirection` (fixed for the run).
- Draggable dial sets a heading value.
- Target = `runway * 10` (±5° tolerance). Dial must stay within tolerance for a short continuous hold (e.g. 2s) before the light turns green.
- On stable/correct hold → runway field auto-fills with `runway`, unlocks Puzzle 4.

## Puzzle 4 — Combine (Combination)

- Single input field. Hint reveals the literal format: `XXX-XX:XX-XX` (airport code – ETA – runway).
- Expected: `${airportCode}-${eta}-${runway}`.
- Correct → unlocks **LAND** button. Pressing it → win state.

## Scene & Camera

- Camera position is fixed at the pilot seat — no translation, ever.
- Rotation is yaw-only (look left/right), clamped to a limited arc (e.g. ±60° from forward) so the player can't look behind the seat. Pitch and roll are locked — no tilting up/down, no banking.
- Babylon.js: `ArcRotateCamera` pinned at a fixed target/radius, with `lowerAlphaLimit`/`upperAlphaLimit` constraining yaw and `lowerBetaLimit === upperBetaLimit` locking pitch. Panning and zoom disabled.

## Rendering Layers (back to front)

1. **Skyline background** — a plane (or simple skybox) visible through the cockpit windows, textured with the current city's skyline image. Static; no parallax needed since the camera never translates.
2. **Cockpit model** — the 3D cockpit mesh, containing the interactive hotspots (MAP button, dial, runway light, console/LAND button) as identifiable named meshes/pivots.
3. **UI overlay** — a 2D HTML/CSS layer (React) rendered on top of the Babylon canvas for text fields, the hint console, and numeric readouts. Positioned either as fixed screen-space panels, or projected from each hotspot's 3D world position to screen-space so overlays stay aligned if the camera rotates.

## Cockpit Model

- **"Aircraft Cockpit"** by Vince Dulay — [sketchfab.com/3d-models/aircraft-cockpit-cb91a0ff44194a0e9982e81774d881f0](https://sketchfab.com/3d-models/aircraft-cockpit-cb91a0ff44194a0e9982e81774d881f0)
- Check the model's license on the Sketchfab page before downloading/redistributing (attribution requirements, commercial-use terms).
- Download as glTF/GLB from Sketchfab (Download → glTF) and load via Babylon.js `SceneLoader`, rather than embedding the Sketchfab iframe — the iframe viewer doesn't give us access to individual meshes for hotspots or camera control.
- Needs a forward-facing window for the skyline layer, and separable meshes for the 4 hotspots (MAP button, dial, runway light, console/LAND button) — inspect the downloaded mesh hierarchy first; may need light editing (e.g. in Blender) to tag/split parts if they aren't already separate.

## Manual Assets

- **Skyline images** — one per city (3 total), flat texture behind the cockpit window. Suggested: 2048×1024 JPG/PNG, aspect matching the window opening.
- **Background/skybox** — a visual is needed here too; a single flat skyline plane is sufficient since the camera never translates and only yaws within a limited arc. Suggested: 2048×1024 JPG/PNG.
- **Palette** — no image asset; 3 hex values per city, defined alongside the rest of `CityConfig`.
- All city assets centralized under one folder (e.g. `/assets/cities/{cityId}/`) alongside `cities.ts`, per concept.md's "centralised, single file" requirement.

### External files needed (manual input)

- 3× skyline images (one per city), 2048×1024 JPG/PNG
- 3× background/skybox images (one per city), 2048×1024 JPG/PNG
- Cockpit model, downloaded as glTF/GLB from the Sketchfab link above

## Architecture notes

Keeping with the "simple, clean, modular, minimal code" objective:

- A single `GameState` (React context or small reducer) holds: `currentStep`, `timer`, per-puzzle solved values, and the selected `CityConfig`.
- City configs live in one file (e.g. `cities.ts`), matching the "centralised, easy to extend" requirement in concept.md.
- Each puzzle is a self-contained component that receives its slice of `CityConfig` plus an `onSolve` callback; a parent orchestrator owns step-gating, field coloring, and hint text — puzzle components don't know about each other.
- The Babylon.js scene exposes clickable meshes (MAP button, dial, console, LAND button) that call back into React via a thin event bridge; no game logic lives in the 3D layer.
