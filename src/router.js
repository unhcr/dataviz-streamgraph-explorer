import queryString from 'query-string';

export function parseParams(hash) {
  return queryString.parse(hash);
}

export function encodeParams(src, dest, types) {
  return queryString.stringify({
    src,
    dest,
    types
  });
}
