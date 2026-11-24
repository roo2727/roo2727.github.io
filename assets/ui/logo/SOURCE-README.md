# LIFE — original lettering asset

- The four letters are extracted from the provided screenshot, not a replacement font. Native source canvas: 730 × 270 px. PNG layers share the exact full canvas; do not trim them. The edge matte is an approximation, and source resolution is not vector resolution.
- Night decorations are source-derived raster cutouts. Orbit lines are reconstructed SVG paths for stroke animation. Day lettering is recolored from the identical extracted pixels; the sun is a new vector.
- Composite order: arc-1.svg, arc-2.svg, L.png, I.png, F.png, E.png, center.png, orbit-star-1.png, orbit-star-2.png, left.png, right.png. `assembled.png` is reference only. `letters-only.png` is for reflection.
- Keep a single responsive 730:270 stage. Each layer is absolutely positioned inset:0, width/height:100%. Inline arc SVG (not an img) to animate its path with stroke-dasharray / stroke-dashoffset. Animate each letter separately with opacity and blur or a reveal mask. Keep lettering baseline and geometry fixed across themes.
- No background, START button, or reflection is baked into these layers.
