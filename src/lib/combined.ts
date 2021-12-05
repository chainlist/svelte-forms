import type { Validator } from './validators/validator';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { Field, FieldOptions, FieldsValues } from './types';
import { createFieldOject, getErrors, validateValue } from './createFieldStore';
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

		const createValidations = () => {
			let errors = [];

			values.forEach((value) => {
				errors = [
					...errors,
					...value.errors
						.map((e) => {
							return { valid: false, name: `${value.name}.${e}` };
						})
						.flat()
				];
			});

			return errors;
		};

		if (values.some((v) => v.dirty)) {
			getErrors(value, validators, options.stopAtFirstError).then((combinedValidations) => {
				const validations = createValidations();
				set({
					...createFieldOject(name, value, [...combinedValidations, ...validations]),
					dirty: true
				});
			});
		} else {
			set({ ...createFieldOject(name, value), dirty: false });
		}
	});
}
