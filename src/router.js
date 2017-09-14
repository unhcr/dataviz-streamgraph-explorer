import queryString from 'query-string';

export function getRouteParams() {
  return queryString.parse(location.hash);
}

export function setRouteParams(params) {
  location.hash = queryString.stringify(params);
}
