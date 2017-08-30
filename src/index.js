import { select } from 'd3-selection';
import detectMobile from './detectMobile';
const device = detectMobile() ? 'mobile' : 'desktop';
console.log('We are on a ' + device);

function resize() {

  // Extract the width and height that was computed by CSS.
  const focus = select('#focus').node().getBoundingClientRect();
  select('#focus svg')
      .attr('width', focus.width)
      .attr('height', window.innerHeight - focus.top)
      .style('background-color', 'pink');


  const detailsDiv = select('#details').node();
  select('#details svg')
      .attr('width', detailsDiv.clientWidth)
      .attr('height', detailsDiv.clientHeight)
      .style('background-color', 'pink');
}


// Draw for the first time to initialize.
resize();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", resize);
