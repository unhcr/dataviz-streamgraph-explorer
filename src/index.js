import ReactiveModel from 'reactive-model';
import { select } from 'd3-selection';
import resize from './resize';
import computeLayout from './computeLayout';
import detectMobile from './detectMobile';
import apiSimulation from './apiSimulation';
import StreamGraph from './streamGraph';

// Scaffold DOM structure.
const focusSVG = select('#focus').append('svg');
const srcStreamG = focusSVG.append('g');
const destStreamG = focusSVG.append('g');
const detailsSVG = select('#details').append('svg');

// Set background color to be pink so we can see the SVGs (temporary).
focusSVG.style('background-color', 'pink');
detailsSVG.style('background-color', 'pink');


// The reactive data flow graph for the application.
const dataFlow = ReactiveModel();

// An object with 'width' and 'height' properties
// representing the dimensions of the browser window.
dataFlow('windowBox');

// The query object that gets passed into the API (or API simulation)
// that fetches the filtered and aggregated data for source and destination streams.
// TODO derive this from the URL via data flow graph.
dataFlow('apiQuery', { src: null, dest: null, types: null });

// The response that comes back from the API,
// an object containing properties 'srcData' and 'destData'.
dataFlow('apiResponse');

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

// Compute the boxes for the srcStream and destStream.
dataFlow('srcStreamBox', focusBox => ({
  x: 0,
  y: 0,
  width: focusBox.width,
  height: focusBox.height / 2
}), 'focusBox');
dataFlow('destStreamBox', focusBox => ({
  x: 0,
  y: focusBox.height / 2,
  width: focusBox.width,
  height: focusBox.height / 2
}), 'focusBox');

// Resize the SVG elements based on the computed layout.
dataFlow('focusSVGSize', focusBox => {
  focusSVG
    .attr('width', focusBox.width)
    .attr('height', focusBox.height);
}, 'focusBox');
dataFlow('detailsSVGSize', detailsBox => {
  detailsSVG
    .attr('width', detailsBox.width)
    .attr('height', detailsBox.height);
}, 'detailsBox');

//TODO change this one line to use the real API when it's ready.
const api = apiSimulation;

// Post a message to the worker containing the API query
// whenever the API query changes.
dataFlow('apiRequest', api.sendRequest, 'apiQuery');

// Receive the asynchronous response from the API simulation
// and pass it into the data flow graph.
api.onResponse(dataFlow.apiResponse);

// Unpack the API response into the data flow graph.
dataFlow('srcData', d => d.srcData, 'apiResponse');
dataFlow('destData', d => d.destData, 'apiResponse');

// Test that everything worked (temporary).
dataFlow('testing', (srcData, destData) => {
  console.log("Data aggregated by source");
  console.log(srcData);
  console.log("Data aggregated by destination");
  console.log(destData);
}, 'srcData, destData');

dataFlow('srcStream', (data, box) => {
  srcStreamG.call(StreamGraph, {data, box});
}, 'srcData, srcStreamBox');
