import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const Config = {
  devtool: 'inline-source-map',
  entry: './src/main.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
  },
  module: {
    // postLoaders: [
    //   {
    //     test: /\.js$/,
    //     loader: 'ify',
    //   },
    // ],
    loaders: [
      {
        test: /\.tpl\.html$/,
        use: [
          {
            loader: 'underscore-template-loader',
            options: {
              attributes: [],
            },
          },
        ],
      },
      // {
      //   test: /\.html$/,
      //   use: [{ loader: 'html-loader' }]
      // },
      // {
      //   test: /node_modules/,
      //   loader: 'ify',
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'syntax-dynamic-import',
                'transform-decorators-legacy',
              ],
            },
          },
        ],
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              // url: false // @TODO - CW - we don't want this
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer],
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(glsl|frag|vert|vs|fs)$/,
        loader: 'raw-loader!glslify-loader',
        exclude: /node_modules/,
      },
      {
        test: /animation.gsap\.js$/,
        loader: 'imports?define=>false',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'src/template/index.html',
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new CopyWebpackPlugin([
      { from: 'static' },
    ]),
  ],
};

module.exports = Config;
