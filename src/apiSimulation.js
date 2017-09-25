import { runQuery } from './apiSimulationRunQuery';

// Instantiate the API simulation.
// options.useWebWorker is a boolean that indicates whether
// a Web Worker should be used for the API simulation.
// Using a Web Worker takes the heavy computation off the main thread,
// but also introduces overhead of the structured clone algorithm used
// when messages are passed.
const apiSimulation = (options) => {
  if (options.useWebWorker) {

    // Start the Web Worker that simulates the API.
    const apiSimulationWorker = new Worker('dist/apiSimulationWorker.js');
    return {
      sendRequest: apiQuery => {
        apiSimulationWorker.postMessage(apiQuery)
      },
      onResponse: callback => {
        apiSimulationWorker.onmessage = e => {
          callback(e.data);
        }
      }
    };
  } else {
    let onResponseCallback;
    return {
      sendRequest: apiQuery => {
        runQuery(apiQuery, data => {

          // Make sure this is really asynchronous,
          // otherwise some unexpected control flow problems come up.
          setTimeout(() => onResponseCallback(data));
        });
      },
      onResponse: callback => {
        onResponseCallback = callback;
      }
    };
  }
};

export default apiSimulation;
