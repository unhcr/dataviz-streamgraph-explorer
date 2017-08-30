import { select } from 'd3-selection';
import detectMobile from './detectMobile';
const device = detectMobile() ? 'mobile' : 'desktop';
console.log('We are on a ' + device);

select('#focus')
    .attr('width', 500)
    .attr('height', 500)
    .style('background-color', 'pink');

select('#details')
    .attr('width', 500)
    .attr('height', 500)
    .style('background-color', 'pink');
