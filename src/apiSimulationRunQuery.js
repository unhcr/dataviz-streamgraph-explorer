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
    json('data/data.json', packedData => {
      data = unpackData(packedData);
      callback(data);
    });
  }
};

// This function aggregates data by year
// and by the specified column using d3.nest.
const aggregate = (data, column) => nest()
  .key(d => d.year)
  .key(d => d[column])
  .rollup(values => sum(values, d => d.value))
  .object(data);

// This object contains cached results for each query.
const cache = {};
const key = query => JSON.stringify(query);
const getCachedResult = q => cache[key(q)];
const setCachedResult = (q, result) => cache[key(q)] = result;

// This function executes the query, using a cache of results.
export function runQuery(query, callback){

  // Return the cached result
  // if this query has already been computed.
  const cachedResult = getCachedResult(query);
  if(cachedResult){
    callback(cachedResult);
    return;
  }

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

    setCachedResult(query, result);
    callback(result);
  });
};
