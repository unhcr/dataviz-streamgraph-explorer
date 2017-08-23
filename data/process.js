const fs = require('fs');
const d3 = Object.assign(
  {},
  require('d3-dsv'),
  require('d3-collection')
);

const csvStringRaw = fs.readFileSync('time_series.csv', 'utf8');
const csvString = csvStringRaw.substr(170);

const csvData = d3.csvParse(csvString);

const codes = {}; // value --> code
const codeValues = []; // code (an integer) --> value
const getCode = value => {
  let code = codes[value];
  if (code === undefined) {
    code = codes[value] = codeValues.length;
    codeValues.push(value);
  }
  return code;
};

// Each data entry looks like this:
// { Year: '1951',
//   'Country / territory of asylum/residence': 'Australia',
//   Origin: 'Various/Unknown',
//   'Population type': 'Refugees (incl. refugee-like situations)',
//   Value: '180000' }

const data = csvData.map(d => ({
  year: d.Year,
  src: getCode(d.Origin),
  dest: getCode(d['Country / territory of asylum/residence']),
  type: d['Population type'],
  value: +d.Value
}));

const nested = d3.nest()
  .key(d => d.year)
  .key(d => d.type)
  .key(d => d.src)
  .key(d => d.dest)
  .rollup(values => values[0].value)
  .object(data);

const outputData = { codeValues, nested };

fs.writeFileSync('data.json', JSON.stringify(outputData));
