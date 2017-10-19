import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { format } from 'd3-format';

const xValue = d => d.value;
const yValue = d => d.name;
const commaFormat = format(',');
const labelValue = d => yValue(d) + ': ' + commaFormat(xValue(d));

const xScale = scaleLinear();
const yScale = scaleBand()
  .paddingInner(0.2)
  .paddingOuter(0);

const margin = { left: 0, right: 0, top: 0, bottom: 0 };

const labelPadding = 3;

export default (selection, { data, maxCountries }) => {

  const width = selection.attr('width');
  const height = selection.attr('height');

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Make each bar this many pixels high.
  // Fit 20 bars on screen as the maximum number.
  const barHeight = innerHeight / maxCountries;

  xScale
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  yScale
    .domain(data.map(yValue))
    .range([0, barHeight * data.length]);

  let g = selection.selectAll('g').data([null]);
  g = g.enter().append('g')
    .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Each "bar" is a group that will contain
  //  - a rectangle
  //  - a label on top of the bar (name + value)
  const bars = g.selectAll('g').data(data);
  const barsEnter = bars.enter().append('g');
  bars.exit().remove();
  bars
    .merge(barsEnter)
      .attr('transform', d => `translate(0,${yScale(yValue(d))})`);

  // Render the rectangles.
  barsEnter
    .append('rect')
      .attr('fill', 'steelblue')
    .merge(bars.select('rect'))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());

  // Render the labels on the left.
  barsEnter
    .append('text')
      .attr('class', 'name-label')
      .attr('dy', '0.32em')
      .attr('x', labelPadding)
    .merge(bars.select('.name-label'))
      .attr('y', yScale.bandwidth() / 2)
      .text(labelValue);

//  // Render the labels on the right.
//  barsEnter
//    .append('text')
//      .attr('class', 'value-label')
//      .attr('dy', '0.32em')
//      .attr('text-anchor', 'start')
//    .merge(bars.select('.value-label'))
//      .attr('y', yScale.bandwidth() / 2)
//      .attr('x', d => xScale(xValue(d)) + labelPadding)
//      .text(d => commaFormat(xValue(d)));
}
