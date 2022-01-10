import cases from 'jest-in-case';
import { pattern } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'pattern(regex)',
	(opts) => {
		const result = pattern(opts.pattern)(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('pattern');
	},
	{
		'with numerical': { value: 12921, pattern: /\d+/, expected: true },
		'with numerical single digit': { value: 1, pattern: /\d/, expected: true },

		'with string wrong pattern': { value: 'hello', pattern: /\d+/, expected: false },
		'with string': { value: 'hello', pattern: /\w+/, expected: true },

		'with null value': { value: null, pattern: /\d+/, expected: false },
		'with undefined value': { value: undefined, pattern: /\w+/, expected: false }
	}
);
