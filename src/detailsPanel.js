import { format } from 'd3-format';
import { select } from 'd3-selection';
import { extent, descending } from 'd3-array';
import detailsBarChart from './detailsBarChart';

const commaFormat = format(',');

// Extracts the data for the given year,
// and transforms it into a sorted array.
function getYearData(year, data){
  return Object.keys(data[year])
    .map(key => ({
      name: key,
      value: data[year][key]
    }))
    .sort((a, b) => descending(a.value, b.value));
}

// This is the top-level component that manages the
// elements within the details view.
export default function (selection, year, srcData, destData) {

  // Compute the filtered data for the selected year.
  const yearSrcData = getYearData(year, srcData);
  const yearDestData = getYearData(year, destData);

  // Figure out if there are multipld src/dest.
  const multipleSrc = yearSrcData.length > 1;
  const multipleDest = yearDestData.length > 1;
  const singleSrc = !multipleSrc;
  const singleDest = !multipleDest;

  // Handle each of these cases:
  // - multiple src, multiple dest
  // - single src, multiple dest
  // - multiple src, single dest
  // - single src, single dest
  if (multipleSrc && multipleDest) {
  } else if (singleSrc && multipleDest) {
  } else if (multipleSrc && singleDest) {
    const dest = yearDestData[0];
    select('#details-statistic-label').text(`Total in ${dest.name}`);
    select('#details-statistic-value').text(commaFormat(dest.value));
    selection.call(detailsBarChart, yearSrcData);
  } else if (singleSrc && singleDest) {
  }
};
