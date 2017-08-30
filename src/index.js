import { select } from 'd3-selection';
import { json } from 'd3-request';
import resize from './resize';

// Set up the behavior that resizes the SVG elements
// on load and when the browser window resizes.
resize();

// Set background color to be pink so we can see the SVGs (temporary).
select('#focus svg').style('background-color', 'pink');
select('#details svg').style('background-color', 'pink');

const unpack = packedData => {
  const data = [];

  const codeValues = packedData.codeValues;
  const nested = packedData.nested;

  const years = Object.keys(nested);
  years.forEach(year => {
    const byType = nested[year];
    Object.keys(byType).forEach(type => {
      const bySrcCode = byType[type];
      Object.keys(bySrcCode).forEach(srcCode => {
        const src = codeValues[srcCode];
        const byDestCode = bySrcCode[srcCode];
        Object.keys(byDestCode).forEach(destCode => {
          const dest = codeValues[destCode];
          const value = byDestCode[destCode];

          data.push({ year, src, dest, type, value });

        });
      });
    });
  });

  return data;
};

// Load and unpack the data.
json('data/data.json', packedData => {
  const data = unpack(packedData);
  console.log(data);
});
