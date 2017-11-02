import { select } from 'd3-selection';

function currentDimensions (){
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

// Calls the callback once on page load, and
// whenever the browser window is resized.
export default function resize(callback) {

  // This keeps track of the last known dimensions.
  let previousDimensions = {};

  // This invokes the callback with current dimensions.
  const invokeCallback = () => {
    callback(previousDimensions);
  };

  // This function returns true if the size changed,
  // since the previous time it was invoked.
  function sizeChanged(){
    const dimensions = currentDimensions();
    const widthChanged = previousDimensions.width !== dimensions.width;
    const heightChanged = previousDimensions.height !== dimensions.height;
    if (widthChanged || heightChanged) {
      previousDimensions = dimensions;
      return true;
    }
    return false;
  }

  // Poll for changes in resize.
  setInterval(() => {

    // If size changed, invoke the callback.
    if (sizeChanged()) {
      invokeCallback();
    }
  }, 500)
}
