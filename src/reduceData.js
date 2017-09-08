import { descending } from 'd3-array';

// The maximum number of areas to show.
const maxCountriesToInclude = 100;

// This function reduces the data to show only the largest areas.
export default function reduceData (data) {

  // Compute the largest value for each area.
  const countryToLargestValue = {};
  Object.keys(data).forEach(year => {
    const yearObject = data[year];
    Object.keys(yearObject).forEach(country => {
      const largestValueSoFar = countryToLargestValue[country];
      const value = yearObject[country];
      if (!largestValueSoFar || value > largestValueSoFar) {
        countryToLargestValue[country] = value;
      }
    });
  });

  // Compute the set of countries to include.
  const countriesToInclude = Object.entries(countryToLargestValue)
    .sort((a, b) => descending(a[1], b[1]))
    .slice(0, maxCountriesToInclude)
    .map(entry => entry[0]);

  // Reconstruct the original data structure,
  // only including the computed countries to include.
  const reducedData = {};
  Object.keys(data).forEach(year => {
    reducedData[year] = {};
    countriesToInclude.forEach(country => {
      reducedData[year][country] = data[year][country];
    });
  });

  return reducedData;
}
