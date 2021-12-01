import type { Validator } from './validator';

export function max(n: number): Validator {
	return (value: any) => {
		const val = typeof value === 'string' ? value.length : isNaN(value) ? 0 : parseFloat(value);

		return { valid: val <= n, name: 'max' };
	};
}
