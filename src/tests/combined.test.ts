import { combined, field } from '$lib';
import { get } from 'svelte/store';

describe('combined', () => {
	it('should be true', () => {
		const a = field('a', 1);
		const b = field('b', 2);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		const obj = get(c);
		expect(obj.value).toBe(3);
		expect(obj.valid).toBe(true);
		expect(obj.invalid).toBe(false);
	});
});
