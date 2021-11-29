import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';
import mdPlugin from 'vite-plugin-markdown';
import markdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

const mdit = markdownIt();
mdit.use(anchor);

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

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		package: {
			exports: (file) => file === 'index.ts'
		},
		vite: {
			plugins: [mdPlugin.plugin({ mode: ['html', 'toc'], markdownIt: mdit })],
			resolve: {
				alias: {
					'svelte-forms': path.resolve('src/lib')
				}
			}
		}
	}
};

export default config;
