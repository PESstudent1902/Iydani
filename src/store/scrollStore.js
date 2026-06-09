// Shared state between DOM (GSAP) and R3F (useFrame)
// Using a simple mutable object to avoid React re-render overhead at 60fps
export const scrollState = {
  progress: 0,         // 0 -> 1 overall page progress
  activeSection: 0,    // 0-3 (which section is in view)
  sectionProgress: 0,  // 0 -> 1 within the active section
  velocity: 0,         // scroll speed
};
