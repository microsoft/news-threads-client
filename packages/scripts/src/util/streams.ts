/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Writable, Transform } from 'stream'

export class DevNull extends Writable {
	_write(
		_chunk: any,
		_encoding: string,
		callback: (error?: Error | null) => void,
	) {
		callback()
	}
}

/**
 * Creates a transformation stream processor
 * @param cb The transformation function
 */
export function xform(cb: (input: any) => any) {
	return new Transform({
		writableObjectMode: true,
		readableObjectMode: true,

		transform(chunk, _encoding, callback) {
			this.push(cb(chunk))
			callback()
		},
	})
}

export const PUSH_CHUNK_SENTINEL = '__PUSH_THE_CHUNK__'
/**
 * Creates a stream-chunker
 * @param size The chunk size to use
 */
export function chunk(size: number) {
	let items: any[] = []
	let chunkIndex = 0

	return new Transform({
		writableObjectMode: true,
		readableObjectMode: true,

		transform(chunk, _encoding, callback) {
			// only push valid items onto array
			if (chunk !== PUSH_CHUNK_SENTINEL) {
				items.push(chunk)
			}
			// if we've reached the chunk size, or if a null value was pushed in, push out the block of items.
			// NULL is an indicator that the upstream source has completed
			if (chunk === PUSH_CHUNK_SENTINEL || items.length >= size) {
				this.push({ index: chunkIndex++, items })
				items = []
			}
			callback()
		},
	})
}

export function forEachAsync(
	operation: (input: any) => Promise<unknown>,
	onError: (err: Error) => void,
) {
	return new Transform({
		writableObjectMode: true,
		readableObjectMode: true,

		transform(chunk, _encoding, callback) {
			operation(chunk)
				.then(() => callback())
				.catch(err => {
					onError(err)
					callback()
				})
		},
	})
}
