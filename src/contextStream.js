import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import { component } from 'd3-component';
import { max, extent } from 'd3-array';
import { brushX } from 'd3-brush';
import { event } from 'd3-selection';

const xValue = d => d.date;
const xScale = scaleTime();

const yValue = d => d.total;
const yScale = scaleLinear();

const contextArea = area()
  .x(d => xScale(xValue(d)))
  .y0(d => -yScale(yValue(d)))
  .y1(d => yScale(yValue(d)))
  .curve(curveBasis);

const contextBrush = brushX();

const contextAreaComponent = component('path')
  .render((selection, props) => {
    const box = props.box;
    selection
      .attr('transform', `translate(${box.x},${box.y + box.height / 2})`)
      .attr('d', contextArea(props.data))
      .attr('fill', 'gray');
  });

const contextBrushComponent = component('g')
  .render((selection, props) => {
    contextBrush
      .on('brush', () => {
        const zoom = event.selection;
        props.onBrush(zoom ? zoom.map(xScale.invert) : null);
      })
      .on('end', () => {
        if (!event.selection) {
          props.onBrush(null);
        }
      });
    selection
      .attr('transform', `translate(${props.box.x},${props.box.y})`)
      .call(contextBrush);

    const zoom = props.zoom;
    contextBrush.move(selection, zoom ? zoom.map(xScale) : null);
  });

const contextStream = (selection, props) => {
  xScale
    .domain(props.timeExtent)
    .range([0, props.box.width]);
  yScale
    .domain([0, max(props.data, yValue)])
    .range([0, props.box.height / 2]);
  selection
    .call(contextAreaComponent, props)
    .call(contextBrushComponent, props);
};
export default contextStream;
