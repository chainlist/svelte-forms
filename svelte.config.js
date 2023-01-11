import preprocess from 'svelte-preprocess';

import adapter from '@sveltejs/adapter-static';



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

	}
};

export default config;
