import type { Writable } from 'svelte/store';
import type { Field } from './createFieldStore';
import { derived, get } from 'svelte/store';

export type Form = {
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

export function form(...fields: Writable<Field<any>>[]) {
	const store = derived(fields, (values) => ({
		valid: values.every((value) => value.valid),
		dirty: values.some((value) => value.dirty),
		errors: values
			.map((value) => {
				return value.errors.map((e) => `${value.name}.${e}`);
			})
			.flat(),

		hasError(this: Form, name: string) {
			return this.errors.findIndex((e) => e === name) !== -1;
		}
	}));

	const { subscribe } = store;

	function reset() {
		fields.forEach((field: any) => field.reset());
	}

	function validate() {
		fields.forEach((field: any) => field.validate());
	}

	function getField(name: string): Writable<Field<any>> {
		return fields.find((f) => get(f).name === name);
	}

	return { subscribe, reset, validate, getField };
}
