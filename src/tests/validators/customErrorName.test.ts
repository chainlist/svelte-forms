import cases from 'jest-in-case';
import * as v from '$lib/validators';
import { field } from '$lib/field';
import type { FieldValidation } from '$lib';

const valueOfFieldToMatchAgainst = 10;
const fieldToMatchAgainst = field('fieldToMatchAgainst', valueOfFieldToMatchAgainst);

cases(
	'max(max)',
	(opts) => {
		const result = opts.validator(
			...(opts.args || []),
			'custom message'
		)(opts.invalidValue) as FieldValidation;

		expect(result.valid).toBe(false);
		expect(result.name).toBe('custom message');
	},
	{
		between: _(v.between, 50, [0, 10]),
		email: _(v.email, 0),
		matchField: _(v.matchField, valueOfFieldToMatchAgainst + 10, [fieldToMatchAgainst]),
		max: _(v.max, 15, [10]),
		min: _(v.min, 5, [10]),
		pattern: _(v.pattern, 'foo', [/bar/]),
		required: _(v.required, null),
		url: _(v.url, 5)
	}
);

function _(validator, invalidValue, args = []) {
	return { validator, invalidValue, args };
}
