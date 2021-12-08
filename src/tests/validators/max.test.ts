import cases from 'jest-in-case';
import { max } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'max(max)',
	(opts) => {
		const result = max(opts.max)(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('max');
	},
	{
		'with numberical value above max': { max: 3, value: 5, expected: false },
		'with numberical value below max': { max: 3, value: 1, expected: true },
		'with numberical value at max': { max: 3, value: 3, expected: true },

		'with string value above max': { max: 3, value: 'above max', expected: false },
		'with string value below max': { max: 3, value: 'n', expected: true },
		'with string value at max': { max: 3, value: 'tes', expected: true },
		'with string value empty': { max: 3, value: '', expected: true },

		'with undefined': { max: 3, value: undefined, expected: true }
	}
);
