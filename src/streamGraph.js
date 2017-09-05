import { component } from 'd3-component';
import {
  area,
  curveBasis,
  stack,
  stackOffsetWiggle,
  stackOrderInsideOut
} from 'd3-shape';
import {
  scaleTime,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
} from 'd3-scale';

const xValue = d => d.date;

const xScale = scaleTime();
const yScale = scaleLinear();
const colorScale = scaleOrdinal().range(schemeCategory10);

const streamArea = area()
  .x(d => xScale(xValue(d.data)))
  .y0(d => yScale(d[0]))
  .y1(d => yScale(d[1]))
  .curve(curveBasis);

const streamStack = stack()
  .offset(stackOffsetWiggle)
  .order(stackOrderInsideOut);

const StreamGraph = component()
  .render((selection, props) => {
    console.log(props);
  });

export default StreamGraph;
