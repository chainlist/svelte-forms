import { combined, field } from '$lib';
import { min } from '$lib/validators';
import { get } from 'svelte/store';

describe('combined', () => {
	it('should construct a combined object', (done) => {
		const a = field('a', 1);
		const b = field('b', 2);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		c.subscribe((obj) => {
			expect(obj.value).toBe(3);
			expect(obj.valid).toBeTruthy();
			expect(obj.invalid).toBeFalsy();
			expect(obj.dirty).toBeFalsy();
			done();
		});
	});

	it('should be true', async () => {
		const a = field('a', 1, [min(2)]);
		const b = field('b', 2);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		await a.validate();

		const obj = get(c);
		expect(obj.value).toBe(3);
		expect(obj.valid).toBe(false);
		expect(obj.invalid).toBe(true);
		expect(obj.errors).toContain('a.min');
	});
});
