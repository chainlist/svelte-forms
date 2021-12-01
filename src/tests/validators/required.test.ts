import cases from 'jest-in-case';
import { required } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'required()',
	(opts) => {
		const result = required()(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('required');
	},
	{
		'with numerical 0': { value: 0, expected: true },
		'with numerical': { value: 10, expected: true },

		'with non empty string': { value: 'non empty', expected: true },
		'with only blank spaces': { value: '  ', expected: false },
		'with empty string': { value: '', expected: false },
		'with empty undefined': { value: undefined, expected: false },
		'with empty null': { value: null, expected: false }
	}
);
