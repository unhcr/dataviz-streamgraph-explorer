const fs = require('fs');
const d3 = require('d3-dsv');

const csvStringRaw = fs.readFileSync('time_series.csv', 'utf8');
const csvString = csvStringRaw.substr(170, 1000);

const csvData = d3.csvParse(csvString);

// Each data entry looks like this:
// { Year: '1951',
//   'Country / territory of asylum/residence': 'Australia',
//   Origin: 'Various/Unknown',
//   'Population type': 'Refugees (incl. refugee-like situations)',
//   Value: '180000' }

const data = csvData.map(d => ({
  year: d.Year,
  src: d.Origin,
  dest: d['Country / territory of asylum/residence'],
  type: d['Population type'],
  value: +d.Value
}));

console.log(data[0]);
