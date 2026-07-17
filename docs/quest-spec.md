# The Dark Beacons — Quest Spec (terminal mini-RPG)

User-approved design. Light fantasy, mild dev humor (seasoning, not the main course),
~5 minutes, ~15 scenes. Launched by the `quest` command in the interactive terminal;
runs in game mode (captures all input) until an ending or `quit`. All content lives in
a data structure (scenes/items/endings) so Stuart can extend it later.

## Premise

The kingdom's mountain-top signal beacons have gone dark one by one; no messages have
crossed the mountains in nine days. The old beacon-keeper arrives in the village at
night looking for someone young enough for the climb.

## Mechanics

- Numbered choices (player types 1/2/3). In-game commands: `bag` (inventory), `look`
  (reprint scene), `help` (game help), `quit` (confirm, then exit to shell).
- 3-slot inventory. Items: **rope** (village), **raven's feather** (Thornwood raven
  branch), **hot-springs map** (Thornwood riverbed branch), **dried meat** (first
  beacon search). Picking up a 4th item forces dropping one (prompt).
- Two d20 encounters, typed `roll` when prompted; print a small roll animation line
  (skipped under prefers-reduced-motion), e.g. `rolling... [d20] -> 14`.
- Autosave to localStorage (scene id + inventory + flags) after every scene;
  `quest` resumes, `quest reset` starts over.
- Flags: `fed_someone` (any food-kindness choice), `raven_favor`, `knows_name`.

## Scene graph

1. **village-night** — keeper arrives, briefing. Choices: [1] accept and pack (go 2),
   [2] ask about the beacons first (flavor: "nine days of silence and suddenly
   everyone remembers the beacons exist" — then go 2).
2. **packing** — take ONE from your shed: [1] rope (+rope), [2] your father's old
   lantern (flavor: it flickers; mostly sentimental), [3] a loaf for the road
   (+bread, counts as food).
3. **thornwood-gate** — three ways through: [1] the main path (go 4), [2] the dry
   riverbed (go 5), [3] follow the raven calling from the fence post (go 6).
4. **thornwood-path** — wolf tracks, a torn keeper's satchel. Foreshadowing. (go 7)
5. **thornwood-riverbed** — smooth stones, warm mist rising from a side gully; find a
   waxed **hot-springs map** tucked in a dead ranger's cairn (+map, respectful flavor
   line). (go 7)
6. **thornwood-raven** — the raven wants your food and precise phrasing. If you share
   food: +raven_favor, +fed_someone, and it gives a **feather** ("for the cold one,"
   it says) +knows_name. If you phrase your request sloppily it makes you repeat it,
   exactly. Mild humor: it will not repeat a message unless you say it exactly right.
   (go 7)
7. **first-beacon** — abandoned mid-meal, fire cold. Logbook final entry: "fire low.
   will fix tomorrow." Choices: [1] search the tower (+dried meat; if inventory full,
   drop prompt) (go 8), [2] read the whole logbook (flavor: weeks of "all quiet"
   entries, then go 8), [3] press on (go 8).
8. **high-pass** — ENCOUNTER 1: wolves on the scree. Options: [1] stand and swing
   (roll d20, 10+ wins; win go 9, fail go 8b), [2] throw the dried meat (needs meat:
   auto-success, +fed_someone, go 9), [3] climb the scree wall (needs rope: auto-
   success, go 9; without rope: roll 14+, fail go 8b).
9. **8b. defeat-tumble** — you wake bruised at the first beacon; the wolves took one
   item (random). Retry the pass. (Checkpoint respawn, not a game over.)
10. **summit-approach** — the last beacon tower, snow, a deep warm glow inside where
    fire-wood should be stacked. (go 11)
11. **summit-reveal** — a young dragon, wings wrapped around itself, scales dull with
    cold. It has been eating the signal fires to stay warm. It watches you. Choices
    shown based on state:
    - [1] **Drive it off** — ENCOUNTER 2, roll d20 (12+): win → ending-drove; fail →
      knocked to the gates (respawn scene 10, lose nothing; the dragon seems sorry).
    - [2] **Offer the hot-springs map** (requires map) → ending-relocate.
    - [3] **Speak its name and share what food you carry** (requires knows_name AND
      fed_someone flag or any food item) → ending-befriend.
    - [4] Back away and think (reprints scene, hint from keeper's notes if the player
      lacks items: "the old keepers wrote: a fed dragon is a listening dragon").
12. **ending-drove** — beacon relit tonight; the realm's messages fly again. "You
    watch the dark shape glide north and wonder where it will keep warm." (bittersweet)
13. **ending-relocate** — it studies the map, chirps once, and is gone by morning;
    you relight the beacon. Solid, honest win.
14. **ending-befriend** (best) — the dragon curls around the beacon basin; its breath
    keeps the fire lit through any storm. The keeper makes it official: the beacon
    has a new keeper. "The fire never goes cold again."
15. **epilogue** (all endings) — one closing line + gentle tie-back, e.g.:
    "quest complete. endings found: N/3. (You seem good at fixing things nobody else
    could reach. `open contact` if you know someone hiring.)" Then release game mode.

## Voice rules

- Fantasy plays it straight; humor is dry and infrequent (keeper's grumbling, the
  logbook entry, the pedantic raven). NO puns like "Mount Deploy". No machines.
- No em dashes in any output. Body of scene text is plain sentences, 2-4 lines max
  per scene print. Choices are short imperative lines.
- The dragon never speaks. It is cold, young, and dignified.

## A11y / integration

- Runs entirely through the existing terminal I/O (aria-live output, real input).
- `quest` listed in `help` as "quest - a small adventure (5 min)". 404 page hint line:
  "lost, traveler? try 'quest'".
- Reduced motion: no roll animation, instant text.
- Endings tracked in localStorage (endings found N/3 in epilogue).
