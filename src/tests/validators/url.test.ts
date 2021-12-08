import cases from 'jest-in-case';
import { url } from '$lib/validators';
import type { FieldValidation } from '$lib';

cases(
	'url(value)',
	(opts) => {
		const result = url()(opts.value) as FieldValidation;

		expect(result.valid).toBe(opts.expected);
		expect(result.name).toBe('url');
	},
	{
		'with numerical': { value: 12921, expected: false },

		'with good url https': { value: 'https://example.com', expected: true },
		'with good url https with subdomain': { value: 'https://www.example.com', expected: true },
		'with good url https with subdomain 2': {
			value: 'https://subdomain.example.com',
			expected: true
		},
		'with good url http': { value: 'http://example.com', expected: true },

		'with url without protocol': { value: 'example.com', expected: false },
		'with bad url': { value: 'https://ex', expected: false },
		'with only blank spaces': { value: '  ', expected: false },
		'with empty string': { value: '', expected: false },
		'with empty undefined': { value: undefined, expected: false },
		'with empty null': { value: null, expected: false }
	}
);
