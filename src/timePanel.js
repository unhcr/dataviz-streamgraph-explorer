import { component } from 'd3-component';
import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';

const xValue = d => d.date;
const xScale = scaleTime();
const xAxis = axisBottom()
  .scale(xScale)
  .tickPadding(0)
  .tickSize(0);

// The d3-component for timePanel, exported from this module.
const timePanel = component('g')
  .render((selection, props) => {

    // Set the X scale domain and range.
    xScale
      .domain(props.timeExtent)
      .range([0, props.box.width]);

    // Render the X axis.
    selection
        .attr('transform', `translate(0,${
          props.box.y + props.box.height / 2
        })`)
        .call(xAxis)
      .selectAll('.tick text')
        .attr('dy', '0.32em')
        .style('font-size', '20pt');

    // Remove the line going along the axis.
    selection.selectAll('.domain').remove();

    // Make the tick lines go from top to bottom.
    selection.selectAll('.tick line')
        .attr('y1', -props.box.height / 2)
        .attr('y2', props.box.height / 2);
  });

export default timePanel;
