# Add a subtle border to the display area

## Goal
Add a thin, subtle border around the 16:9 display area so it visually separates from the surrounding control cluster background while keeping the seamless dark automotive aesthetic.

## Current state
In `src/pages/Index.tsx` the display area is a centered 16:9 container with a solid dark background (`hsl(220 22% 5%)`) and no border. The control cluster below uses the same background color, so the display area currently blends in without definition.

## Proposed change
1. In `src/pages/Index.tsx`, add a subtle border to the inner 16:9 display container.
   - Use `border border-border/30` (or similar low-opacity border token) to keep it understated.
   - Optionally add a very subtle shadow or rounded corners (`rounded-lg` or `rounded-xl`) if needed to match the glassmorphism style.
   - Ensure the border does not affect the 16:9 aspect ratio or internal layout.

## Acceptance criteria
- The display area has a visible but subtle border in the preview.
- The border color uses existing semantic tokens and respects the dark theme.
- No other layout, aspect ratio, or interactive behavior changes.
