import { component } from 'd3-component';
import { axisBottom } from 'd3-axis';
import backgroundRect from './backgroundRect';
import invokeWithYear from './invokeWithYear';

const xValue = d => d.date;
const xAxis = axisBottom()
  .tickPadding(0)
  .tickSize(0);

// The d3-component for timePanel, exported from this module.
const timePanel = component('g')
  .render((selection, props) => {

    // Unpack the properties passed in.
    const box = props.box;
    const onYearSelect = props.onYearSelect;
    const xScale = props.xScale;

    // Render the X axis.
    selection.call(xAxis.scale(xScale));

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
      onMove: invokeWithYear(onYearSelect, selection, xScale)
    });
  });

export default timePanel;
