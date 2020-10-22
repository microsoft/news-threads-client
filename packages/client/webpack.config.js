/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/webpack-config')
const ConfigWebpackPlugin = require('config-webpack')

const config = configure({
	pnp: true,
	plugins: () => [new ConfigWebpackPlugin()],
})

module.exports = config

config.resolve.extensions.push('.mjs')
config.module.rules.push(
	// fixes https://github.com/graphql/graphql-js/issues/1272
	{
		test: /\.mjs$/,
		include: /node_modules/,
		type: 'javascript/auto',
	},
)
