const base = require('./base.config.js');
const webpack = require('webpack');
const path = require('path');

const devPlugins = [
    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
    }),
];
base.module.rules.push({
    test: /css$/,
    use: ['vue-style-loader', {
        loader: 'css-loader',
        options: {
            importLoaders: 1
        }
    }, 'postcss-loader'],
});
module.exports = {
    mode: 'development',
    entry: base.entry,
    context: path.resolve(__dirname, '../assets/'),
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/',
        globalObject: 'this'
        // path: path.resolve(__dirname, 'dist')
    },
    module: base.module,
    resolve: base.resolve,
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        compress: true,
        port: 9999,
        host: '0.0.0.0',
        hot: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8888',
            },
            '/ws': {
                target: 'ws://localhost:8888',
                ws: true,
            }
        },
        stats: 'minimal',
    },
    plugins: base.plugins.concat(devPlugins),
    performance: {
        hints: 'warning',
    },
};
