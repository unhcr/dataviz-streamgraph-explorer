import { select } from 'd3-selection';
import detectMobile from './detectMobile';

// These values determine the height of each SVG on mobile devices.
const focusMobileHeight = 500;
const detailsMobileHeight = 500;

// Set background color to be pink so we can see the SVGs (temporary).
select('#focus svg').style('background-color', 'pink');
select('#details svg').style('background-color', 'pink');

// This function gets called on load and on browser resize.
function resize() {

  // Detect if we're on desktop or mobile.
  const device = detectMobile() ? 'mobile' : 'desktop';

  // Get the CSS-computed bounding boxes of the DIVs containing the SVGs.
  const focus = select('#focus').node().getBoundingClientRect();
  const details = select('#details').node().getBoundingClientRect();

  const focusSVG = select('#focus svg');
  const detailsSVG = select('#details svg');

  // Set the width to fill the DIV, on both mobile and desktop.
  focusSVG.attr('width', focus.width);
  detailsSVG.attr('width', details.width);

  // For desktop, set the heights to fill in all the available space.
  if (device === 'desktop') {
    focusSVG.attr('height', window.innerHeight - focus.top);
    detailsSVG.attr('height', window.innerHeight - details.top);
  }
  
  // For mobile, use fixed heights.
  if (device === 'mobile') {
    focusSVG.attr('height', focusMobileHeight);
    detailsSVG.attr('height', detailsMobileHeight);
  }
}


// Draw for the first time to initialize.
resize();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", resize);
