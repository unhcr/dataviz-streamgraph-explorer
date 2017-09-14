import ReactiveModel from 'reactive-model';
import { select } from 'd3-selection';
import resize from './resize';
import computeLayout from './computeLayout';
import detectMobile from './detectMobile';
import apiSimulation from './apiSimulation';
import StreamGraph from './streamGraph';
import typeSelector from './typeSelector';
import reduceData from './reduceData';
import { parseParams, encodeParams } from './router';

// Scaffold DOM structure.
const focusSVG = select('#focus').append('svg');
const detailsSVG = select('#details').append('svg');

// Set background color to be pink so we can see the SVGs (temporary).
focusSVG.style('background-color', 'pink');
detailsSVG.style('background-color', 'pink');

// The reactive data flow graph for the application.
const dataFlow = ReactiveModel();

// TODO derive this from the data.
dataFlow('availableTypes', [
  'Refugees (incl. refugee-like situations)',
  'Returnees',
  'Internally displaced persons',
  'Returned IDPs',
  'Others of concern',
  'Asylum-seekers',
  'Stateless'
]);

// This property is set on page load, and when the URL changes.
dataFlow('urlIn', location.hash);

// Parse the parameters from the URL hash.
dataFlow('paramsIn', parseParams, 'urlIn');

// The selected population types.
// Initialized to the parameters from the URL hash.
// This changes when the user interacts with the type selector.
dataFlow('types', paramsIn => {

  // If no types are specified in the route,
  // then set the selected types to all available types.
  return paramsIn.types || dataFlow.availableTypes();
}, 'paramsIn');

// The currently selected source and destination.
// These are initialized to values from the URL hash.
// These change when clicking on areas in the StreamGraphs.
dataFlow('src', d => d.src, 'paramsIn');
dataFlow('dest', d => d.dest, 'paramsIn');

// The query object that gets passed into the API (or API simulation)
// that fetches the filtered and aggregated data for source and destination streams.
dataFlow('apiQuery', (types, src, dest) => ({
  src,
  dest,
  types
}), 'types, src, dest');

// The response that comes back from the API,
// an object containing properties 'srcData' and 'destData'.
dataFlow('apiResponse');

// An object with 'width' and 'height' properties
// representing the dimensions of the browser window.
dataFlow('windowBox');

// When the page loads or the browser resizes,
// detect if we're on desktop or mobile,
// and put the browser window box into the data flow graph.
resize(dataFlow.windowBox);

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

// Reduce the data to show only the largest areas.
dataFlow('srcDataReduced', reduceData, 'srcData');
dataFlow('destDataReduced', reduceData, 'destData');

// Render the source and destination StreamGraphs.
dataFlow((srcDataReduced, srcStreamBox, destDataReduced, destStreamBox) => {
  focusSVG.call(StreamGraph, [
    {
      data: srcDataReduced,
      box: srcStreamBox,
      onStreamClick: dataFlow.src
    },
    {
      data: destDataReduced,
      box: destStreamBox,
      onStreamClick: dataFlow.dest
    }
  ]);
}, 'srcDataReduced, srcStreamBox, destDataReduced, destStreamBox');

// Render the type selector buttons.
dataFlow('typeSelector', (types, availableTypes) => {
  select('#typeSelector').call(typeSelector, {
    availableTypes,
    selectedTypes: types,
    onReset: () => dataFlow.types(availableTypes),
    onChange: dataFlow.types
  });
}, 'types, availableTypes');

// Set up routing to synchronize URL hash parameters with dataflow.


// This property is set when parameter properties update
dataFlow('paramsOut', (src, dest, types) => ({
  src, dest, types
}), 'src, dest, types');

dataFlow('urlOut', paramsOut => {
  location.hash = encodeParams(paramsOut);
}, 'paramsOut');
