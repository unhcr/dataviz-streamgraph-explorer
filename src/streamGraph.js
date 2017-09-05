import { component } from 'd3-component';
import { area, curveBasis, stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10, } from 'd3-scale';
import { set } from 'd3-collection';
import { min, max, extent } from 'd3-array';

const xValue = d => d.date;

const xScale = scaleTime();
const yScale = scaleLinear();
const colorScale = scaleOrdinal().range(schemeCategory10);

const margin = { top: 0, bottom: 30, left: 0, right: 30 };

const streamArea = area()
  .x(d => xScale(xValue(d.data)))
  .y0(d => yScale(d[0]))
  .y1(d => yScale(d[1]))
  .curve(curveBasis);

const streamStack = stack()
  .offset(stackOffsetWiggle)
  .order(stackOrderInsideOut);

// This function computes the keys present in the data.
const computeKeys = data => {
  const keysSet = set();
  Object.keys(data).forEach(year => {
    Object.keys(data[year]).forEach(key => {
      keysSet.add(key);
    });
  });
  return keysSet.values();
};

// This function preprocesses the data into
// the data structure that d3.stack can work with.
const forStacking = data => Object.keys(data)
  .map(year => {
    const d = data[year];
    d.date = d.date || new Date(year);
    return d;
  });

const StreamGraph = component()
  .render((selection, props) => {
    const data = props.data;
    const box = props.box;
    const stacked = streamStack
      .keys(computeKeys(data))
      (forStacking(data));

    const innerWidth = box.width - margin.right - margin.left;
    const innerHeight = box.height - margin.top - margin.bottom;

    xScale
      .domain(extent(stacked[0], d => {console.log(d); return xValue(d.data)}))
      .range([0, innerWidth]);

    yScale
      .domain([
        min(stacked, series => min(series, d => d[0])),
        max(stacked, series => max(series, d => d[1]))
      ])
      .range([innerHeight, 0]);

    console.log(yScale.domain());
    console.log(yScale.range());
  });

export default StreamGraph;
