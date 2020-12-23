import { resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { InjectManifest } from 'workbox-webpack-plugin';
import pwaManifest from 'webpack-pwa-manifest';

const isDev = process.env.NODE_ENV === 'development';

export default {
  mode: isDev ? 'development' : 'production',
  entry: './index.tsx',
  context: resolve(__dirname, '../assets'),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.p?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
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
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: isDev ? 'http://localhost:9999/' : '/',
    path: resolve(__dirname, '../../dist/assets'),
    globalObject: 'this',
  },
  ...(isDev
    ? {
        devServer: {
          hot: true, // enable HMR on the server
          port: 9999,
          host: '0.0.0.0',
          historyApiFallback: true,
          publicPath: 'http://localhost:9999/',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
              'X-Requested-With, content-type, Authorization',
          },
          proxy: {
            '/api/**': {
              target: 'http://localhost:3000/',
              changeOrigin: true,
            },
          },
        },
      }
    : {}),
  ...(isDev ? { devtool: 'cheap-module-source-map' } : {}),
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../assets/index.html'),
      favicon: resolve(__dirname, '../assets/image/favicon.jpg'),
    }),
    new webpack.EnvironmentPlugin('NODE_ENV'),
    !isDev &&
      new pwaManifest({
        name: 'BetterKonachan',
        short_name: 'BetterKonachan',
        description: 'BetterKonachan',
        background_color: '#ffffff',
        crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
        start_url: '/',
        ios: true,
        publicPath: '/',
        icons: [
          {
            src: resolve(__dirname, '../assets/image/icon.jpg'),
            sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          },
        ],
      }),
    !isDev &&
      new InjectManifest({
        swSrc: resolve(__dirname, '../assets/sw.ts'),
        swDest: resolve(__dirname, '../../dist/assets/sw.js'),
        maximumFileSizeToCacheInBytes: 20000000,
      }),
    isDev &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
        forceEnable: true,
      }),
  ].filter(Boolean),
};
