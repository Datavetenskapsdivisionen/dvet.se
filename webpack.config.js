const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
  },
  experiments: {
    outputModule: true
  },
  entry: {
    public: { import: "./src/www/index.js", filename: "[name].js" },
    wiki: {
      import: "./wiki-cache/wiki.js", filename: "[name].js", library: {
        type: "window"
      }
    },
    secretWiki: { import: "./wiki-cache/secret-wiki.js", filename: "../dist-secret/[name].js" }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  mode: "development",
  optimization: {
    chunkIds: "size",
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 200000,
      maxSize: 450000,
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: true,
        },
      }),
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/www/index.html",
      favicon: "./assets/favicon.png",
    }),
    new CompressionPlugin({
      deleteOriginalAssets: (name) => {
        if (name == "index.html") {
          return false;
        }

        return true;
      },
    })
  ],
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png|jpg|gif$/,
        use: ["file-loader"],
      },
      {
        test: /\.md|csv$/,
        use: ["raw-loader"],
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource'
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
};
