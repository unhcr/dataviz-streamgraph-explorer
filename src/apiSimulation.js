// Start the Web Worker that simulates the API.
const apiSimulationWorker = new Worker('dist/apiSimulationWorker.js');

const apiSimulation = {
  sendRequest: apiQuery => {
    apiSimulationWorker.postMessage(apiQuery)
  },
  onResponse: callback => {
    apiSimulationWorker.onmessage = e => {
      callback(e.data);
    }
  }
};

export default apiSimulation;
