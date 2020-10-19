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
