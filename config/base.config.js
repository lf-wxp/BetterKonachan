const HtmlWebpackPlugin = require('html-webpack-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const entry = {
    index: './src/app.ts',
};

const wpModule = {
    rules: [
    //     {
    //     enforce: 'pre',
    //     test: /\.ts$/,
    //     exclude: ['node_modules'],
    //     use: [{
    //         loader: 'tslint-loader',
    //     }]
    // }, 
    {
        test: /\.ts$/,
        exclude: ['node_modules'],
        use: [{
            loader: 'ts-loader',
            options: {
                configFile: path.resolve(__dirname, '../assets/src/tsconfig.json'),
                appendTsSuffixTo: [/\.vue$/],
            },
        }],
    }, {
        test: /\.vue$/,
        use: [{
            loader: 'vue-loader',
            options: {
                esModule: true,
            },
        }]
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
        template: './src/app.html',
        favicon: path.resolve(__dirname, '../assets/src/images/favicon.ico'),
        chunks: ['index'],
    }),
    // new InlineManifestWebpackPlugin({
    //     name: 'webpackManifest',
    // }),
    new webpack.WatchIgnorePlugin([
        /css\.d\.ts$/
    ]),
    new VueLoaderPlugin(),
];

const resolve = {
    alias: {
        components: path.resolve(__dirname, '../assets/src/components'),
        modules: path.resolve(__dirname, '../assets/src/modules'),
        src: path.resolve(__dirname, '../assets/src/'),
        css: path.resolve(__dirname, '../assets/src/css'),
        fonts: path.resolve(__dirname, '../assets/src/fonts'),
        images: path.resolve(__dirname, '../assets/src/images'),
    },
    modules: [path.resolve(__dirname, '../modules'), 'node_modules'],
    extensions: ['.ts', '.css', '.json', '.vue', '.js', '.png', '.jpg', '.svg'],
};
module.exports = {
    entry,
    module: wpModule,
    plugins,
    resolve,
};
