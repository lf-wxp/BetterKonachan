var path = require('path');
var baseUrl = path.join(__dirname, '..');
module.exports = {
    context: baseUrl,
    entry: ['babel-polyfill','./src/main'],
    output: {
        path: './dist',
        publicPath: 'dist/',
        sourceMapFilename: '[file].map',
        filename: 'build.js'
    },
    // 服务器配置相关，自动刷新!
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        grogress: true,
        proxy: {
            '/post': 'http://localhost:8000',
            '/pic': 'http://localhost:8000',
            '/music': 'http://localhost:8000'
        }
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            // make sure to exclude 3rd party code in node_modules
            exclude: /node_modules/
        }, {
            // edit this for additional asset file types
            test: /\.(png|jpg|gif)$/,
            loader: 'url',
            query: {
                // inline files smaller then 10kb as base64 dataURL
                limit: 10000,
                // fallback to file-loader with this naming scheme
                name: '[name].[ext]?[hash]'
            }
        }, {
            test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'url-loader?name=fonts/[name].[ext]'

        }]
    },
    // vue-loader config:
    // lint all JavaScript inside *.vue files with ESLint
    // make sure to adjust your .eslintrc
    vue: {
        loaders: {
            js: 'babel'
        }
    }
}