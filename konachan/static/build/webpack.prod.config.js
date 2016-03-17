var webpack = require('webpack')
var config = require('./webpack.base.config')
var StringReplacePlugin = require('string-replace-webpack-plugin');
config.output.publicPath = 'http://acglife.club/static/dist/';
config.plugins = (config.plugins || []).concat([
  // this allows uglify to strip all warnings
  // from Vue.js source code.
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  // This minifies not only JavaScript, but also
  // the templates (with html-minifier) and CSS (with cssnano)!
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new StringReplacePlugin()
])

/*
* replace the test server address
*/
config.module.loaders = (config.module.loaders || []).concat([
    {
        test: /servers\.js/,
        loader: StringReplacePlugin.replace({ 
            replacements: [
                {
                    pattern: /http:\/\/localhost:\d+/ig,
                    replacement: function(match, p1, offset, string) {
                       return "";
                    }
                }
            ]
        })
    }
])
module.exports = config
