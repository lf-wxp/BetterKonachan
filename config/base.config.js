const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const path = require('path');

const entry = {
    app: ['babel-polyfill', './app.js'],
};

const wpModule = {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
    }, {
        test: /\.vue$/,
        use: ['vue-loader'],
    }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 1000,
            },
        }],
    }, {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: 'fonts/[name].[ext]',
            },
        }],
    }],
};

const plugins = [
    new HtmlWebpackPlugin({
        title: 'Better Konachan',
        template: 'index.ejs',
        chunks: ['app'],
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
        name: 'webpackManifest',
    }),
];

const resolve = {
    alias: {
        components: path.resolve(__dirname, '../resource/components'),
        modules: path.resolve(__dirname, '../resource/modules'),
        assets: path.resolve(__dirname, '../resource/assets/'),
        base: path.resolve(__dirname, '../resource/'),

    },
    modules: [path.resolve(__dirname, '../resource/modules'), 'node_modules'],
    extensions: ['.js', '.css', '.json', '.vue'],
};
module.exports = {
    entry,
    module: wpModule,
    plugins,
    resolve,
};
