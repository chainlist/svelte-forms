import isPromise from 'is-promise';
import type { Writable, Updater, Readable } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { Field, FieldOptions } from './types.js';
import type { FieldValidation, Validator } from './validators/validator.js';
import { isField } from './types.js';

export function createFieldOject<T>(
	name: string,
	value: T,
	errors: FieldValidation[] = [],
	partialField: Partial<Field<T>> = {}
): Field<T> {
	const field: Field<T> = {
		name,
		value,
		valid: true,
		invalid: false,
		errors: [],
		dirty: false
	};

	return processField(field, partialField, errors);
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

export function processField<T>(
	field: Field<T>,
	partialField?: Partial<Field<T>>,
	validations?: FieldValidation[],
) {
	if (validations) {
		const errors = validations.filter((v) => !v.valid).map((v) => v.name);
		const valid = !errors.length;
		return { ...field, valid, invalid: !valid, errors, ...partialField };
	}

	return { ...field, ...(partialField || {}) };
}

export function createFieldStore<T>(
	name: string,
	v: T,
	validators: Validator[] = [],
	options: FieldOptions
): Omit<Writable<Field<T>>, 'set'> & {
	validate: () => Promise<Field<T>>;
	reset: () => void;
	set(this: void, value: Field<T> | T): void;
	setDirty(dirty: boolean): void;
} {
	const value = {
		name,
		value: v,
		valid: options.valid,
		invalid: !options.valid,
		dirty: false,
		errors: []
	};
	const store = writable<Field<T>>(value);
	const { subscribe, update, set: _set } = store;

	async function set(this: void, field: Field<T> | T, forceValidation: boolean = false) {
		if (!isField(field)) {
			field = processField(get(store), { value: field }, []);
		}

		if (forceValidation || options.validateOnChange) {
			let validations = await getErrors(field, validators, options.stopAtFirstError);
			_set(processField(field, { dirty: true }, validations));
		} else {
			_set(processField(field, { dirty: true }, []));
		}
	}

	async function validate() {
		const errors = await getErrors(store, validators, options.stopAtFirstError);
		let obj: Field<T>;

		update(field => processField(field, null, errors));

		return obj;
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

	async function setDirty(dirty: boolean) {
		update(field => processField(field, { dirty }))
	}

	return { subscribe, update, set, setDirty, validate, reset };
}
