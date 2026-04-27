## Goal

Replace the current Climate layout with a richer top-down cabin diagram where every climate control sits directly on the element it affects.

## New Cabin Layout

```text
+--------------------------------------------------+
|   [  WINDSCREEN  —  Front Defrost toggle  ]      |
|--------------------------------------------------|
|  [L-mirror]                          [R-mirror]  |  <- tap = mirror heat
|                                                  |
|   [Driver seat]   ⌬steering   [Passenger seat]   |
|    22.0° ♨●●○                  22.0° ♨●○○        |
|                                                  |
|--------------------------------------------------|
|   [Rear-L]      [Rear-Ctr]      [Rear-R]         |
|    21° ♨●○○      21° ♨●○○        21° ♨●○○        |
|--------------------------------------------------|
|   [  REAR WINDOW  —  Rear Defog toggle  ]        |
+--------------------------------------------------+
```

Header (above cabin, unchanged position): Auto • A/C • Recirc • Sync • Rear-Sync • Fan-speed (1–7 stepper) • Air-direction cycle.

The old left-side vertical fan slider is removed; fan speed becomes a compact horizontal stepper in the header.

## Controls placed on the cabin elements

- **Windscreen band (top)** — tap toggles front defogger.
- **Left/Right side mirrors** — small rounded tabs on the cabin's outer edges near the front; tap toggles that mirror's heating. A "Mirrors" chip in the header toggles both at once.
- **Steering wheel** — small wheel icon between/just inside the driver seat; tap toggles heated steering.
- **Driver seat** — temp ± buttons on the seat tile, heat-level dots (0–3) tap to cycle, vent direction indicator.
- **Passenger seat** — temp ± and heat dots; dimmed and mirrors driver when Sync is on.
- **Rear seats (3)** — each with own temp ± and heat dots; "Rear Sync" makes them share one temp.
- **Rear window band (bottom)** — tap toggles rear defogger.

Active zone gets a soft primary ring so the dial-controlled zone is visible.

## State changes (`InfotainmentContext.tsx`)

Extend `ClimateState`:
- `passengerTemp: number`
- `rearTemp: number`
- `frontSeatHeat: { driver: number; passenger: number }` (replace existing single `seatHeat`, default `{driver:1, passenger:0}`)
- `rearSeatHeat: [number, number, number]`
- `rearDefogger: boolean`
- `rearSync: boolean`
- `mirrorHeat: { left: boolean; right: boolean }`
- `fanSpeed: number` (default 3)
- `acOn: boolean` (default true)
- `autoMode: boolean`
- `recirculation: boolean`
- `airDirection: "face" | "feet" | "both" | "windshield"` (default "face")

`activeZone` widened to `"driver" | "passenger" | "rearL" | "rearC" | "rearR"`.

Dial mapping (Climate focus):
- Rotate cw/ccw → temp ± on `activeZone` (rear zones share `rearTemp` when `rearSync` is on).
- Left/Right → cycle `activeZone` through driver → passenger → rearL → rearC → rearR.
- Up → toggle steering heat.
- Down → toggle front defogger.
- Center → toggle Sync (front).

## Files to edit

1. `src/components/infotainment/ClimateAppView.tsx` — full rewrite: top-down cabin panel containing windscreen band, mirrors, steering wheel, 2 front seats, 3 rear seats, rear-window band; remove left fan slider; place each control on its element; lift state references from local to context.
2. `src/components/infotainment/InfotainmentContext.tsx` — extend `ClimateState` with the fields above, update defaults, update dial mapping to cycle `activeZone` across 5 zones and operate on the right temp.
3. `src/components/infotainment/ClimateWidget.tsx` — minor: read `temp` from the active zone so the taskbar widget keeps showing the correct value (no visual redesign).

## Visual / style

- Keep dark glassmorphism, mono uppercase mini-labels, `climate-warm` / `climate-cool` accents.
- Cabin is a single rounded panel; internal sections use subtle borders so the seats, mirrors, and windows feel like parts of one cabin rather than separate cards.
- Mirror tabs are small rounded rectangles attached to the outer cabin edge; steering-wheel icon sits inside the cabin near the driver seat.
- Active zone shows a soft primary ring.
