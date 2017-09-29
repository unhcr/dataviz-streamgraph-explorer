import { format } from 'd3-format';
import { select } from 'd3-selection';
import { extent, descending } from 'd3-array';
import detailsBarChart from './detailsBarChart';

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

// Takes the first 20 elements of the data array.
const top20 = data => data.slice(0, 20);

// This is the top-level component that manages the
// elements within the details view.
export default function (selection, year, srcData, destData) {

  // Compute the filtered data for the selected year.
  const yearSrcData = getYearData(year, srcData);
  const yearDestData = getYearData(year, destData);

  // Figure out if there are multipld src/dest.
  const zeroSrc = yearSrcData.length === 0;
  const zeroDest = yearDestData.length === 0;
  const multipleSrc = yearSrcData.length > 1;
  const multipleDest = yearDestData.length > 1;
  const singleSrc = !multipleSrc;
  const singleDest = !multipleDest;

  const src = yearSrcData[0];
  const dest = yearDestData[0];

  let label;
  let value;
  let data;

  // Handle each of these cases:
  // - no data (zero)
  // - multiple src, multiple dest
  // - single src, multiple dest
  // - multiple src, single dest
  // - single src, single dest
  if (zeroSrc || zeroDest) {
    label = '';
    value = '';
    data = [];
  } else if (multipleSrc && multipleDest) {
  } else if (singleSrc && multipleDest) {
    label = `Total from ${src.name}`;
    value = commaFormat(src.value);
    data = yearDestData;
  } else if (multipleSrc && singleDest) {
    label = `Total to ${dest.name}`;
    value = commaFormat(dest.value);
    data = yearSrcData;
  } else if (singleSrc && singleDest) {
    label = `Total from ${src.name} to ${dest.name}`;
    value = commaFormat(dest.value); // Same as src.value
  }

  select('#details-statistic-label').text(label);
  select('#details-statistic-value').text(value);
  selection.call(detailsBarChart, top20(data));
};
