import merge from 'webpack-merge';
import basicConfig from './basic';
import webpack from 'webpack';
import path from 'path';
//@ts-ignore
import webpackDevServer from 'webpack-dev-server';

export default merge(basicConfig, {
    mode: 'development',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/',
        globalObject: 'this'
        // path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        hot: true, // enable HMR on the server
        port: 9999,
        host: '0.0.0.0',
        historyApiFallback: true,
        publicPath: '/',
        contentBase: path.resolve(__dirname, '../'),
        proxy: {
            '/api': {
                target: 'http://localhost:8888'
            },
            '/ws': {
                target: 'ws://localhost:8888',
                ws: true
            }
        }
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
    ],
    performance: {
        hints: false
    }
});
