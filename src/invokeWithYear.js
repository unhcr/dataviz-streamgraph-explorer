import { mouse } from 'd3-selection';

// Returns a function that will, when invoked, invoke the given
// function 'fn', passing the year value derived from the
// X position of the mouse.
const invokeWithYear = (fn, selection, xScale) => () => {
  const xPixel = mouse(selection.node())[0];
  const hoveredDate = xScale.invert(xPixel);
  const selectedYear = hoveredDate.getFullYear();
  fn(selectedYear);
};
export default invokeWithYear;
