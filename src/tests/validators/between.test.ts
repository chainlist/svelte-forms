import cases from 'jest-in-case';
import { between } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'between(min, max)',
	(opts) => {
		const result = between(opts.min, opts.max)(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('between');
	},
	{
		'with numberical value in range': { min: 0, max: 10, value: 5, expected: true },
		'with numberical value above range': { min: 0, max: 10, value: 11, expected: false },
		'with numberical value below range': { min: 0, max: 10, value: -1, expected: false },
		'with numberical value at lower limit': { min: 0, max: 10, value: 0, expected: true },
		'with numberical value at upper limit': { min: 0, max: 10, value: 10, expected: true },

		'with string value in range': { min: 0, max: 10, value: 'in range', expected: true },
		'with string value above range': { min: 0, max: 10, value: 'not in range', expected: false },
		'with string value below range': { min: 0, max: 10, value: '', expected: false },
		'with string value at upper limit': { min: 0, max: 10, value: 'test test ', expected: true },
		'with string value at lower limit': { min: 0, max: 10, value: 'tes', expected: true }
	}
);
