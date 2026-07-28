# General Concept

The player is seated in the pilot seat of a commercial airplane
approaching one of three randomly-selected destinations (Barcelona, Paris,
Athens).
The emergency flight computer has data needed to
land. The player recovers it through four puzzles, enters it
at the landing console, and lands.

The destination is randomly selected when the game begins and the player
never chooses it manually. Game mechanics stay identical across destinations, only the artwork changes.

# 3D Experience

The experience takes place entirely inside a single aircraft cockpit.

The player remains seated in the pilot's seat and can freely look around the cockpit using the mouse.

Instead, the cockpit acts as an interactive control room containing multiple clickable displays and instrument panels.

The 3D environment provides immersion, while the puzzles drive gameplay.

# Game Flow

Some timer is running. The user has 4 minutes to complete all the games and retrieve the landing information. When the timer runs out, a game over screen is shown (the plane is out of control).

**First — Airport code.** A "MAP" button displays several skylines, each with its airport code. The user matches the skyline visible outside the cockpit to the correct one on the map, enters that airport code in the according field, and an inline field shows the distance remaining. Hint: "Get airport code"

**Second — ETA.** A numerical field shows speed, and a numerical field shows current time. The user calculates ETA as current time + (distance remaining / speed), then inputs the ETA in the ETA field. Hint: "Calculate ETA"

**Third — Runway number.** A field with an arrow shows the wind direction. The user adjusts the direction of the plane via a draggable dial; the change of direction automatically changes some light which will appear green when the direction is stable. This automatically inputs in runway number filed the according value. Hint: "Find runway number"

**Last — Combine.** All fields combine in the last code entry, which then allows the user to press "LAND". Hint shows the required format for combining the values. Hint: "Input landing data XXX-XX:XX-XX"

Every field is linked to a step and lights up only when the previous step is finished. Fields change color according to their activation status. An incorrect entry does not unlock the next step; time keeps counting down.

A console displays the hint for the current step, updating as the player progresses.

Once the data is input into the landing console, user presses "LAND".

A "RESET" button allows the user to try again (and land in a new destination).

# Technical Inputs

The application will be built using React and TypeScript, following the same frontend technology stack as Crossmint.

We will use a Sketchfab cockpit model rendered with Babylon.js to create an immersive 3D environment. The camera remains fixed in the pilot's seat while allowing the player to look around freely. React manages the UI, game state, and puzzle logic, with gameplay centred on interacting with clickable cockpit controls and displays.

The cockpit experience will be themed according to a configurable city profile. Each city will define its own background skyline image, colour palette, and visual design, which will be applied consistently across the cockpit and all puzzle interfaces. City-specific configuration and images will be centralised in a single file, making it easy to add or update cities without touching the core application or puzzle logic.

# Objective

The project should prioritise **simple implementation**, **clean architecture**, **modularity**, and **minimal code**.
