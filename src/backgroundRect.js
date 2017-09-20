import { component } from 'd3-component';

// The d3-component for a background rectangle, which may intercept mouse events.
const doNothing = () => {};
const backgroundRect = component('rect')
  .render((selection, props) => {
    console.log(selection.node());
    selection
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('fill', 'white')
        .attr('fill-opacity', 0)
        .style('cursor', props.clickable ? 'pointer' : 'default')
        .on('click', props.clickable ? props.onClick : doNothing)
        .on('mousemove', props.onMove ? props.onMove : doNothing);
  });

export default backgroundRect;
