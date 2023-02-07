import type { Configuration } from 'webpack';
import path from 'path';

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
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
        "~packs": path.resolve(__dirname, 'src/apps/packs'),
        "~connectAddon": path.resolve(__dirname, 'src/apps/connectAddon'),
        "~common": path.resolve(__dirname, 'src/common'),
    }
  },
};
