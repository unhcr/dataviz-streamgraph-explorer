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
import { set } from 'd3-collection';

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

const computeKeys = data => {
  const keysSet = set();
  Object.keys(data).forEach(year => {
    Object.keys(data[year]).forEach(key => {
      keysSet.add(key);
    });
  });
  return keysSet.values();
};

const StreamGraph = component()
  .render((selection, props) => {
    const data = props.data;
    const box = props.data;
    const keys = computeKeys(data);

    console.log(keys);
  });

export default StreamGraph;
