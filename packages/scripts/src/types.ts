/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type DatasetConfiguration = Record<string, CollectionConfiguration>

export interface CollectionConfiguration {
	fields: Record<string, FieldConfiguration>
}

export interface FieldConfiguration {
	name: string
	type: FieldType
	index: FieldIndexType
}

export type FieldIndexType = 1 | 'hashed' | 'text'

export enum FieldType {
	String = 'string',
	Int = 'int',
	Number = 'number',
	Long = 'long',
	Double = 'double',
	Bool = 'bool',
	Date = 'date',
}

export type DbFieldValue = string | number | boolean | Date
export type DbRecord = Record<string, DbFieldValue>
export type RecordTransformer = (record: unknown) => DbRecord

// operation in mongo
// https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/
export interface Operation {
	[operation: string]: any
}

export interface BulkOperation {
	operations: Operation[]
	index: number
}

export interface RecordsBatch {
	items: DbRecord[]
	index: number
}

export type RecordsBulkOperationTransformer = (
	batch: RecordsBatch,
) => BulkOperation

export interface Dataset {
	id: string
	label: string
	startDate: string
	endDate: string
	default?: boolean
	features?: Map<string, boolean>
}
