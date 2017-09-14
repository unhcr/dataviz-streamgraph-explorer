import queryString from 'query-string';

export function parseParams(hash) {
  const params = queryString.parse(hash);
  return {
    src: params.src || null,
    dest: params.dest || null,
    types: params.types ? JSON.parse(params.types) : null
  };
}

export function encodeParams(params) {
  return queryString.stringify({
    src: params.src,
    dest: params.dest,
    types: JSON.stringify(params.types)
  });
}
