import unpackData from './unpackData';
import { json } from 'd3-request';
import { nest, set } from 'd3-collection';
import { sum } from 'd3-array';

// Calls the callback with the cached unpacked data if it is available.
// Loads and unpacks the data when first invoked.
let data;
const getUnpackedData = (callback) => {
  if (data) {
    callback(data);
  } else {
    json('../data/data.json', packedData => {
      data = unpackData(packedData);
      callback(data);
    });
  }
};

const aggregate = (data, column) => nest()
  .key(d => d.year)
  .key(d => d[column])
  .rollup(values => sum(values, d => d.value))
  .object(data);

function runQuery(query, callback){

  // Unpack the query object.
  const src = query.src;
  const dest = query.dest;

  // Make a d3-set containing the selected types.
  const typesSet = set(query.types);

  // Filter and aggregate the data based on the query.
  getUnpackedData(data => {

    // Filter by selected types.
    let filtered = data.filter(d => typesSet.has(d.type));

    // Filter by source.
    if (src) {
      filtered = filtered.filter(d => d.src === src);
    }

    // Filter by destination.
    if (dest) {
      filtered = filtered.filter(d => d.dest === dest);
    }

    // Aggregate the filtered data by source and destination.
    const result = {
      srcData: aggregate(filtered, 'src'),
      destData: aggregate(filtered, 'dest')
    };

    callback(result);
  });
};

// When we get a request from the main page...
onmessage = function(e) {

  // The query object is passed in as e.data.
  const query = e.data;

  // Execute the query.
  runQuery(query, result => {

    // Return the result to the requester via `postMessage`.
    postMessage(result);
  });
}
