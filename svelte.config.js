import preprocess from 'svelte-preprocess';
import path from 'path';
import mdPlugin from 'vite-plugin-markdown';
import markdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import kebab from 'lodash.kebabcase';
import adapter from '@sveltejs/adapter-static';

const slugify = (s) => kebab(s);

const mdit = markdownIt();
mdit.use(anchor, { slugify });

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

		// hydrate the <div id="svelte"> element in src/app.html
		package: {
			exports: (file) => file.includes('index.ts')
		},
		vite: {
			plugins: [mdPlugin.plugin({ mode: ['html', 'toc'], markdownIt: mdit })],
			resolve: {
				alias: {
					$components: path.resolve('src/components'),
					$utils: path.resolve('src/utils'),
					'svelte-forms': path.resolve('src/lib'),
					'svelte-forms/validators': path.resolve('src/lib/validators')
				}
			}
		}
	}
};

export default config;
