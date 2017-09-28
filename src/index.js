import ReactiveModel from 'reactive-model';
import { select } from 'd3-selection';
import { format } from 'd3-format';
import { extent, descending } from 'd3-array';
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

// Scaffold DOM structure.
const focusSVG = select('#focus').append('svg');
const focusTimePanelLayer = focusSVG.append('g');
const focusStreamGraphLayer = focusSVG.append('g');
const focusSelectedYearLayer = focusSVG.append('g');

const detailsSVG = select('#details').append('svg');

// Set background color to be pink so we can see the SVGs (temporary).
//focusSVG.style('background-color', 'pink');
detailsSVG.style('background-color', 'pink');

// The reactive data flow graph for the application.
const dataFlow = ReactiveModel();

// The margin defining spacing around the inner visualization rectangle
// for the focus SVG (srcStream, destStream, timePanel).
dataFlow('focusMargin', { top: 0, bottom: 0, left: 0, right: 15 });

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

// The currently selected source and destination.
// These are initialized to values from the URL hash.
// These change when clicking on areas in the StreamGraphs.
dataFlow('src', d => d.src, 'paramsIn');
dataFlow('dest', d => d.dest, 'paramsIn');

// The currently selected year.
// TODO derive initial values from data max.
dataFlow('year', 2016);

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
dataFlow('timePanelBox', d => d.timePanel, 'focusArrangement');

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


// Render the details bar chart for the selected year.
// TODO


const commaFormat = format(',');
dataFlow((year, srcData, destData) => {
  // Compute the filtered data for the selected year.
  const yearSrcData = srcData[year];

  // Transform the data for use in a bar chart.
  const srcBarsData = Object.keys(yearSrcData)
    .map(key => ({
      name: key,
      value: yearSrcData[key]
    }))
    .sort((a, b) => descending(a.value, b.value));

  // Update the text of the details panel statistic.
  const yearDestData = destData[year];
  const destName = Object.keys(yearDestData)[0];
  const statisticLabel = `Total in ${destName}`;
  const statisticValue = Object.values(yearDestData)[0];

  select('#details-statistic-label')
      .text(statisticLabel);

  select('#details-statistic-value')
      .text(commaFormat(statisticValue));

  //detailsSVG.call(detailsBarChart, srcBarsData);
}, 'year, srcData, destData')

// Compute the time extent from the source data,
// which should always match with the extent of the dest data.
dataFlow('timeExtent', srcData => {
  return extent(Object.keys(srcData).map(dateFromYear));
}, 'srcData');

// Reduce the data to show only the largest areas.
dataFlow('srcDataReduced', reduceData, 'srcData');
dataFlow('destDataReduced', reduceData, 'destData');

// Render the source and destination StreamGraphs.
dataFlow((srcDataReduced, srcStreamBox, destDataReduced, destStreamBox, timeExtent, margin) => {
  focusStreamGraphLayer.call(StreamGraph, [
    {
      margin,
      timeExtent,
      data: srcDataReduced,
      box: srcStreamBox,
      onStreamClick: dataFlow.src,
      // TODO remove duplicated logic here
      onYearSelect: year => {
        if(dataFlow.year() !== year) {
          dataFlow.year(year);
        }
      }
    },
    {
      margin,
      timeExtent,
      data: destDataReduced,
      box: destStreamBox,
      onStreamClick: dataFlow.dest,
      // TODO remove duplicated logic here
      onYearSelect: year => {
        if(dataFlow.year() !== year) {
          dataFlow.year(year);
        }
      }
    }
  ]);
}, 'srcDataReduced, srcStreamBox, destDataReduced, destStreamBox, timeExtent, focusMargin');

// Render the time panel that shows the years between the StreamGraphs.
dataFlow((timeExtent, box, margin) => {
  focusTimePanelLayer.call(timePanel, {
    timeExtent,
    box,
    margin,
    // TODO remove duplicated logic here
    onYearSelect: year => {
      if(dataFlow.year() !== year) {
        dataFlow.year(year);
      }
    }
  });
}, 'timeExtent, focusBox, focusMargin');

// Render the selected year line.
dataFlow((timeExtent, box, margin, year) => {
  focusSelectedYearLayer.call(selectedYearLine, {
    timeExtent,
    box,
    margin,
    year
  });
}, 'timeExtent, focusBox, focusMargin, year');

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
dataFlow('urlOut', (src, dest, types, availableTypes) => {
  const params = { src, dest, types };
  const urlOut = encodeParams(params, availableTypes);
  location.hash = urlOut;
  return urlOut;
}, 'src, dest, types, availableTypes');
