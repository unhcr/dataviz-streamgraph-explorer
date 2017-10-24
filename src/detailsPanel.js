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

// Figure out if there are zero, multiple, or single src/dest.
const zeroSrc = data => data.yearSrcData.length === 0;
const zeroDest = data => data.yearDestData.length === 0;
const multipleSrc = data => data.yearSrcData.length > 1;
const multipleDest = data => data.yearDestData.length > 1;
const singleSrc = data => !multipleSrc(data);
const singleDest = data => !multipleDest(data);

// These accessors extract the single source and destination.
const src = data => data.yearSrcData[0];
const dest = data => data.yearDestData[0];

// Compute the label for the statistic.
const label = data => {
  if (zeroSrc(data) || zeroDest(data)) {
    return '';
  } else if (multipleSrc(data) && multipleDest(data)) {
    return `Total from origins to destinations`;
  } else if (singleSrc(data) && multipleDest(data)) {
    return `Total from ${src(data).name}`;
  } else if (multipleSrc(data) && singleDest(data)) {
    return `Total to ${dest(data).name}`;
  } else if (singleSrc(data) && singleDest(data)) {
    return `Total from ${src(data).name} to ${dest(data).name}`;
  }
};

// Compute the value for the statistic.
const value = data => {
  if (zeroSrc(data) || zeroDest(data)) {
    return '';
  }

  let number;

  if (multipleSrc(data) && multipleDest(data)) {
    number = sum(data.yearSrcData, d => d.value);
  } else if (singleSrc(data) && multipleDest(data)) {
    number = src(data).value;
  } else if (multipleSrc(data) && singleDest(data)) {
    number = dest(data).value;
  } else if (singleSrc(data) && singleDest(data)) {
    number = dest(data).value; // Same as src.value
  }

  return commaFormat(number);
};

// Compute the data shown in the bars.
const barsData = data => {
  if (multipleSrc(data) && multipleDest(data)) {
    return data.yearSrcData;
  } else if (singleSrc(data) && multipleDest(data)) {
    return data.yearDestData;
  } else if (multipleSrc(data) && singleDest(data)) {
    return data.yearSrcData;
  }
  return [];
}

// Compute the label to show as the title for the bars.
const barsLabel = data => {
  if (zeroSrc(data) || zeroDest(data)) {
    return `Top ${maxCountries} origin countries`;
  } else if (multipleSrc(data) && multipleDest(data)) {
    return `Top ${maxCountries} origin countries`;
  } else if (singleSrc(data) && multipleDest(data)) {
    return `Top ${maxCountries} destination countries`;
  } else if (multipleSrc(data) && singleDest(data)) {
    return `Top ${maxCountries} origin countries`;
  } else if (singleSrc(data) && singleDest(data)) {
    return '';
  }
}

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

  select('#details-statistic-label').text(label(data));
  select('#details-statistic-value').text(value(data));
  select('#details-bars-label').text(barsLabel(data));

  selection.call(detailsBarChart, {
    data: topN(barsData(data)),
    maxCountries
  });
};
