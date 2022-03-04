import type { Readable, Writable } from 'svelte/store';
import { derived, get } from 'svelte/store';
import type { Field } from './types.js';

export type Form = {
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

export function form(...fields: (Writable<Field<any>> | Readable<Field<any>>)[]) {
	let names: string[] = [];
	let doubles: string[] = [];

	fields.forEach((field) => {
		const obj = get(field);
		if (names.includes(obj.name)) {
			doubles = doubles.includes(obj.name) ? doubles : [...doubles, obj.name];
		} else {
			names = [...names, obj.name];
		}
	});

	if (doubles.length) {
		throw new Error(`Cannot have the fields with the same name: ${doubles.join(', ')}`);
	}

	const store = derived(fields, (values) => {
		return {
			valid: values.every((value) => value.valid),
			dirty: values.some((value) => value.dirty),

			// Summary as a getter to avoid useless computation of data
			// if no one wants it
			get summary() {
				return values.reduce((carry, f) => {
					carry[f.name] = f.value;

					return carry;
				}, {});
			},

			errors: values
				.map((value) => {
					return value.errors.map((e) => {
						if (e.includes('.')) {
							return e;
						}

						return `${value.name}.${e}`;
					});
				})
				.flat()
				.filter((value, index, self) => self.indexOf(value) === index),

			hasError(this: Form, name: string) {
				return this.errors.findIndex((e) => e === name) !== -1;
			}
		};
	});

	const { subscribe } = store;

	function reset() {
		fields.forEach((field: any) => field.reset && field.reset());
	}

	function clear() {
		fields.forEach((field: any) => field.clear && field.clear());
	}

	async function validate() {
		for (const field of fields) {
			if ((field as any).validate) await (field as any).validate();
		}
	}

	function getField(name: string): Writable<Field<any>> | Readable<Field<any>> {
		return fields.find((f) => get(f).name === name);
	}

	function summary(): Record<string, any> {
		return get(store).summary;
	}

	return { subscribe, reset, validate, getField, summary, clear };
}
