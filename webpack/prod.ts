import merge from 'webpack-merge';
import basicConfig from './basic';
import webpack from 'webpack';
import { resolve } from 'path';
const { InjectManifest } = require('workbox-webpack-plugin');
const pwaManifest = require('webpack-pwa-manifest');

export default merge(basicConfig, {
    mode: 'production',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: resolve(__dirname, '../assets/dist'),
        publicPath: './assets/dist/'
        // path: path.resolve(__dirname, 'dist')
    },
    performance: {
        hints: 'error',
        maxEntrypointSize: 4000000,
        maxAssetSize: 4000000
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new pwaManifest({
            name: 'BetterKonachan',
            short_name: 'BetterKonachan',
            description: 'BetterKonachan',
            background_color: '#ffffff',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            start_url: '/',
            ios: true,
            publicPath: '/assets/dist/',
            icons: [
                {
                    src: resolve(__dirname, '../assets/src/image/icon.jpg')
                }
            ]
        }),
        new InjectManifest({
            swSrc: resolve(__dirname, '../assets/src/sw.js'),
            swDest: '../../sw.js',
            importWorkboxFrom: 'local',
            globPatterns: ['**/*.{html,js,css,mp3}']
        })
    ]
});
