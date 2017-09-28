import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';

const xValue = d => d.value;
const yValue = d => d.name;

const xScale = scaleLinear();
const yScale = scaleBand();

const margin = { left: 50, right: 50, top: 20, bottom: 0 };

export default (selection, data) => {

  const width = selection.attr('width');
  const height = selection.attr('height');

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  xScale
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  yScale
    .domain(data.map(yValue))
    .range([0, innerHeight]);

  const rects = selection.selectAll('rect').data(data);
  rects
    .enter().append('rect')
      .attr('fill', 'steelblue')
    .merge(rects)
      .attr('x', 0)
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());
}
