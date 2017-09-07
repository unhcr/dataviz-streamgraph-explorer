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

onmessage = function(e) {
  const query = e.data;
  const typesSet = set(query.types);
  const src = query.src;
  const dest = query.dest;

  getUnpackedData(data => {
    let filtered = data.filter(d => typesSet.has(d.type));
    console.log(data[0]);
    if (src) {
      filtered = filtered.filter(d => d.src === src);
    }
    if (dest) {
      filtered = filtered.filter(d => d.dest === dest);
    }
    postMessage({
      srcData: aggregate(filtered, 'src'),
      destData: aggregate(filtered, 'dest')
    });
  });
}
