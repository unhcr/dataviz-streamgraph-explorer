import queryString from 'query-string';

// Parses the types from the URL "types" parameter,
// which is encoded as, for example "1-3-4-5".
const parseTypes = (types, availableTypes) => types
  .split('-')
  .map(i => availableTypes[i - 1]);

// Encodes the list of selected types into the string
// that will go in the URL "types" parameter.
const encodeTypes = (types, availableTypes) => types
  .map(type => availableTypes.indexOf(type) + 1)
  .join('-');

// Parses the "src" and "dest" parameter values.
// If the value is undefined, return "null",
// so the value will be considered as defined
// in the data flow graph (null means no selection).
const parsePlace = place => place || null;

// Encodes the "src" and "dest" parameter values
// for use in the URL. The value "undefined" is used
// so that if no src is selected, the src parameter
// is omitted from the URL (null causes "src" to show up).
const encodePlace = place => place || undefined;

// Parses the parameters from the URL hash.
export function parseParams(hash, availableTypes) {
  const params = queryString.parse(hash);
  return {
    src: parsePlace(params.src),
    dest: parsePlace(params.dest),
    types: params.types ? parseTypes(params.types, availableTypes) : null
  };
}

// Encodes the zoomed extent (min and max) to a string.
const encodeZoom = extent => JSON.stringify(extent);

// Encodes the parameters into the URL hash.
export function encodeParams(params, availableTypes) {
  return queryString.stringify({
    src: encodePlace(params.src),
    dest: encodePlace(params.dest),
    types: encodeTypes(params.types, availableTypes),
    zoom: encodeZoom(params.zoom)
  });
}
