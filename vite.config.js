import { sveltekit } from '@sveltejs/kit/vite';
import { plugin, Mode } from 'vite-plugin-markdown';
import markdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import kebab from 'lodash.kebabcase';
import path from 'path';

const slugify = (s) => kebab(s);

const mdit = markdownIt();
mdit.use(anchor, { slugify });

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), plugin({ mode: [Mode.HTML, Mode.TOC], markdownIt: mdit })],
};

export default config;
