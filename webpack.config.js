var path = require('path');
var webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
const DEV_MODE = process.env.NODE_ENV === 'development'

var config = {
  mode: DEV_MODE ? 'development' : 'production',
  devtool: DEV_MODE ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, 'src'),
        ],
        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,
        // Options to configure babel with
        query: {
          plugins: ['transform-runtime', 'transform-object-rest-spread', ["transform-es2015-classes", {
            "loose": true
          }],[
            "babel-plugin-root-import",
            {
              "rootPathSuffix": "./src/",
              "rootPathPrefix": "~/"
            }
          ]],
          presets: [['env', {
            'targets': {
              'browsers': [
                'last 2 versions',
                'ie >= 10'
              ]
            }
          }]],
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.csv$/,
        loader: 'raw-loader',
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './'),
    publicPath: '/'
  },
  entry: [ './src/index.js' ],
  watch: false,
  resolve: {
    alias: {
      appconfig: path.resolve(__dirname, 'src/config', process.env.NODE_ENV),
    }
  }
};

module.exports = config
