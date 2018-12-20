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
        // {
        //     enforce: 'pre',
        //     test: /\.ts$/,
        //     exclude: [/node_modules/],
        //     use: [
        //         {
        //             loader: 'tslint-loader',
        //         },
        //     ],
        // },
        {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        // configFile: path.resolve(__dirname, '../assets/src/tsconfig.json'),
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },
            ],
        },
        {
            test: /\.vue$/,
            use: [
                {
                    loader: 'vue-loader',
                    options: {
                        esModule: true,
                    },
                },
            ],
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                    },
                },
            ],
        },
        {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                    },
                },
            ],
        },
    ],
};

const plugins = [
    new HtmlWebpackPlugin({
        template: './src/app.html',
        favicon: path.resolve(__dirname, '../assets/src/image/favicon.ico'),
    }),
    // new InlineManifestWebpackPlugin({
    //     name: 'webpackManifest',
    // }),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
    new VueLoaderPlugin(),
];

const resolve = {
    alias: {
        '~component': path.resolve(__dirname, '../assets/src/component'),
        '~service': path.resolve(__dirname, '../assets/src/service.ts'),
        '~cModule': path.resolve(__dirname, '../assets/src/module'),
        '~css': path.resolve(__dirname, '../assets/src/css'),
        '~src': path.resolve(__dirname, '../assets/src/'),
        '~font': path.resolve(__dirname, '../assets/src/font'),
        '~image': path.resolve(__dirname, '../assets/src/image'),
        '~model': path.resolve(__dirname, '../model'),
        '~cModel': path.resolve(__dirname, '../assets/src/model'),
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
