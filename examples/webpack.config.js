const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./examples/src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./examples/dist",
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./examples/src/index.html",
    }),
  ],
};
