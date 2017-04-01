const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require("webpack-chunk-hash");
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const entry = {
    app: ['babel-polyfill', './app.js']
};

const wpModule = {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
    }, {
        test: /\.vue$/,
        use: ['vue-loader']
    }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 1000
            }
        }]
    }, {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: 'fonts/[name].[ext]'
            }
        }]
    }]
};

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Better Konachan',
        template: 'index.ejs',
        chunks: ['app']
    }),
    // new WebpackChunkHash(),
    // new ManifestPlugin({
    //     fileName:'myManifest.json'
    // }),
    // new ChunkManifestPlugin({
    //     filename: "chunk-manifest.json",
    //     manifestVariable: "webpackManifest",
    //      name: 'webpackManifest'
    // }),
    new InlineManifestWebpackPlugin({
        name: 'webpackManifest'
    })
];

const resolve = {
    alias: {
        components: path.join(__dirname, '../src/components'),
        modules: path.join(__dirname, '../src/modules'),
        sass: path.join(__dirname, '../src/assets/sass'),
        fonts: path.join(__dirname, '../src/assets/fonts'),
        images: path.join(__dirname, '../src/assets/images'),
        lib: path.join(__dirname, '../src/lib'),
        servers: path.join(__dirname, '../src/servers'),
        store: path.join(__dirname, '../src/store')
    },
    modules: [path.resolve(__dirname, '../modules'), 'node_modules'],
    extensions: ['.js', '.scss', '.json', '.vue'],
};
module.exports = {
    entry,
    module: wpModule,
    plugins,
    resolve
}