import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { format } from 'd3-format';

const xValue = d => d.value;
const yValue = d => d.name;
const commaFormat = format(',');
const labelValue = d => yValue(d) + ': ' + commaFormat(xValue(d));

// The fraction of the bar height used by the bar label text.
const fontScale = 0.7;

// Determines the width of the stroke behind the bar label text.
const strokeScale = 0.15;

const xScale = scaleLinear();
const yScale = scaleBand()
  .paddingInner(0.2)
  .paddingOuter(0);

const margin = { left: 0, right: 0, top: 0, bottom: 0 };

const labelPadding = 3;

export default (selection, props) => {
  const {
    data,
    maxCountries,
    colorScale,
    width,
    height
  } = props

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
    .merge(bars.select('rect'))
      .attr('fill', d => colorScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth());

  const fontSize = barHeight * fontScale + 'px';

  // Render the labels in the back with stroke.
  barsEnter
    .append('text')
      .attr('class', 'back-text')
      .attr('dy', '0.32em')
      .attr('x', labelPadding)
      .attr('stroke', 'white')
      .attr('stroke-linejoin', 'round')
    .merge(bars.select('.back-text'))
      .attr('font-size', fontSize)
      .attr('stroke-width', barHeight * strokeScale)
      .attr('y', yScale.bandwidth() / 2)
      .text(labelValue);

  // Render the labels in the front without stroke.
  barsEnter
    .append('text')
      .attr('class', 'front-text')
      .attr('dy', '0.32em')
      .attr('x', labelPadding)
    .merge(bars.select('.front-text'))
      .attr('font-size', fontSize)
      .attr('y', yScale.bandwidth() / 2)
      .text(labelValue);
}
