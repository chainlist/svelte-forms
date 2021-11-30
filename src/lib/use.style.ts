import type { Readable } from 'svelte/store';
import type { Field } from './createFieldStore';

export function style(
	node: HTMLElement,
	{ field = null, valid = 'valid', invalid = 'invalid', dirty = 'dirty' } = {}
) {
	const unsubscribe = field.subscribe((field) => {
		if (field.dirty) {
			node.classList.add(dirty);
			if (field.valid) {
				node.classList.add(valid);
				node.classList.remove(invalid);
			} else {
				node.classList.add(invalid);
				node.classList.remove(valid);
			}
		} else {
			node.classList.remove(dirty);
		}
	});

	return {
		destroy: () => unsubscribe()
	};
}
