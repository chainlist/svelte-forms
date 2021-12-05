import isPromise from 'is-promise';
import type { Writable, Updater, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { Field, FieldOptions } from './types';
import type { FieldValidation, Validator } from './validators/validator';
import { defaultFieldOptions } from './types';

export function createFieldOject<T>(
	name: string,
	value: T,
	errors: FieldValidation[] = [],
	options: FieldOptions = defaultFieldOptions
): Field<T> {
	const field: Field<T> = { name, value, valid: true, invalid: false, errors: [], dirty: false };

	Object.defineProperty(field, 'config', {
		value: options,
		enumerable: false
	});

	return processField(field, errors);
}

export function validate<T>(store: Readable<Field<T>>, validators: Validator[]) {
	const validationsErrors = getErrors(store, validators);
}

export function getValue<T>(value: T | Field<T> | Readable<Field<T>>): T {
	const isStore = function (v: T | Field<T> | Readable<Field<T>>): v is Readable<Field<T>> {
		return (value as Readable<Field<T>>).subscribe !== undefined;
	};

	const isField = function (v: T | Field<T> | Readable<Field<T>>): v is Field<T> {
		return !!(value as Field<T>).name && (value as Field<T>).valid !== undefined;
	};

	if (isStore(value)) {
		return get(value).value;
	} else if (isField(value)) {
		return value.value;
	}

	return value;
}

export async function getErrors<T>(
	value: T | Field<T> | Readable<Field<T>>,
	validators: Validator[],
	stopAtFirstError = false
) {
	const v = getValue(value);
	let errors: FieldValidation[] = [];

	for (const validator of validators) {
		let result = validator(v);

		if (isPromise(result)) {
			result = await result;
		}

		if (stopAtFirstError && !result.valid) {
			errors = [result];
			break;
		}

		errors = [...errors, result];
	}

	return errors;
}

export async function validateValue<T>(
	value: T,
	validators: Validator[],
	stopAtFirstError: boolean
) {
	let validations: FieldValidation[] = [];

	for (const validator of validators) {
		let result = validator(value);

		if (isPromise(result)) {
			result = await result;
		}

		if (stopAtFirstError && !result.valid) {
			validations = [result];
			break;
		}

		validations = [...validations, result];
	}

	return validations;
}

export function processField<T>(field: Field<T>, validations?: FieldValidation[]) {
	if (validations) {
		const errors = validations.filter((v) => !v.valid).map((v) => v.name);
		const valid = !errors.length;
		return { ...field, dirty: true, valid, invalid: !valid, errors };
	}

	return field;
}

export function createFieldStore<T>(
	name: string,
	v: T,
	validators: Validator[] = [],
	options: FieldOptions
): Writable<Field<T>> & { validate: () => Promise<void>; reset: () => void } {
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

	async function set(this: void, field: Field<T>, forceValidation: boolean = false) {
		if (forceValidation || options.validateOnChange) {
			let validations = await getErrors(field, validators, options.stopAtFirstError);
			_set(processField(field, validations));
		} else {
			_set(processField(field));
		}
	}

	async function validate() {
		return set(get(store), true);
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
