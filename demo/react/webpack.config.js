const path = require('path');
const ClosureCompilerPlugin = require('../../src/closure-compiler-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  // const isProduction = true;

  return {
    entry: {
      'main': './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'js/[name].js'
    },
    devServer: {
      open: true,
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new ClosureCompilerPlugin(
          {
            mode: 'AGGRESSIVE_BUNDLE',
            // mode: 'STANDARD'
          },
          {
            language_out: 'ECMASCRIPT_2015',
            // warning_level: "QUIET",
            compilation_level: "ADVANCED",
            // process_common_js_modules: true,
            // dependency_mode: 'PRUNE_LEGACY', // PRUNE requires entry_point to be defined
            // assume_function_wrapper: true,
            // use_types_for_optimization: false,
            jscomp_off: "*",
            // assume_function_wrapper: true,
            rewrite_polyfills: false,
            // strict_mode_input: false,
            // define: ['process.env.NODE_ENV=production'],
            // debug: true,
            // formatting: "PRETTY_PRINT",
            // externs: ['./node_modules/@polymer/polymer/externs/polymer-externs.js', './node_modules/@polymer/polymer/externs/webcomponents-externs.js']
          }
        ),
      ],
      // moduleIds: 'named',
      splitChunks: {
        minSize: 0,
      },
      concatenateModules: false,
    },
    plugins: [
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(
      //         __dirname,
      //         './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
      //       ),
      //       to: path.resolve(
      //         __dirname,
      //         'public',
      //         'js',
      //         'webcomponentsjs/webcomponents-loader.js'
      //       ),
      //     },
      //     {
      //       from: path.resolve(
      //         __dirname,
      //         './node_modules/@webcomponents/webcomponentsjs/bundles'
      //       ),
      //       to: path.resolve(
      //         __dirname,
      //         'public',
      //         'js',
      //         'webcomponentsjs',
      //         'bundles'
      //       ),
      //     },
      //   ],
      // }),
    ],
  };
};
