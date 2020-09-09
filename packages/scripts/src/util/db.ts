/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FieldType,
	DbFieldValue,
	CollectionConfiguration,
	RecordTransformer,
	DbRecord,
	FieldIndexType,
} from '../types'

/**
 * Casts a string from the csv to a regular type before inserting.
 * Otherwise most of these just default to strings in Mongo.
 * This uses the BSON type names, though we aren't enforcing any schema.
 * https://docs.mongodb.com/manual/reference/bson-types/
 * @param {*} value
 * @param {*} type
 */
export function castValue(
	value: string,
	type: FieldType,
	valueMap: Record<string, any> | undefined,
	hint: string | undefined,
): DbFieldValue {
	if (valueMap) {
		value = valueMap[value]
	}
	switch (type) {
		// number isn't a bson type, but it is the main js primitive, so it makes sense to include
		case FieldType.Number:
		case FieldType.Int:
		case FieldType.Long:
		case FieldType.Double:
			return +value
		case FieldType.Bool:
			return Boolean(value).valueOf()
		case FieldType.Date: {
			if (hint === 'fromNumber') {
				return new Date(+value)
			} else {
				return new Date(value)
			}
		}
		case FieldType.String:
		default:
			return value
	}
}

/**
 * Creates a record transformer from the JSON field format.
 * @param {*} config
 */
export function createTransformer(
	config: CollectionConfiguration,
): RecordTransformer {
	return (csvRecord: unknown) => {
		return Object.entries(config.fields).reduce((record, [key, props]: any) => {
			const value = (csvRecord as any)[props.name]
			record[key] = castValue(value, props.type, props.valueMap, props.hint)
			return record
		}, {} as DbRecord)
	}
}

/**
 * Creates index config from the JSON field format.
 * @param {*} config
 */
export function createIndexConfigs(
	config: CollectionConfiguration,
): Record<string, FieldIndexType>[] {
	return Object.entries(config.fields)
		.filter(entry => typeof entry[1].index !== 'undefined')
		.map(entry => ({
			[`${entry[0]}`]: entry[1].index,
		}))
}
