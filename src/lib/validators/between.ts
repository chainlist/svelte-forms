import type { Validator } from './validator';

export function between(min: number, max: number): Validator {
	return (value: any) => {
		const val = isNaN(value) ? value.length : parseFloat(value);
		return { valid: val >= min && val <= max, name: 'between' };
	};
}
