import { field } from '$lib';
import { min, required } from '$lib/validators';
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
	});
});
