module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.(css|less)$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            // options: {
            //   modules: {
            //     localIdentName: "[hash:base64:6]",
            //   },
            // },
          },
          { loader: "less-loader" },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
