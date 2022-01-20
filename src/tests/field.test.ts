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

			await name.set('new value');

			const result = get(name);

			expect(result.value).toEqual('new value');
		});

		it('we should be able to set with a field value', async () => {
			const name = field('name', '');

			let f = get(name);

			f.value = 'new field value';
			await name.set(f);

			const result = get(name);

			expect(result.value).toEqual('new field value');
		});

		it('should start off not dirty', () => {
			const name = field('name', '')
			expect(get(name).dirty).toBe(false)
		});

		it('should be marked as dirty when value is set', async () => {
			const name = field('name', '')
			await name.set('new value')
			expect(get(name).dirty).toBe(true)
		});
		
		it('should be manually marked as dirty and not dirty', () => {
			const name = field('name', '')
			name.setDirty(true)
			expect(get(name).dirty).toBe(true)
			name.setDirty(false)
			expect(get(name).dirty).toBe(false)
		})
		
		it('should mark as not dirty during reset', () => {
			const name = field('name', '')
			name.setDirty(true)
			name.reset()
			expect(get(name).dirty).toBe(false)
		})
	});
});
