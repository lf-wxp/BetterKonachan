const base = require('./base.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const proPlugins = [
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin('css/[name].css'),
];
base.module.rules.push({
    test: /\.css$/,
    exclude: ['node_modules'],
    use: ExtractTextPlugin.extract({
        use: ['css-loader', 'postcss-loader'],
        fallback: 'vue-style-loader',
        publicPath: '../assets/dist/css/',
    }),
});
module.exports = {
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: "initial", // 必须三选一： "initial" | "all"(默认就是all) | "async" 
            minSize: 0, // 最小尺寸，默认0
            minChunks: 1, // 最小 chunk ，默认1
            maxAsyncRequests: 1, // 最大异步请求数， 默认1
            maxInitialRequests: 1, // 最大初始化请求书，默认1
            name: function () {}, // 名称，此选项可接收 function
            cacheGroups: { // 这里开始设置缓存的 chunks
                priority: false, // 缓存组优先级
                vendor: { // key 为entry中定义的 入口名称
                    chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是异步) 
                    test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
                    name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 1, // 最大异步请求数， 默认1
                    maxInitialRequests: 1, // 最大初始化请求书，默认1
                    reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    },
    context: path.resolve(__dirname, '../assets/'),
    entry: base.entry,
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: '/assets/',
        path: path.resolve(__dirname, '../assets/dist'),
    },
    module: base.module,
    devtool: 'cheap-module-source-map',
    resolve: base.resolve,
    plugins: base.plugins.concat(proPlugins),
    performance: {
        hints: 'error',
    },
};
