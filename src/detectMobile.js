// This is the width at which the Semantic UI Grid
// stacks the divs, changes to mobile layout.
const semanticUIBreakpoint = 768;

export default function detectMobile(windowBox) {
  return windowBox.width < semanticUIBreakpoint;
}
