import type { Validator } from '$lib';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { Field, FieldOptions, FieldsValues } from './createFieldStore';
import { createFieldOject, validateValue } from './createFieldStore';
import { defaultFieldOptions } from './field';

export function combined<S extends Readable<Field<any>>[], T>(
	name: string,
	fields: S,
	reducer: (fields: FieldsValues<S>) => T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
): Readable<Field<T>> {
	return derived(fields, (values, set) => {
		const value = reducer(values);

		if (values.some((v) => v.dirty)) {
			const errors = validateValue(value, validators, null, options.stopAtFirstError);

			errors.then((err) => set(createFieldOject(name, value, err)));
		} else {
			set({ ...createFieldOject(name, value), dirty: false });
		}
	});
}
