import { component } from 'd3-component';
import { area, curveBasis, stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { scaleLinear, scaleOrdinal, schemeCategory10, } from 'd3-scale';
import { set } from 'd3-collection';
import { min, max, extent } from 'd3-array';
import { local } from 'd3-selection';
import { areaLabel } from 'd3-area-label';
import debounce from 'lodash.debounce';
import dateFromYear from './dateFromYear';
import backgroundRect from './backgroundRect';
import invokeWithYear from './invokeWithYear';

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
    d.date = d.date || dateFromYear(year);
    return d;
  });

// The accessor function for the X value, returns the date.
const xValue = d => d.date;

// Create the x, y, and color scales.
const colorScale = scaleOrdinal().range(schemeCategory10);

// The d3 local that stores things local to each StreamGraph instance.
const streamLocal = local();

// The component that will render the label.
const labelOffsetX = 15;
const labelOffsetY = 2;
const labelComponent = component('text', 'label')
  .create((selection, props) => {
    selection
        .attr('x', labelOffsetX)
        .attr('y', labelOffsetY)
        .attr('alignment-baseline', 'hanging')
        .attr('font-size', '1.5em')
        .attr('font-weight', '700')
        .style('text-transform', 'uppercase');
  })
  .render((selection, props) => {
    selection.text(props.label);
  });

// The d3-component for StreamGraph, exported from this module.
const StreamGraph = component('g')
  .create((selection, props) => {

    // Each StreamGraph instance has its own Y scale.
    const yScale = scaleLinear();

    // The d3.area path generator for StreamGraph areas.
    const streamArea = area()
      .x(d => props.xScale(xValue(d.data)))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(curveBasis);

    // The debounced function that positions and reveals labels.
    const renderLabels = debounce(() => {
      selection.selectAll('.area-label')
          .attr('transform', areaLabel(streamArea))
          .attr('opacity', .7);
    }, 500);

    // Store the renderLabels and streamArea local to the instance.
    streamLocal.set(selection.node(), {
      renderLabels,
      streamArea,
      yScale
    });
  })
  .render((selection, props) => {

    // Unpack the properties passed in.
    const data = props.data;
    const box = props.box;
    const onStreamClick = props.onStreamClick;
    const margin = props.margin;
    const onYearSelect = props.onYearSelect;
    const xScale = props.xScale;
    const label = props.label;

    // Unpack local objects.
    const my = streamLocal.get(selection.node());
    const renderLabels = my.renderLabels;
    const streamArea = my.streamArea;
    const yScale = my.yScale;

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
      onClick: () => onStreamClick(null),

      // Pass selected year to the caller on hover.
      onMove: invokeWithYear(onYearSelect, selection, xScale)

    });

    // Compute the dimensions of the inner rectangle.
    const innerHeight = box.height - margin.top - margin.bottom;

    // Set the domain and range of y scale.
    yScale
      .domain([
        min(stacked, series => min(series, d => d[0])),
        max(stacked, series => max(series, d => d[1]))
      ])
      .range([innerHeight, 0]);

    // Render the StreamGraph areas.
    const paths = selection.selectAll('path').data(stacked);
    paths
      .enter().append('path')
        .style('cursor', 'pointer')
        .attr('fill-opacity', .8)
      .merge(paths)
        .attr('fill', d => colorScale(d.index))
        .attr('stroke', d => colorScale(d.index))
        .attr('d', streamArea)
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
        })
        .on('mousemove', invokeWithYear(onYearSelect, selection, xScale));
    paths.exit().remove();

    // Render the area labels.
    const labels = selection
      .selectAll('.area-label').data(stacked);
    labels
      .enter().append('text')
        .attr('class', 'area-label')
        .style('pointer-events', 'none')
        .attr('fill', 'white')
      .merge(labels)
        .text(d => d.key)
        .attr('opacity', 0);
    labels.exit().remove();
    renderLabels();

    // Render the label of the whole StreamGraph.
    selection.call(labelComponent, {
      label: stacked.length > 1 ? label.plural : label.singular
    });
  });

export default StreamGraph;
