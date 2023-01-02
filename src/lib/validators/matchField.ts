import type { Field } from '$lib/types';
import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';

export function matchField(store: Readable<Field<any>>, name = 'match_field') {
	return (value) => {
		return { valid: get(store).value === value, name };
	};
}
