import { createFieldStore } from './createFieldStore';
import type { FieldOptions } from './types';
import { defaultFieldOptions } from './types';
import type { Validator } from './validators/validator';

export function field<T>(
	name: string,
	value: T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
) {
	return createFieldStore(name, value, validators, options);
}
