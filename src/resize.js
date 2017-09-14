import { select } from 'd3-selection';

// Calls the callback once on page load, and
// whenever the browser window is resized.
export default function resize(callback) {
  const invokeCallback = () => {
    callback({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  invokeCallback();
  window.addEventListener('resize', invokeCallback);
}
