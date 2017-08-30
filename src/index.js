import { select } from 'd3-selection';
import resize from './resize';

// Set up the behavior that resizes the SVG elements
// on load and when the browser window resizes.
resize();

// Set background color to be pink so we can see the SVGs (temporary).
select('#focus svg').style('background-color', 'pink');
select('#details svg').style('background-color', 'pink');

