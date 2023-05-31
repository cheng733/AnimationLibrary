const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const resolve = (p) => path.resolve(__dirname, `../${p}`);

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: resolve("./src/example/index.tsx"),
  output: {
    path: resolve("./src/public"),
    filename: "[name].js",
    clean: true,
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve("./src/public/index.html"),
      inject: true,
    }),
  ],
  devServer: {
    port: 9191,
    compress: false,
    hot: true,
  },
});
