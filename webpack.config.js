const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    content: './content_script.js',
    popup: './popup.js',
    behavior_simulator: './behavior_simulator.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'manifest.json', 
          to: 'manifest.json',
          transform(content) {
            const manifest = JSON.parse(content.toString());
            if (manifest.background && manifest.background.service_worker) {
              manifest.background.service_worker = manifest.background.service_worker.replace(/background\.js/g, 'background.bundle.js');
            }
            return JSON.stringify(manifest, null, 2);
          }
        },
        { 
          from: 'popup.html', 
          to: 'popup.html',
          transform(content) {
            // Use global regex to replace ALL occurrences (including script tags)
            return content.toString().replace(/popup\.js/g, 'popup.bundle.js');
          }
        },
        { from: 'styles.css', to: 'styles.css' },
        { from: 'icons', to: 'icons' }
      ],
    }),
    new WebpackObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      controlFlowFlattening: false, // Disabled for stability in extensions
      deadCodeInjection: false,     // Disabled for stability in extensions
      compact: true,
      unicodeEscapeSequence: false
    }, ['background.bundle.js', 'behavior_simulator.bundle.js'])
  ],
  resolve: {
    extensions: ['.js']
  }
};
