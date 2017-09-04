import unpackData from './unpackData';
import { json } from 'd3-request';
import { nest } from 'd3-collection';
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
  .key(d => d[column])
  .key(d => d.year)
  .rollup(values => sum(values, d => d.value))
  .entries(data);

onmessage = function(e) {

  // TODO use this query for filtering.
  const query = e.data;

  getUnpackedData(data => {
    postMessage({
      srcData: aggregate(data, 'src'),
      destData: aggregate(data, 'dest')
    });
  });
}