import cases from 'jest-in-case';
import { email } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'email(value)',
	(opts) => {
		const result = email()(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('not_an_email');
	},
	{
		'with numerical': { value: 12921, expected: false },

		'with good email': { value: 'example@example.com', expected: true },
		'with bad email': { value: 'example@example', expected: false },
		'with only blank spaces': { value: '  ', expected: false },
		'with empty string': { value: '', expected: false },
		'with empty undefined': { value: undefined, expected: false },
		'with empty null': { value: null, expected: false }
	}
);
