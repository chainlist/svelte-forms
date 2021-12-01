import cases from 'jest-in-case';
import { not, min, max, between, email, url, required } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'matchField(fieldStore)',
	async (opts) => {
		const result = (await not(opts.validator)(opts.value)) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
	},
	{
		'with min above': { value: 1, validator: min(2), expected: true },
		'with min below': { value: 1, validator: min(0), expected: false },

		'with max above': { value: 1, validator: max(2), expected: false },
		'with max below': { value: 1, validator: max(0), expected: true },

		'with out range': { value: 11, validator: between(0, 10), expected: true },
		'with in range': { value: 5, validator: between(0, 10), expected: false },

		'is not an email': { value: 'example@s', validator: email(), expected: true },
		'is an email': { value: 'example@example.com', validator: email(), expected: false },

		'is not an url': { value: 'https://example', validator: url(), expected: true },
		'is an url': { value: 'https://example.com', validator: url(), expected: false },

		'is not required': { value: '', validator: required(), expected: true },
		'is required': { value: 'test', validator: required(), expected: false },

		'not not required': { value: 'test', validator: not(required()), expected: true }
	}
);
