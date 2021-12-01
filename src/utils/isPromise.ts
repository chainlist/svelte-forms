export function isPormise<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> {
	return (
		!!obj &&
		(typeof obj === 'object' || typeof obj === 'function') &&
		typeof (obj as any).then === 'function'
	);
}
