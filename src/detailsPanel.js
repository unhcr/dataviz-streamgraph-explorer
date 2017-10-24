import { format } from 'd3-format';
import { select } from 'd3-selection';
import { descending, sum } from 'd3-array';
import detailsBarChart from './detailsBarChart';

// The top n countries are shown.
const maxCountries = 20;

// Takes the first n elements of the data array.
const topN = data => data.slice(0, maxCountries);

// Formats a number with commas, e.g. 1,000,000
const commaFormat = format(',');

// Extracts the data for the given year,
// and transforms it into a sorted array.
function getYearData(year, data){
  if (data[year]) {
    return Object.keys(data[year])
      .map(key => ({
        name: key,
        value: data[year][key]
      }))
      .sort((a, b) => descending(a.value, b.value));
  }
  return [];
}

// This is the top-level component that manages the
// elements within the details view.
export default function (selection, year, srcData, destData) {

  // Compute the filtered data for the selected year.
  const yearSrcData = getYearData(year, srcData);
  const yearDestData = getYearData(year, destData);

  const data = {
    yearSrcData,
    yearDestData
  };

  // Figure out if there are multipld src/dest.
  const zeroSrc = data => data.yearSrcData.length === 0;
  const zeroDest = yearDestData.length === 0;
  const multipleSrc = yearSrcData.length > 1;
  const multipleDest = yearDestData.length > 1;
  const singleSrc = !multipleSrc;
  const singleDest = !multipleDest;

  const src = yearSrcData[0];
  const dest = yearDestData[0];

  let label;
  let value;
  let barsData = [];
  let barsLabel = `Top ${maxCountries} origin countries`;

  // Handle each of these cases:
  // - no data (zero)
  // - multiple src, multiple dest
  // - single src, multiple dest
  // - multiple src, single dest
  // - single src, single dest
  if (zeroSrc(data) || zeroDest) {
    label = '';
    value = '';
  } else if (multipleSrc && multipleDest) {
    label = `Total from origins to destinations`;
    value = commaFormat(sum(yearSrcData, d => d.value));
    barsData = yearSrcData;
  } else if (singleSrc && multipleDest) {
    label = `Total from ${src.name}`;
    value = commaFormat(src.value);
    barsData = yearDestData;
    barsLabel = `Top ${maxCountries} destination countries`;
  } else if (multipleSrc && singleDest) {
    label = `Total to ${dest.name}`;
    value = commaFormat(dest.value);
    barsData = yearSrcData;
  } else if (singleSrc && singleDest) {
    label = `Total from ${src.name} to ${dest.name}`;
    value = commaFormat(dest.value); // Same as src.value
    barsLabel = '';
  }

  select('#details-statistic-label').text(label);
  select('#details-statistic-value').text(value);
  select('#details-bars-label').text(barsLabel);

  selection.call(detailsBarChart, {
    data: topN(barsData),
    maxCountries
  });
};
