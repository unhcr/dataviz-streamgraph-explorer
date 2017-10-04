import { component } from 'd3-component';
import dateFromYear from './dateFromYear';

// The d3-component for the selected year line.
const selectedYearLine = component('line')
  .create((selection, props) => {
    selection
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .style('pointer-events', 'none');
  })
  .render((selection, props) => {

    // Unpack the properties passed in.
    const box = props.box;
    const year = dateFromYear(props.year);
    const xScale = props.xScale;

    // Render the selected year line.
    selection
        .attr('y2', box.height)
        .attr('transform', `translate(${xScale(year)})`);
  });

export default selectedYearLine;
