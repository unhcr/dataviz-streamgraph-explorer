const path = require('path');

module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  {
    entry: './src/apiSimulationWorker.js',
    output: {
      filename: 'apiSimulationWorker.js',
      path: path.resolve(__dirname, 'dist')
    }
  }
];
