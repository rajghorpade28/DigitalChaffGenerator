const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    content: './content_script.js',
    popup: './popup.js'
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
            // Update manifest to point to bundled scripts
            const manifest = JSON.parse(content.toString());
            if (manifest.background && manifest.background.service_worker) {
              manifest.background.service_worker = 'background.bundle.js';
            }
            return JSON.stringify(manifest, null, 2);
          }
        },
        { 
          from: 'popup.html', 
          to: 'popup.html',
          transform(content) {
            // Update HTML to point to bundled popup script
            return content.toString().replace('popup.js', 'popup.bundle.js');
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
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.5,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.2,
      compact: true,
      unicodeEscapeSequence: false
    }, ['background.bundle.js'])
  ],
  resolve: {
    extensions: ['.js']
  }
};
