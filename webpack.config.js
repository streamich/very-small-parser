const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEV = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: DEV ? 'development' : 'production',
  devtool: DEV ? 'source-map' : false,
  entry: {
    bundle: __dirname + '/esm/index',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'very-small-parser',
    }),
    new webpack.ContextReplacementPlugin(/\/highlight.js\//, (data) => {
      delete data.dependencies[0].critical;
      return data;
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: process.env.BUILD_TARGET === 'cjs' ? 'index.js' : 'module.js',
    libraryTarget: process.env.BUILD_TARGET === 'cjs' ? 'commonjs2' : 'module',
  },
  experiments: {
    outputModule: true,
  }
};
