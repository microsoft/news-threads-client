/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test'
		readonly PUBLIC_URL: string
	}
}

declare module '*.bmp' {
	const src: string
	export default src
}

declare module '*.gif' {
	const src: string
	export default src
}

declare module '*.jpg' {
	const src: string
	export default src
}

declare module '*.jpeg' {
	const src: string
	export default src
}

declare module '*.png' {
	const src: string
	export default src
}

declare module '*.webp' {
	const src: string
	export default src
}

declare module '*.svg' {
	import * as React from 'react'

	export const ReactComponent: React.FunctionComponent<React.SVGProps<
		SVGSVGElement
	>>

	const src: string
	export default src
}

declare module '*.module.css' {
	const classes: { readonly [key: string]: string }
	export default classes
}

declare module '*.module.scss' {
	const classes: { readonly [key: string]: string }
	export default classes
}

declare module '*.module.sass' {
	const classes: { readonly [key: string]: string }
	export default classes
}

/**
 * Types for config-webpack configuration
 */
declare const CONFIG: {
	api: {
		token: Record<string, string>
		url: Record<string, string>
	}
	auth: {
		disabled: boolean
		use_logger: boolean
		authority: string
		client_id: string
		scopes: string
		apiScopes: string
	}
	feature: Record<string, boolean>
	search: {
		debounce: number
		count: number
	}
}
