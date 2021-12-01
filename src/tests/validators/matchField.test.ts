import cases from 'jest-in-case';
import { matchField } from '$lib/validators';
import { field } from '$lib/field';
import type { FieldValidation } from '$lib';

cases(
	'matchField(fieldStore)',
	(opts) => {
		const password = field('password', opts.value1);

		const result = matchField(password)(opts.value2) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('match_field');
	},
	{
		'with fields numerical matching': { value1: 1, value2: 1, expected: true },
		'with fields numerical not matching with string': { value1: 2, value2: '2', expected: false },
		'with fields numerical not matching': { value1: 1, value2: 2, expected: false },
		'with fields numerical not matching empty': { value1: 1, value2: undefined, expected: false },

		'with fields string matching': { value1: 'foo', value2: 'foo', expected: true },
		'with fields string not matching': { value1: 'foo', value2: 'bar', expected: false },
		'with fields string not matching with numerical': { value1: '2', value2: 2, expected: false },
		'with fields string not matching empty': { value1: 'foo', value2: '', expected: false }
	}
);
