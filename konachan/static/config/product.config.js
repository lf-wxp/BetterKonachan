const base = require('./base.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const proPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'manifest']
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: true
    })
];
base.module.rules.push({
    test: /\.(sass|scss)$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
        use: ['css-loader', 'sass-loader'],
        fallback: 'style-loader',
        publicPath: '../dist/css/'
    })
});
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: base.entry,
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: '/assets/',
        path: 'dist',
    },
    module: base.module,
    devtool: 'cheap-module-source-map',
    resolve: base.resolve,
    plugins: base.plugins.concat(proPlugins),
    performance: {
        hints: "error"
    }
}