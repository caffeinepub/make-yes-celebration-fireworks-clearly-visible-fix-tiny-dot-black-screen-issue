# Specification

## Summary
**Goal:** Make the “YES” celebration fireworks clearly visible and ensure the fireworks overlay remains transparent (not a black screen) while keeping the UI readable.

**Planned changes:**
- Adjust fireworks particle rendering so bursts start bright and visible (fix alpha/opacity/lifespan behavior and tune brightness/size for common desktop and mobile screens).
- Update canvas/overlay compositing so it does not appear as a solid black overlay; keep underlying YES text and couple image readable during the effect.
- Preserve existing mobile performance scaling and ensure fireworks fully stop/clean up after the 10-second celebration window (no lingering timers/animations).

**User-visible outcome:** After clicking “YES,” users see clearly visible fireworks bursts without the screen turning black, and the celebration text/image remain readable while the animation runs smoothly and stops cleanly.
