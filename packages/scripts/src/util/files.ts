/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import parse from 'csv-parse'
import transform from 'stream-transform'
const fsp = fs.promises

/**
 * Some "files" are actually a folder of part0000*.csv files coming from spark.
 * This checks if a file is actually a folder, and either way returns a list of csvs to ingest.
 * Note that optional file extension allows support for arbitrary folders of files (see queries precompute)
 * @param filename
 */
export async function getFileList(
	dataDir: string,
	name: string,
	ext = '',
): Promise<string[]> {
	const filename = join(dataDir, `${name}${ext}`)
	const stat = await fsp.stat(filename)
	if (stat.isDirectory()) {
		const list = await fsp.readdir(filename)
		return list.filter(f => !f.match(/^[._]/)).map(f => join(filename, f))
	}
	return [filename]
}

export interface CsvOptions {
	parserOptions?: parse.Options
	transformer?: transform.Handler
}

const defaultTransformer = (r: any, c: any) => c(null, r)

/**
 * Simple reusable file reader
 * @param filename
 * @param options
 */
export async function readFileRows(filename: string, opts?: CsvOptions) {
	return new Promise((resolve, reject) => {
		const pOpts = opts?.parserOptions || {
			delimiter: ',',
			columns: true,
			escape: '\\',
		}
		const tHandler = opts?.transformer || defaultTransformer
		const parser = parse(pOpts)
		const input = fs.createReadStream(filename, { encoding: 'utf8' })
		const xform = transform(tHandler)

		const results: any[] = []

		xform.on('data', record => results.push(record))
		xform.on('end', () => resolve(results))

		input.pipe(parser).pipe(xform)
	})
}
