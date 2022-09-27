const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  optimization: {
    minimize: true,
  },
};

if (process.env.NODE_ENV === 'development') {
  tempConfig = {
    ...base,
    entry: path.join(__dirname, 'example/src/index.tsx'),
    output: {
      path: path.join(__dirname, 'example/dist'),
      filename: 'bundle.js',
      library: 'laputarenderer',
      libraryTarget: 'umd',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './example/src/index.html'),
        filename: 'index.html',
      }),
    ],
    devServer: {
      port: 9090,   
    },
  };
}else{
    tempConfig = {
        ...base,
        entry: './src/index.ts',
        output: {
          filename: 'index.js',
          path: path.resolve(__dirname, 'dist'),
          library: 'laputarenderer',
          libraryTarget: 'umd'
        },
        devtool: 'source-map', 
        externals: {
          'react': 'react',
          'react-dom': 'react-dom'
        },
        plugins: [
          new CleanWebpackPlugin(),
        ],
      };
}

module.exports = tempConfig;