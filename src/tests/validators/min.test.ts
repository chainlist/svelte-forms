import cases from 'jest-in-case';
import { min } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'min(min)',
	(opts) => {
		const result = min(opts.min)(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('min');
	},
	{
		'with numberical value above min': { min: 3, value: 5, expected: true },
		'with numberical value below min': { min: 3, value: -1, expected: false },
		'with numberical value at min': { min: 3, value: 3, expected: true },

		'with string value above min': { min: 3, value: 'above min', expected: true },
		'with string value below min': { min: 3, value: 'n', expected: false },
		'with string value at min': { min: 3, value: 'tes', expected: true }
	}
);
