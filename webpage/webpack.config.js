const path = require('path');
const Dotenv = require('dotenv-webpack');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  mode: 'development',
  entry: __dirname + '/src/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    new Dotenv(),
    new WorkerPlugin()
  ]
}
