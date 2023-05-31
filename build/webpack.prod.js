const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const resolve = (p) => path.resolve(__dirname, p);

module.exports = merge(baseConfig, {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: resolve("dist"),
    library: "animationLibrary",
    libraryTarget: "umd",
    clean: true,
  },
  devtool: "source-map",
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "hgc-utils": "hgc-utils",
  },
});
