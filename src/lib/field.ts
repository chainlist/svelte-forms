import { createFieldStore } from './createFieldStore.js';
import type { FieldOptions } from './types.js';
import { defaultFieldOptions } from './types.js';
import type { Validator } from './validators/validator.js';

export function field<T>(
	name: string,
	value: T,
	validators: Validator[] = [],
	options: Partial<FieldOptions> = {}
) {
	return createFieldStore(name, value, validators, { ...defaultFieldOptions, ...options });
}
