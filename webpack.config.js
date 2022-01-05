//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

'use strict';

const path = require('path');
const merge = require('merge-options');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function withDefaults(/**@type WebpackConfig*/extConfig) {

	/** @type WebpackConfig */
	let defaultConfig = {
		mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
		target: 'node',
		node: {
			__dirname: false
		},
		resolve: {
			mainFields: ['module', 'main'],
			extensions: ['.ts', '.js']
		},
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [{
					loader: 'vscode-nls-dev/lib/webpack-loader',
					options: {
						base: path.join(extConfig.context, 'src')
					}
				}, {
					loader: 'ts-loader',
					options: {
						compilerOptions: {
							"sourceMap": true,
						}
					}
				}]
			}]
		},
		externals: {
			'vscode': 'commonjs vscode',
		},
		output: {
			filename: '[name].js',
			path: path.join(extConfig.context, 'dist'),
			libraryTarget: "commonjs",
		},
		devtool: 'source-map',
		plugins: [
			new CopyWebpackPlugin([
				{ from: './out/**/*', to: '.', ignore: ['*.js', '*.js.map'], flatten: true }
			])
		],
	};

	return merge(defaultConfig, extConfig);
};
