import type { Configuration } from 'webpack';
import path from 'path';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new MonacoWebpackPlugin
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
        "~bridge": path.resolve(__dirname, 'src/apps/bridge'),
        "~connectAddon": path.resolve(__dirname, 'src/apps/connectAddon'),
        "~common": path.resolve(__dirname, 'src/common'),
        "~explorer": path.resolve(__dirname, 'src/apps/explorer'),
    }
  },
};
