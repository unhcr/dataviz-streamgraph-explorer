import ReactiveModel from 'reactive-model';
import { select } from 'd3-selection';
import { json } from 'd3-request';
import resize from './resize';
import detectMobile from './detectMobile';
import unpackData from './unpackData';

// The reactive data flow graph for the application.
const dataFlow = ReactiveModel();

// An object with 'width' and 'height' properties
// representing the dimensions of the browser window.
dataFlow('windowBox');

// When the page loads or the browser resizes,
// detect if we're on desktop or mobile,
// and put the browser window box into the data flow graph.
resize(() => {
  dataFlow.windowBox({
    width: window.innerWidth,
    height: window.innerHeight
  });
});

// True if we're in a mobile device, false if desktop.
// Computed based on the 'windowBox' value.
dataFlow('mobile', detectMobile, 'windowBox');

// Compute the layout object, which contains the computed dimensions
// for the focus and details views, as 'focusBox' and 'detailsBox'.
dataFlow('layout', (mobile, windowBox) => {

  // These values determine the height of each SVG on mobile devices.
  const focusMobileHeight = 500;
  const detailsMobileHeight = 500;

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
}, 'mobile, windowBox');

// Unpack the layout object into the data flow graph.
dataFlow('focusBox', layout => layout.focusBox, 'layout');
dataFlow('detailsBox', layout => layout.detailsBox, 'layout');

// Resize the SVG elements based on the computed layout.
dataFlow('focusSVGSize', focusBox => {
  select('#focus svg')
    .attr('width', focusBox.width)
    .attr('height', focusBox.height);
}, 'focusBox');

dataFlow('detailsSVGSize', detailsBox => {
  select('#details svg')
    .attr('width', detailsBox.width)
    .attr('height', detailsBox.height);
}, 'detailsBox');

// Set background color to be pink so we can see the SVGs (temporary).
select('#focus svg').style('background-color', 'pink');
select('#details svg').style('background-color', 'pink');

// Load and unpack the data.
json('data/data.json', packedData => {
  console.log(unpackData(packedData));
});
