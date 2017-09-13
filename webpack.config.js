const path = require('path');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'dist/bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  {
    entry: './src/apiSimulationWorker.js',
    output: {
      filename: 'dist/apiSimulationWorker.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
];
