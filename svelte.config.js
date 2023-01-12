import preprocess from 'svelte-preprocess';

import adapter from '@sveltejs/adapter-static';
import path from 'path';
const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),

		paths: {
			base: isProduction ? '/svelte-forms' : '',
			assets: isProduction ? 'https://chainlist.github.io/svelte-forms' : ''
		},
		alias: {
			$components: path.resolve('src/components'),
			$utils: path.resolve('src/utils'),
			'svelte-forms': path.resolve('src/lib'),
			'svelte-forms/validators': path.resolve('src/lib/validators')
		}
	}
};

export default config;
