import { select } from 'd3-selection';

// Calls the callback once on page load, and
// whenever the browser window is resized.
export default function resize(callback) {
  callback();
  window.addEventListener("resize", callback);
}
