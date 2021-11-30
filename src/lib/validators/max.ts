import type { Validator } from './validator';

export function max(n: number): Validator {
	return (value: any) => {
		const val = isNaN(value) ? value.length : parseFloat(value);

		return { valid: !isNaN(value) || val <= n, name: 'max' };
	};
}
