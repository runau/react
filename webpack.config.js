var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './js/client.js',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/'
  },
  plugins: debug
    ? [
        new HtmlWebpackPlugin({
          template: './index.html',
          filename: 'index.html'
        })
      ]
    : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
      ]
};
