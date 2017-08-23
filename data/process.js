const fs = require('fs');
const d3 = require('d3-dsv');

const csvStringRaw = fs.readFileSync('time_series.csv', 'utf8');
const csvString = csvStringRaw.substr(170, 1000);

const csvData = d3.csvParse(csvString);

console.log(csvData[0]);
