const path = require('path');
const ClosureCompilerPlugin = require('../../src/closure-compiler-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = true;

  return {
    entry: {
      'hello-world': './src/hello-world.js',
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'js/[name].js',
    },
    devServer: {
      open: true,
    },
    devtool: 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: [
        new ClosureCompilerPlugin(
          {
            mode: 'AGGRESSIVE_BUNDLE',
            // mode: 'STANDARD'
          },
          {
            languageOut: 'ECMASCRIPT_2015',
            // warning_level: "QUIET",
            compilation_level: "ADVANCED",
            // use_types_for_optimization: false,
            // jscomp_off: ["checkVars", "es5Strict"],
            assume_function_wrapper: true,
            rewrite_polyfills: false,
            // strict_mode_input: false,
            // debug: true,
            formatting: "PRETTY_PRINT",
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
