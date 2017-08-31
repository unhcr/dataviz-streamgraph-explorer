import { select } from 'd3-selection';

// These values determine the height of each SVG on mobile devices.
const focusMobileHeight = 500;
const detailsMobileHeight = 500;

// Computes the layout (SVG sizes) based on
// whether or not we're on a mobile device,
// and the size of the browser window.
export default function layout(mobile, windowBox) {

  // Get the CSS-computed bounding boxes of the DIVs containing the SVGs.
  const focus = select('#focus').node().getBoundingClientRect();
  const details = select('#details').node().getBoundingClientRect();

  return {
    focusBox: {
      width: focus.width,
      height: mobile ? focusMobileHeight : windowBox.height - focus.top
    },
    detailsBox: {
      width: details.width,
      height: mobile ? detailsMobileHeight : windowBox.height - details.top
    }
  };
}
