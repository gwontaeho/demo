const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (env, argv) {
  return {
    entry: "./src/index.js",
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { config: "./src/config/postcss.config.js" },
              },
            },
          ],
        },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/public/index.html" })],
    // 번들
    output: {
      publicPath: "/",
    },
    // 라우터
    devServer: {
      historyApiFallback: true,
    },
  };
};
