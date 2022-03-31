import { field } from '$lib';
import { min, required, email } from '$lib/validators';
import { get } from 'svelte/store';

describe('field()', () => {
	it('should handle with no validator', () => {
		const name = field('name', '');
		name.validate();

		const result = get(name);

		expect(result.valid).toBe(true);
	});

	describe('with one validator', () => {
		it('should be valid', () => {
			const name = field('name', 'not empty', [required()]);
			name.validate();

			const result = get(name);

			expect(result.valid).toBe(true);
			expect(result.errors).not.toContain('required');
		});

		it('should not be valid', async () => {
			const name = field('name', '', [required()]);
			await name.validate();

			const result = get(name);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('required');
		});
	});

	describe('with multiples validators', () => {
		it('should be valid', () => {
			const name = field('name', 'not empty', [required(), min(3)]);
			name.validate();

			const result = get(name);

			expect(result.valid).toBe(true);
			expect(result.errors).not.toContain('required');
			expect(result.errors).not.toContain('min');
		});

		it('should not be valid with one failed validator', async () => {
			const name = field('name', 'no', [required(), min(3)]);
			await name.validate();

			const result = get(name);

			expect(result.valid).toBe(false);
			expect(result.errors).not.toContain('required');
			expect(result.errors).toContain('min');
		});

		it('should not be valid with two failed validators', async () => {
			const name = field('name', '', [required(), min(3)]);
			await name.validate();

			const result = get(name);

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('required');
			expect(result.errors).toContain('min');
		});

		it('we should be able to set with the value directly', async () => {
			const name = field('name', '');

			name.set('new value');
			await name.validate();

			const result = get(name);

			expect(result.value).toEqual('new value');
		});

		it('we should be able to set with a field value', async () => {
			const name = field('name', '');

			let f = get(name);

			f.value = 'new field value';
			name.set(f);
			await name.validate();

			const result = get(name);

			expect(result.value).toEqual('new field value');
		});

		it('we should be able to reset a field', async () => {
			const name = field('name', 'default value');

			let f = get(name);
			f.value = 'new value';
			name.reset();

			const result = get(name);
			expect(result.value).toEqual('default value');
		});

		it('we should be able to clear a field', async () => {
			const name = field('name', 'default value');

			let f = get(name);
			f.value = 'new value';
			name.clear();

			const result = get(name);
			expect(result.value).toBeNull();
		});
	});

	it('should remain invalid on change', async () => {
		let emailOptions = { validateOnChange: false, valid: false };
		const emailField = field('emailField', "", [email()], emailOptions);

		emailField.set(get(field('emailField', 'not an email', [email()], emailOptions)));
		expect(get(emailField).valid).toEqual(false);

		emailField.set(get(field('emailField', 'hello@email.com', [email()], emailOptions)));
		expect(get(emailField).valid).toEqual(false);
		
		await emailField.validate();
		expect(get(emailField).valid).toEqual(true);
	});
});
