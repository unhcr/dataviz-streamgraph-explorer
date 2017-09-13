import { component } from 'd3-component';
import { area, curveBasis, stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10, } from 'd3-scale';
import { set } from 'd3-collection';
import { min, max, extent } from 'd3-array';
import { areaLabel } from 'd3-area-label';

// The accessor function for the X value, returns the date.
const xValue = d => d.date;

// Create the x, y, and color scales.
const xScale = scaleTime();
const yScale = scaleLinear();
const colorScale = scaleOrdinal().range(schemeCategory10);

// The margin defining spacing around the inner visualization rectangle.
const margin = { top: 0, bottom: 30, left: 0, right: 30 };

// The d3.area path generator for StreamGraph areas.
const streamArea = area()
  .x(d => xScale(xValue(d.data)))
  .y0(d => yScale(d[0]))
  .y1(d => yScale(d[1]))
  .curve(curveBasis);

// The d3.stack layout for computing StreamGraph area shapes.
const streamStack = stack()
  .offset(stackOffsetWiggle)
  .order(stackOrderInsideOut);

// Use zero when there is no value present in the data
// for a certain combination of (year, src, dest).
streamStack.value((d, key) => (d[key] || 0));

// This function computes the keys present in the data.
const computeKeys = data => {
  const keysSet = set();
  Object.keys(data).forEach(year => {
    Object.keys(data[year]).forEach(key => {
      if (key !== 'date') {
        keysSet.add(key);
      }
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

// The d3-component for the background rectangle, which intercepts mouse events.
const doNothing = () => {};
const backgroundRect = component('rect')
  .render((selection, props) => {
    selection
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('fill-opacity', 0)
        .style('cursor', props.clickable ? 'pointer' : 'default')
        .on('click', props.clickable ? props.onClick : doNothing)
  });

// The d3-component for StreamGraph, exported from this module.
const StreamGraph = component('g')
  .render((selection, props) => {

    // Unpack the properties passed in.
    const data = props.data;
    const box = props.box;
    const onStreamClick = props.onStreamClick;

    // Translate the SVG group by (x, y) from the box.
    selection.attr('transform', `translate(${box.x},${box.y})`);

    // Compute the stacked data (StreamGraph areas).
    const stacked = streamStack
      .keys(computeKeys(data))
      (forStacking(data));

    // Render the background rectangle, for intercepting mouse events.
    selection.call(backgroundRect, {
      width: box.width,
      height: box.height,

      // Clickability here only makes sense when there's a single area.
      clickable: stacked.length === 1,

      // Pass null to the click callback to signal de-selection.
      onClick: () => onStreamClick(null)
    });

    // Compute the dimensions of the inner rectangle.
    const innerWidth = box.width - margin.right - margin.left;
    const innerHeight = box.height - margin.top - margin.bottom;

    // Set the domain and range of x and y scales.
    xScale
      .domain(extent(stacked[0], d => xValue(d.data)))
      .range([0, innerWidth]);
    yScale
      .domain([
        min(stacked, series => min(series, d => d[0])),
        max(stacked, series => max(series, d => d[1]))
      ])
      .range([innerHeight, 0]);

    // Render the StreamGraph areas.
    const paths = selection.selectAll('path').data(stacked);
    const pathsEnter = paths
      .enter().append('path');
    pathsEnter
      .merge(paths)
        .attr('fill', d => colorScale(d.index))
        .attr('stroke', d => colorScale(d.index))
        .attr('d', streamArea)
        .style('cursor', 'pointer')
        .on('click', d => {

          // When the user clicks on an area,
          if (stacked.length !== 1) {

            // pass the key of that area to the click callback.
            onStreamClick(d.key);
          } else {

            // But if there's only one area and the user clicks on it,
            // pass null to the click callback to signal de-selection.
            onStreamClick(null);
          }
        });
    paths.exit().remove();

    // Render the labels.
    const labels = selection.selectAll('text').data(stacked);
    labels
      .enter().append('text')
        .attr('class', 'area-label')
      .merge(labels)
        .text(d => d.key)
        .attr('transform', areaLabel(streamArea));
  });

export default StreamGraph;
