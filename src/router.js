import queryString from 'query-string';

function parseTypes(types, availableTypes) {
  return types
    .split('-')
    .map(i => availableTypes[i]);
}

function encodeTypes(types, availableTypes) {
  return types
    .map(type => availableTypes.indexOf(type))
    .join('-');
}

export function parseParams(hash, availableTypes) {
  const params = queryString.parse(hash);
  return {
    src: params.src || null,
    dest: params.dest || null,
    types: params.types ? parseTypes(params.types, availableTypes) : null
  };
}

export function encodeParams(params, availableTypes) {
  return queryString.stringify({
    src: params.src,
    dest: params.dest,
    types: encodeTypes(params.types, availableTypes)
  });
}
