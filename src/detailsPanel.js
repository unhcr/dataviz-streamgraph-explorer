import { format } from 'd3-format';
import { select } from 'd3-selection';
import { extent, descending } from 'd3-array';
import detailsBarChart from './detailsBarChart';

// This is the top-level component that manages the
// elements within the details view.
const commaFormat = format(',');
export default function (selection, year, srcData, destData) {

  // Compute the filtered data for the selected year.
  const yearSrcData = srcData[year];

  // Transform the data for use in a bar chart.
  const srcBarsData = Object.keys(yearSrcData)
    .map(key => ({
      name: key,
      value: yearSrcData[key]
    }))
    .sort((a, b) => descending(a.value, b.value));

  // Update the text of the details panel statistic.
  const yearDestData = destData[year];
  const destName = Object.keys(yearDestData)[0];
  const statisticLabel = `Total in ${destName}`;
  const statisticValue = Object.values(yearDestData)[0];

  select('#details-statistic-label')
      .text(statisticLabel);

  select('#details-statistic-value')
      .text(commaFormat(statisticValue));

  // Render the details bar chart for the selected year.
  selection.call(detailsBarChart, srcBarsData);
};

  // Handle each of these cases:
  // - multiple src, multiple dest
  // - single src, multiple dest
  // - multiple src, single dest
  // - single src, single dest
