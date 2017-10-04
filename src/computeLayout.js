import { select } from 'd3-selection';
import { boxes } from 'd3-boxes';

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

  const focusBox = {
    width: focus.width,
    height: mobile ? focusMobileHeight : windowBox.height - focus.top
  };

  const detailsBox = {
    width: details.width,
    height: mobile ? detailsMobileHeight : windowBox.height - details.top
  };

  const focusArrangement = boxes({
    orientation: 'vertical',
    children: [
      'srcStream',
      'timePanel',
      'destStream',
      'contextStream'
    ]
  }, {
    timePanel: { size: 0.1 },
    contextStream: { size: 0.1 }
  }, focusBox);

  return {
    focusBox,
    focusArrangement,
    detailsBox
  };
}
