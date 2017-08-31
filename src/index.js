import ReactiveModel from 'reactive-model';
import { select } from 'd3-selection';
import resize from './resize';
import computeLayout from './computeLayout';
import detectMobile from './detectMobile';

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
dataFlow('layout', computeLayout, 'mobile, windowBox');

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

// Start the Web Worker that simulates the API.
const apiSimulationWorker = new Worker('dist/apiSimulationWorker.js');

apiSimulationWorker.postMessage(['test']);

apiSimulationWorker.onmessage = e => {
  console.log(e.data);
}
