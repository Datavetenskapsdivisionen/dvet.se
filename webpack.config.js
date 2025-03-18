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
    public: { import: "./frontend/index.js", filename: "[name].js" },
    wiki: {
      import: "./frontend/wiki-cache/wiki.js", filename: "../dist-secret/[name].js", library: {
        type: "window"
      }
    },
    secretWiki: {
      import: "./frontend/wiki-cache/secret-wiki.js", filename: "../dist-secret/[name].js", library: {
        type: "window"
      }
    }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "frontend/dist"),
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
      template: "./frontend/index.html",
      favicon: "./frontend/assets/favicon.png",
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
    modules: [__dirname, "frontend", "node_modules"],
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
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(md|csv)$/,
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
