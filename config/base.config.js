const HtmlWebpackPlugin = require('html-webpack-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const entry = {
    index: './src/app.ts',
};

const wpModule = {
    rules: [{
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
            loader: 'tslint-loader',
        }]
    }, {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
            loader: 'ts-loader',
            options: {
                configFile: path.resolve(__dirname, '../resource/src/tsconfig.json'),
                appendTsSuffixTo: [/\.vue$/],
            },
        }],
    }, {
        test: /\.vue$/,
        use: [{
            loader: 'vue-loader',
            options: {
                esModule: true,
                postcss: [
                    require('postcss-normalize')({
                        'browserslist': 'last 2 versions',
                    }),
                    require('postcss-import')({
                        path: ['resource/src/css', 'resource/src/fonts', 'resource/src/images'],
                    }),
                    require('postcss-cssnext'),
                ]
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
        title: 'Movie Manager',
        template: './src/app.html',
        chunks: ['index'],
    }),
    // new InlineManifestWebpackPlugin({
    //     name: 'webpackManifest',
    // }),
    new webpack.WatchIgnorePlugin([
        /css\.d\.ts$/
    ])
];

const resolve = {
    alias: {
        components: path.resolve(__dirname, '../assets/src/components'),
        modules: path.resolve(__dirname, '../resource/src/module'),
        src: path.resolve(__dirname, '../resource/src/'),

    },
    modules: [path.resolve(__dirname, '../modules'), 'node_modules'],
    extensions: ['.ts', '.css', '.json', '.vue', '.js'],
};
module.exports = {
    entry,
    module: wpModule,
    plugins,
    resolve,
};
