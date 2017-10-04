import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import { component } from 'd3-component';
import { max, extent } from 'd3-array';
import { brushX } from 'd3-brush';

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
    const data = props.data;
    const onBrush = props.onBrush;
    xScale
      .domain(extent(data, xValue))
      .range([0, box.width]);
    yScale
      .domain([0, max(data, yValue)])
      .range([0, box.height / 2]);
    selection
      .attr('transform', `translate(${box.x},${box.y + box.height / 2})`)
      .attr('d', contextArea(data))
      .attr('fill', 'gray');
  });

const contextBrushComponent = component('g')
  .render((selection, props) => {
    const box = props.box;
    contextBrush.on('brush', () => console.log('brushed'));
    selection
      .attr('transform', `translate(${box.x},${box.y})`)
      .call(contextBrush);
  });

const contextStream = (selection, props) => {
  selection
    .call(contextAreaComponent, props)
    .call(contextBrushComponent, props);
};
export default contextStream;
