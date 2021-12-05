import type { Validator } from './validators/validator';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { Field, FieldOptions, FieldsValues } from './types';
import { createFieldOject, validateValue } from './createFieldStore';
import { defaultFieldOptions } from './types';

export function combined<S extends Readable<Field<any>>[], T>(
	name: string,
	fields: S,
	reducer: (fields: FieldsValues<S>) => T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
): Readable<Field<T>> {
	return derived(fields, (values, set) => {
		const value = reducer(values);

		const mergeValues = (f: Field<T>) => {
			const valuesErrors = values.flatMap((v) => v.errors.map((e) => `${v.name}.${e}`).flat());
			const valid = values.every((v) => v.valid);

			return { ...f, valid: f.valid && valid, errors: [...valuesErrors, ...f.errors] };
		};

		if (values.some((v) => v.dirty)) {
			const errors = validateValue(value, validators, null, options.stopAtFirstError);

			errors.then((err) => set(mergeValues(createFieldOject(name, value, err))));
		} else {
			set({ ...createFieldOject(name, value), dirty: false });
		}
	});
}
