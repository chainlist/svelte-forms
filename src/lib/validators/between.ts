import type { Validator } from './validator.js';

export function between(min: number, max: number, name = 'between'): Validator {
	return (value: any) => {
		const val = isNaN(value) ? value.length : parseFloat(value);
		return { valid: val >= min && val <= max, name };
	};
}
