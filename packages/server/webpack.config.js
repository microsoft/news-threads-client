/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')
const PnpWebpackPlugin = require(`pnp-webpack-plugin`)

module.exports = (env, argv) => {
	return {
		mode: argv && argv.mode ? argv.mode : 'development',
		target: 'node',
		entry: {
			index: path.resolve(__dirname, './src/index.ts'),
		},
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: '[name].js',
			libraryTarget: 'commonjs2',
		},
		resolve: {
			plugins: [PnpWebpackPlugin],
			extensions: ['.tsx', '.ts', '.mjs', '.js'],
		},
		resolveLoader: {
			plugins: [PnpWebpackPlugin.moduleLoader(module)],
		},
		module: {
			rules: [
				{
					test: /\.(t|j)sx?$/,
					exclude: /node_modules/,
					use: 'ts-loader',
				},
				{
					test: /\.(graphql|gql)$/,
					exclude: /node_modules/,
					loader: 'graphql-tag/loader',
				},
			],
		},
	}
}
