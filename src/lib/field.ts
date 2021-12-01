import type { FieldOptions } from './createFieldStore';
import { createFieldStore } from './createFieldStore';
import type { Validator } from './validators/validator';

export const defaultFieldOptions: FieldOptions = {
	valid: true,
	checkOnInit: false,
	validateOnChange: true,
	stopAtFirstError: false
};

export function field<T>(
	name: string,
	value: T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
) {
	return createFieldStore(name, value, validators, options);
}
