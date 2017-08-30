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
  const mobile = detectMobile();

  // Get the CSS-computed bounding boxes of the DIVs containing the SVGs.
  const focus = select('#focus').node().getBoundingClientRect();
  const details = select('#details').node().getBoundingClientRect();

  // Set the width to fill the DIV, on both mobile and desktop.
  // For desktop, set the heights to fill in all the available space.
  // For mobile, use fixed heights.
  select('#focus svg')
    .attr('width', focus.width)
    .attr('height', mobile ? focusMobileHeight : window.innerHeight - focus.top);
  select('#details svg')
    .attr('width', details.width)
    .attr('height', mobile ? detailsMobileHeight : window.innerHeight - details.top);
}


// Draw for the first time to initialize.
resize();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", resize);
