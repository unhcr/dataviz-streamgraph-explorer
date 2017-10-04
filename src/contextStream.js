import { scaleLinear, scaleTime } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import { component } from 'd3-component';
import { max, extent } from 'd3-array';

const xValue = d => d.date;
const xScale = scaleTime();

const yValue = d => d.total;
const yScale = scaleLinear();

const contextArea = area()
  .x(d => xScale(xValue(d)))
  .y0(d => -yScale(yValue(d)))
  .y1(d => yScale(yValue(d)))
  .curve(curveBasis);

const contextAreaComponent = component('path')
  .render((selection, props) => {
    const box = props.box;
    const data = props.data;
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

const contextStream = (selection, props) => {
  selection.call(contextAreaComponent, props);
};
export default contextStream;
