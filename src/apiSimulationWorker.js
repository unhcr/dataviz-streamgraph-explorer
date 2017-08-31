import unpackData from './unpackData';
import { json } from 'd3-request';

// Load and unpack the data.
json('../data/data.json', packedData => {
  console.log(unpackData(packedData));
});

onmessage = function(e) {
  console.log('Message received from main script');
  const workerResult = 'Result: ' + e.data;
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
