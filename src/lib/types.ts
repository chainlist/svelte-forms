import type { Readable } from 'svelte/store';

export type FieldOptions = {
	valid: boolean;
	checkOnInit: boolean;
	validateOnChange: boolean;
	stopAtFirstError: boolean;
	isOptional: boolean;
};

export type Field<T> = {
	name: string;
	value: T;
	valid: boolean;
	invalid: boolean;
	dirty: boolean;
	errors: string[];
};

export const defaultFieldOptions: FieldOptions = {
	valid: true,
	checkOnInit: false,
	validateOnChange: true,
	stopAtFirstError: false,
	isOptional: false
};

export type FieldsValues<T> = T extends Readable<infer U>
	? U
	: {
			[K in keyof T]: T[K] extends Readable<infer U> ? U : never;
	  };

export type Fields =
	| Readable<any>
	| [Readable<any>, ...Array<Readable<any>>]
	| Array<Readable<any>>;

export type Form = {
	valid: boolean;
	dirty: boolean;
	errors: string[];
};

export function isField<T>(field: any): field is Field<T> {
	const keys = Object.keys(field);
	return ['name', 'value', 'valid', 'invalid', 'errors'].every((key) => keys.includes(key));
}
