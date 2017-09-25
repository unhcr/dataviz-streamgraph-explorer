import { runQuery } from './apiSimulationRunQuery';

// If this module is being used as a Web Worker,
// when we get a request from the main page...
onmessage = function(e) {

  // The query object is passed in as e.data.
  const query = e.data;

  // Execute the query.
  runQuery(query, result => {

    // Return the result to the requester via `postMessage`.
    postMessage(result);
  });
}
