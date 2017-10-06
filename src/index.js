import ReactiveModel from 'reactive-model';
import { extent } from 'd3-array';
import { select } from 'd3-selection';
import { scaleTime } from 'd3-scale';
import resize from './resize';
import computeLayout from './computeLayout';
import detectMobile from './detectMobile';
import apiSimulation from './apiSimulation';
import StreamGraph from './streamGraph';
import timePanel from './timePanel';
import typeSelector from './typeSelector';
import reduceData from './reduceData';
import { parseParams, encodeParams } from './router';
import dateFromYear from './dateFromYear';
import selectedYearLine from './selectedYearLine';
import detailsPanel from './detailsPanel';
import setIfChanged from './setIfChanged';
import contextStream from './contextStream';
import contextStreamData from './contextStreamData';

// Scaffold DOM structure.
const focusSVG = select('#focus').append('svg');
const focusTimePanelLayer = focusSVG.append('g');
const focusStreamGraphLayer = focusSVG.append('g');
const focusSelectedYearLayer = focusSVG.append('g');

const detailsSVG = select('#details').append('svg');

// The reactive data flow graph for the application.
const dataFlow = ReactiveModel();

// The currently selected year.
dataFlow('year', 2016);

// The full time extent.
dataFlow('timeExtent', [1951, 2016].map(dateFromYear));

// The list of all population types available for filtering.
dataFlow('availableTypes', [
  'Refugees (incl. refugee-like situations)',
  'Returnees',
  'Internally displaced persons',
  'Returned IDPs',
  'Others of concern',
  'Asylum-seekers',
  'Stateless'
]);

// Note that 'year', 'timeExtent', and 'availableTypes' are hard-coded,
// and not derived from the data. This is intentional, as the
// years and types present in the data may vary,
// depending on the query parameters.

// The margin defining spacing around the inner visualization rectangle
// for the focus SVG (srcStream, destStream, timePanel).
dataFlow('focusMargin', { top: 0, bottom: 0, left: 0, right: 15 });

// This property is set on page load, and when the URL changes.
dataFlow('urlIn', location.hash);

// Make the back and forward buttons work by listening to hash change.
// Ignore hash changes that resulted from urlOut changing.
window.onhashchange = () => {
  if(location.hash.substr(1) !== dataFlow.urlOut()){
    dataFlow.urlIn(location.hash);
  }
};

// Parse the parameters from the URL hash.
dataFlow('paramsIn', parseParams, 'urlIn, availableTypes');

// The selected population types.
// Initialized to the parameters from the URL hash.
// This changes when the user interacts with the type selector.
dataFlow('types', paramsIn => {

  // If no types are specified in the route,
  // then set the selected types to all available types.
  return paramsIn.types || dataFlow.availableTypes();
}, 'paramsIn');

// The currently selected source, destination, and zoom.
// These are initialized to values from the URL hash.
// These change when clicking on areas in the StreamGraphs,
// or brushing to change zoom.
dataFlow('src', d => d.src, 'paramsIn');
dataFlow('dest', d => d.dest, 'paramsIn');
dataFlow('zoom', d => d.zoom, 'paramsIn');

// Render the selected year in the details panel.
dataFlow(year => {
  select('#details-selected-year').text(year);
}, 'year');

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
dataFlow('focusArrangement', layout => layout.focusArrangement, 'layout');
dataFlow('srcStreamBox', d => d.srcStream, 'focusArrangement');
dataFlow('destStreamBox', d => d.destStream, 'focusArrangement');
dataFlow('contextStreamBox', d => d.contextStream, 'focusArrangement');

// The time panel box should include the srcStream and descStream boxes.
dataFlow('timePanelBox', d => {
  return {
    x: 0,
    y: 0,
    width: d.srcStream.width,
    height: d.destStream.y + d.destStream.height
  };
}, 'focusArrangement');

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
const api = apiSimulation({ useWebWorker: false });

// Receive the asynchronous response from the API simulation
// and pass it into the data flow graph.
api.onResponse(dataFlow.apiResponse);

// Post a message to the worker containing the API query
// whenever the API query changes.
dataFlow('apiRequest', api.sendRequest, 'apiQuery');

// Unpack the API response into the data flow graph.
dataFlow('srcData', d => d.srcData, 'apiResponse');
dataFlow('destData', d => d.destData, 'apiResponse');

dataFlow('detailsPanel', (year, srcData, destData) => {
  detailsSVG.call(detailsPanel, year, srcData, destData);
}, 'year, srcData, destData')

// Reduce the data to show only the largest areas.
dataFlow('srcDataReduced', reduceData, 'srcData');
dataFlow('destDataReduced', reduceData, 'destData');

// The X scale that is common to all components in the focus panel.
dataFlow('focusXScale', (() => {
  const xScale = scaleTime();
  return (timeExtent, zoom, box, margin) => {
    const innerWidth = box.width - margin.right - margin.left;
    return xScale
      .domain(zoom ? zoom : timeExtent)
      .range([margin.left, innerWidth]);
  };
})(), 'timeExtent, zoom, focusBox, focusMargin');


// Render the source and destination StreamGraphs.
dataFlow((srcDataReduced, srcStreamBox, destDataReduced, destStreamBox, margin, xScale) => {
  focusStreamGraphLayer.call(StreamGraph, [
    {
      margin,
      xScale,
      data: srcDataReduced,
      box: srcStreamBox,
      onStreamClick: dataFlow.src,
      onYearSelect: setIfChanged(dataFlow.year)
    },
    {
      margin,
      xScale,
      data: destDataReduced,
      box: destStreamBox,
      onStreamClick: dataFlow.dest,
      onYearSelect: setIfChanged(dataFlow.year)
    }
  ]);
}, 'srcDataReduced, srcStreamBox, destDataReduced, destStreamBox, focusMargin, focusXScale');

// Render the time panel that shows the years between the StreamGraphs.
dataFlow((box, xScale) => {
  focusTimePanelLayer.call(timePanel, {
    box,
    xScale,
    onYearSelect: setIfChanged(dataFlow.year)
  });
}, 'timePanelBox, focusXScale');

// Render the selected year line.
dataFlow((box, year, xScale) => {
  focusSelectedYearLayer.call(selectedYearLine, {
    box,
    year,
    xScale
  });
}, 'focusBox, year, focusXScale');

// Render the context stream.
dataFlow((box, srcData) => {
  focusStreamGraphLayer.call(contextStream, {
    box,
    data: contextStreamData(srcData),
    onBrush: dataFlow.zoom
  });
}, 'contextStreamBox, srcData');

// Render the type selector buttons.
dataFlow('typeSelector', (types, availableTypes) => {
  select('#typeSelector').call(typeSelector, {
    availableTypes,
    selectedTypes: types,
    onReset: () => dataFlow.types(availableTypes),
    onChange: dataFlow.types
  });
}, 'types, availableTypes');

// Update the URL when properties change.
dataFlow('urlOut', (src, dest, types, availableTypes, zoom) => {
  const params = { src, dest, types, zoom };
  const urlOut = encodeParams(params, availableTypes);
  location.hash = urlOut;
  return urlOut;
}, 'src, dest, types, availableTypes, zoom');
