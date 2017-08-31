import { select } from 'd3-selection';
import { json } from 'd3-request';
import resize from './resize';
import unpackData from './unpackData';

// Set up the behavior that resizes the SVG elements
// on load and when the browser window resizes.
resize();

// Set background color to be pink so we can see the SVGs (temporary).
select('#focus svg').style('background-color', 'pink');
select('#details svg').style('background-color', 'pink');

// Load and unpack the data.
json('data/data.json', packedData => {
  console.log(unpackData(packedData));
});
