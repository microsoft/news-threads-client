/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const schemaJson = require('./packages/schema/lib/introspection.json')

module.exports = {
	extends: '@essex/eslint-config/release',
	plugins: ['graphql'],
	rules: {
		'graphql/template-strings': [
			'error',
			{
				env: 'apollo',
				schemaJson,
			},
		],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
	},
	globals: {
		CONFIG: 'readonly',
	},
}
