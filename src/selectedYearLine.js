import { component } from 'd3-component';
import { scaleTime } from 'd3-scale';
import dateFromYear from './dateFromYear';

// TODO refactor so the xScale is not defined in multiple places.
const xScale = scaleTime();

// The d3-component for the selected year line.
const selectedYearLine = component('line')
  .render((selection, props) => {

    // Unpack the properties passed in.
    const box = props.box;
    const timeExtent = props.timeExtent;
    const margin = props.margin;
    const year = dateFromYear(props.year);

    // Compute the dimensions of the inner rectangle.
    const innerWidth = box.width - margin.right - margin.left;

    // Set the X scale domain and range.
    xScale
      .domain(timeExtent)
      .range([margin.left, innerWidth]);

    // Render the selected year line.
    const x = xScale(year);
    selection
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', box.height)
        .attr('stroke', 'black')
        .attr('stroke-width', 3);
  });

export default selectedYearLine;
