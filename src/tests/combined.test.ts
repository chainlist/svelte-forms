import { combined, field } from '$lib';
import { max, min } from '$lib/validators';
import { get } from 'svelte/store';

const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

describe('combined', () => {
	it('should construct a combined object', () => {
		const a = field('a', 1);
		const b = field('b', 2);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		const obj = get(c);
		expect(obj.value).toBe(3);
		expect(obj.valid).toBeTruthy();
		expect(obj.invalid).toBeFalsy();
		expect(obj.dirty).toBeFalsy();
	});

	it('should be raise parents error', async () => {
		jest.useFakeTimers();
		const a = field('a', 1, [min(2)]);
		const b = field('b', 2);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		await a.validate();
		const values = [];

		c.subscribe((data) => {
			values.push(data);
		});

		expect(get(c)).toEqual({
			dirty: false,
			errors: ['a.min'],
			invalid: true,
			name: 'fullname',
			valid: false,
			value: 3
		});
	});

	it('should be raise parents error', async () => {
		jest.useFakeTimers();
		const a = field('a', 1, [min(2)]);
		const b = field('b', 4, [max(2)]);

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value);

		await a.validate();
		await b.validate();
		const values = [];

		c.subscribe((data) => {
			values.push(data);
		});

		const obj = get(c);
		expect(obj.errors).toEqual(['a.min', 'b.max']);
	});

	it('should run its own validator', async () => {
		jest.useFakeTimers();
		const a = field('a', 1);
		const b = field('b', 4);

		const newMax = (n: number) => {
			return (value: number) => {
				return { valid: value <= n, name: 'newMax' };
			};
		};

		const c = combined('fullname', [a, b], ([c, d]) => c.value + d.value, [newMax(2)]);

		await a.validate();
		await b.validate();

		const values = [];

		c.subscribe((data) => {
			values.push(data);
		});

		const obj = await c.validate();

		expect(obj.errors).toEqual(['newMax']);
	});
});
