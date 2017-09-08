import { descending, max } from 'd3-array';

// The maximum number of areas to show.
const maxCountriesToInclude = 100;

// The threshold below which areas will be excluded,
// in terms of percentage of the maximum value seen (0.01 == 1%).
const visibilityThreshold = 0.01;

// Accessor functions for dealing with entries clearly.
const country = entry => entry[0];
const value = entry => entry[1];

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
  const entries = Object.entries(countryToLargestValue);
  const maxValue = max(entries, value);
  const countriesToInclude = entries

    // Sort the entries by value.
    .sort((a, b) => descending(a[1], b[1]))

    // Take the top N.
    .slice(0, maxCountriesToInclude)

    // Exclude countries whose area would be so small
    // that it would not even be visible.
    .filter(entry => value(entry) / maxValue > visibilityThreshold);

  // Reconstruct the original data structure,
  // only including the computed countries to include.
  const reducedData = {};
  Object.keys(data).forEach(year => {
    reducedData[year] = {};
    countriesToInclude.forEach(entry => {
      reducedData[year][country(entry)] = data[year][country(entry)];
    });
  });

  return reducedData;
}
