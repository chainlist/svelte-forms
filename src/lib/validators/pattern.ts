import type { Validator } from './validator.js';

export function pattern(pattern: RegExp, name = 'pattern'): Validator {
	return (value: any) => {
		if (value === null || value === undefined) {
			return { valid: false, name: 'pattern' };
		}

		return { valid: pattern.test(value), name };
	};
}
