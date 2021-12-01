import type { Validator } from '$lib';
import isPromise from 'is-promise';

export function not(validation: Validator) {
	return async (value: any) => {
		const validator = validation(value);

		if (isPromise(validator)) {
			const result = await validator;
			return { valid: !result.valid, name: result.name };
		}

		return { valid: !validator.valid, name: validator.name };
	};
}
