import { component } from 'd3-component';
import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { mouse } from 'd3-selection';
import backgroundRect from './backgroundRect';

const xValue = d => d.date;
const xScale = scaleTime();
const xAxis = axisBottom()
  .scale(xScale)
  .tickPadding(0)
  .tickSize(0);

// The d3-component for timePanel, exported from this module.
const timePanel = component('g')
  .render((selection, props) => {

    // Unpack the properties passed in.
    const box = props.box;
    const timeExtent = props.timeExtent;
    const margin = props.margin;
    const onYearSelect = props.onYearSelect;

    // Compute the dimensions of the inner rectangle.
    const innerWidth = box.width - margin.right - margin.left;
    const innerHeight = box.height - margin.top - margin.bottom;

    // Set the X scale domain and range.
    xScale
      .domain(timeExtent)
      .range([margin.left, innerWidth]);

    // Render the X axis.
    selection.call(xAxis);

    // Customize the text appearance.
    selection.selectAll('.tick text')
        .attr('dy', '0.32em')
        .attr('y', box.y + box.height / 2)
        .style('font-size', '16pt')
        .style('font-family', 'Lato,Arial,Helvetica,sans-serif')
        .style('fill', '#030303')
        .style('pointer-events', 'none');

    // Remove the line going along the axis.
    selection.selectAll('.domain').remove();

    // Make the tick lines go from top to bottom.
    const y1 = 0;
    const y2 = box.height;
    selection.selectAll('.tick line')
        .attr('y1', y1)
        .attr('y2', y2)
        .style('stroke', '#ddd')
        .style('stroke-width', 2)
        .style('pointer-events', 'none');

    // Render the background rectangle, for intercepting mouse events.
    selection.call(backgroundRect, {
      width: box.width,
      height: box.height,
      onMove: () => {
        const xPixel = mouse(selection.node())[0];
        const hoveredDate = xScale.invert(xPixel);
        const selectedYear = hoveredDate.getFullYear();
        onYearSelect(selectedYear);
      }
    });
  });

export default timePanel;
