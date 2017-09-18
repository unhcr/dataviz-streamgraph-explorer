import { component } from 'd3-component';
import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';

const xValue = d => d.date;
const xScale = scaleTime();
const xAxis = axisBottom().scale(xScale);

// The d3-component for timePanel, exported from this module.
const timePanel = component('g')
  .render((selection, props) => {
    xScale
      .domain(props.timeExtent)
      .range([0, props.box.width]);

    selection
        .attr('transform', `translate(0,${
          props.box.y + props.box.height / 2
        })`)
        .call(xAxis);
  });

export default timePanel;
