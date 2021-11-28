import type { Validation } from './validator';

export function url(value: string): Validation {
	const regex =
		/(https?|ftp|git|svn):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
	return { valid: regex.test(value), name: 'url' };
}
