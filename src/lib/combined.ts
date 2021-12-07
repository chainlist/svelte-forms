import type { Validator } from './validators/validator';
import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';
import { derived } from 'svelte/store';
import type { Field, FieldOptions, FieldsValues } from './types';
import { createFieldOject, getErrors } from './createFieldStore';
import { defaultFieldOptions } from './types';

export function combined<S extends Readable<Field<any>>[], T>(
	name: string,
	fields: S,
	reducer: (fields: FieldsValues<S>) => T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
): Readable<Field<T>> & { validate: () => Promise<Field<T>> } {
	let resolve: Promise<Field<T>>;
	const { subscribe } = derived<S, Field<T>>(
		fields,
		(values, set) => {
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

			const validations = createValidations();

			resolve = getErrors(value, validators, options.stopAtFirstError).then(
				(combinedValidations) => {
					const obj = createFieldOject(name, value, [...combinedValidations, ...validations], {
						dirty: values.some((v) => v.dirty)
					});

					set(obj);
					console.log(obj);
					return obj;
				}
			);
			set(
				createFieldOject(name, value, validations, {
					dirty: values.some((v) => v.dirty)
				})
			);
		},
		createFieldOject(name, reducer(fields.map((f) => get(f)) as any), [])
	);

	return {
		subscribe,
		validate: async () => {
			for (const field of fields) {
				console.log(await (field as any).validate());
			}

			return resolve;
		}
	};
}
