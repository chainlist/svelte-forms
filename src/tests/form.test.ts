import { field, form } from '$lib';
import { required } from '$lib/validators';
import { get } from 'svelte/store';

describe('form()', () => {
	it('should create a form', () => {
		const name = field('name', '');
		const myForm = form(name);

		myForm.validate();

		const result = get(myForm);

		expect(result.valid).toBe(true);
	});

	it('should not be valid', () => {
		const name = field('name', '', [required()]);
		const myForm = form(name);

		myForm.validate();

		const result = get(myForm);

		expect(result.valid).toBe(false);
		expect(result.hasError('name.required')).toBe(true);
	});
});
