import isPromise from 'is-promise';
import type { Writable, Updater, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { Field, FieldOptions } from './types';
import type { FieldValidation, Validator } from './validators/validator';

export function createFieldOject<T>(
	name: string,
	value: T,
	errors: FieldValidation[] = []
): Field<T> {
	return processField(
		{ name, value, valid: true, invalid: false, errors: [], dirty: false },
		errors
	);
}

export async function validateValue<T>(
	value: T,
	validators: Validator[],
	asyncSetter: (asyncValidator: FieldValidation) => void = null,
	stopAtFirstError: boolean
) {
	let validations: FieldValidation[] = [];

	for (const validator of validators) {
		let result = validator(value);

		if (isPromise(result)) {
			result.then((r) => {
				if (asyncSetter) asyncSetter(r);
				else [...validations, r];
			});
			continue;
		} else {
			if (stopAtFirstError && !result.valid) {
				validations = [result];
				break;
			}

			validations = [...validations, result];
		}
	}

	return validations;
}

export function processField<T>(field: Field<T>, validations?: FieldValidation[]) {
	if (validations) {
		const errors = validations.filter((v) => !v.valid).map((v) => v.name);
		const valid = !errors.length;
		return { ...field, dirty: true, valid, errors };
	}

	return field;
}

export function createFieldStore<T>(
	name: string,
	v: T,
	validators: Validator[] = [],
	options: FieldOptions
): Writable<Field<T>> & { validate: () => void; reset: () => void } {
	const value = {
		name,
		value: v,
		valid: options.valid,
		invalid: !options.valid,
		dirty: false,
		errors: []
	};
	const store = writable<Field<T>>(value);
	const { subscribe, update: _update, set: _set } = store;

	function update(this: void, updater: Updater<Field<T>>): void {
		_update(updater);
		_update((data) => {
			data.dirty = true;
			return data;
		});
	}

	async function setLater(asyncValidator: Promise<FieldValidation>) {
		const result = await asyncValidator;
		let field: Field<T> = get(store);

		if (!result.valid) {
			_set({ ...field, valid: false, errors: [...field.errors, result.name] });
		}
	}

	function set(this: void, field: Field<T>, forceValidation: boolean = false) {
		if (forceValidation || options.validateOnChange) {
			let validations: FieldValidation[] = [];

			for (const validator of validators) {
				const result = validator(field.value);

				if (isPromise(result)) {
					setLater(result);
					continue;
				} else {
					if (options.stopAtFirstError && !result.valid) {
						validations = [result];
						break;
					}

					validations = [...validations, result];
				}
			}

			_set(processField(field, validations));
		} else {
			_set(processField(field));
		}
	}

	function validate() {
		set(get(store), true);
	}

	function reset() {
		_set(
			processField({
				dirty: false,
				errors: [],
				name,
				valid: options.valid,
				invalid: !options.valid,
				value: v
			})
		);
	}

	if (options.checkOnInit) {
		set(value);
	}

	return { subscribe, update, set, validate, reset };
}
