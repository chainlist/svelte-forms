import isPromise from 'is-promise';
import type { Writable, Updater } from 'svelte/store';
import { writable, get } from 'svelte/store';
import type { Validation, Validator } from './validators/validator';

export type FieldOptions = {
	valid: boolean;
	checkOnInit: boolean;
	validateOnChange: boolean;
	stopAtFirstError: boolean;
};

export type Field<T> = {
	name: string;
	value: T;
	oldValue: T;
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

export function createFieldStore<T>(
	name: string,
	v: T,
	validators: Validator<T>[] = [],
	options: FieldOptions
): Writable<Field<T>> & { validate: () => void } {
	const value = {
		name,
		value: v,
		oldValue: undefined,
		valid: true,
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

	function processField(field: Field<T>, validations?: Validation[]) {
		if (validations) {
			const errors = validations.filter((v) => !v.valid).map((v) => v.name);
			const valid = !errors.length;
			return { ...field, dirty: true, valid, errors };
		}

		return field;
	}

	async function setLater(this: void, asyncValidator: Promise<Validation>) {
		const result = await asyncValidator;
		let field: Field<T> = get(store);

		if (!result.valid) {
			_set({ ...field, valid: false, errors: [...field.errors, result.name] });
		}
	}

	function set(this: void, field: Field<T>, forceValidation: boolean = false) {
		if (forceValidation || options.validateOnChange) {
			let validations: Validation[] = [];

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

	if (options.checkOnInit) {
		set(value);
	}

	return { subscribe, update, set, validate };
}
