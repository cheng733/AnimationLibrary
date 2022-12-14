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
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64:6]',
              },
            }
          },
          { loader: 'less-loader', },
        ]
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
    entry: path.join(__dirname, './src/example/src/index.tsx'),
    output: {
      path: path.join(__dirname, './src/example/dist'),
      filename: 'bundle.js',
      library: 'animationLibrary',
      libraryTarget: 'umd',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/example/src/index.html'),
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
          library: 'animationLibrary',
          libraryTarget: 'umd'
        },
        devtool: 'source-map', 
        externals: {
          'react': 'react',
          'react-dom': 'react-dom',
          'hgc-utils':"hgc-utils"
        },
        plugins: [
          new CleanWebpackPlugin(),
        ],
      };
}

module.exports = tempConfig;