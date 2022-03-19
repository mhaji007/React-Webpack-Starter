// Pulls in a value of dev or build depending on the npm task that is being run
// used to configure webpack conditionally
const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = {
  mode: 'development',
  // allows importing files without the extension
  // e.g. `import example from './example'`
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  // the following syntax can be used when application only has one entry
  // entry: path.resolve(__dirname, "src/app.js") },

  //  Entry point when not using typescript
  // entry: {
  //   main: path.resolve(__dirname, "src/app.js"),
  // },

  // The following syntax will allow for multiple entry points
  entry: {
    main: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename could be set either manually "app.bundle.js" or generated
    // dynamically as below. [name] will be the same as "main" taken from entry name above
    // [contenthash] aka cache buster hashes the file and ouputs a unique name that way
    // when it is in the browser it will have a unique name and this
    // enables the browser to cache that specific version of the file
    // Everytime a chnage is made to project files we will have a new version and visitor's browser will know that it should donwload the new version instead of the previously donwloaded old copy
    filename: '[name].[contenthash].bundle.js',
    // [name] will be the 'as-is' name as we imported it
    assetModuleFilename: '[name][ext]',
    // Everytime we build we will have a long list of files
    // this option cleans the dist folder and leaves the new files after every build
    clean: true,
  },
  devtool: 'cheap-module-source-map',
  // devtool: "eval-cheap-source-map",
  // devtool: "inline-source-map",

  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

  // Inject or replace the new version of js in memory
  devServer: {
    // Folder to use as the base for web server preview (previously known as contentBase)
    static: path.resolve(__dirname, 'dist'),
    port: 5001, //default 8080
    // Open default browser
    open: true,
    // Enable hot module replacement
    hot: true,
    // watchContentBase: true,
  },
  // Loaders
  module: {
    rules: [
      // Load css - style loader makes styles available (injects it in the html) - css loader is responsible for modularizing and making it available/outputting it in the bundle (inlines the css within the build - inside main.js)
      {
        test: /\.(s[ac]|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        // use: [
        //   'style-loader',
        //   {
        //     loader: 'css-loader',
        //     options: {
        //       importLoaders: 1,
        //       modules: true,
        //     },
        //   },
        //   'postcss-loader',
        //   'sass-loader',
        // ],
      },

      // Load images using the built-in asset resource loader (webpack version 5 and above. In webpack 4 additional file loader is required)
      {
        test: /\.(?:ico|svg|png|webp|jpg|gif|jpeg|woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },

      // JS, JSX, TS, TSX for babel
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        // When use has options we use object instead of array.
        // Without additional settings this will reference .babelrc
        use: {
          loader: 'babel-loader',

          // options: {
          //   presets: ["@babel/preset-env", "@babel/preset-react"],
          // },

          // just using @babel/preset-env as above will enable browser backward compatibility
          // but limits support for features such as async await. To ensure both backward
          // compatiblity and ability to use latest features we use below
          // options: {
          //   presets: [
          //     [
          //       "@babel/preset-env",
          //       { useBuiltIns: "usage", corejs: 3, targets: "defaults" },
          //     ],
          //     "@babel/preset-react",
          //   ],
          // },
        },
      },

      // Used for non-react (pure JS) typescript support
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "ts-loader",
      //   },
      // },

      // In Webpack 4 we would probably use url loader but in webpack 5 and above we can use the built in asset inline module type for fonts and svgs

      // {
      //   test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
      //   type: "asset/inline",
      // },
    ],
  },
  //plugins
  plugins: [
    // Injects the bundled js file (main.js) into the index.html (temp.html) file and places that file in the build (dist) folder
    new HtmlWebpackPlugin({
      // Title of the page
      title: 'Just a Demo',
      // html file name
      filename: 'index.html',
      // Template for when html file is not completely generated by js
      template: path.resolve(__dirname, 'src/temp.html'),
    }),
    new ReactRefreshWebpackPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env.name": JSON.stringify("Dev"),
    // })

    new Dotenv(),
  ],
}

// Adapts config based on current running task
if (currentTask == 'build') {
  config.mode = 'production'
  config.devtool = 'source-map'
  // Pulls css into its separate files (this way if javascript files don't load, users will still be able to see some styles)
  config.module.rules[0].use[0] = MiniCssExtractPlugin.loader
  ;(config.plugins[0] = new HtmlWebpackPlugin({
    // Title of the page
    title: 'Just a Demo',
    // html file name
    filename: 'index.html',
    // Template for when html file is not completely generated by js
    template: path.resolve(__dirname, 'src/temp.html'),
    minify: {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      removeComments: true,
    },
  })),
    config.plugins.push(
      new MiniCssExtractPlugin({ filename: 'main.[contenthash].css' }),
      new BundleAnalyzerPlugin(),
      // new CleanWebpackPlugin(),
      new WebpackManifestPlugin()
    )
}

module.exports = config

// Notes
// [hash] is a "unique hash generated for every build" - now depracated (hash is now fullhash)
// [chunkhash] is "based on each chunks' content"
// [contenthash] is "generated for extracted content"
