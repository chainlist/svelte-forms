import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n\t<head>\r\n\t\t<meta charset=\"utf-8\" />\r\n\t\t<meta name=\"description\" content=\"\" />\r\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\r\n\t\t<!-- <link rel=\"stylesheet\" href=\"/prism.css\" /> -->\r\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\r\n\t\t" + head + "\r\n\t</head>\r\n\t<body class=\"text-2xl\">\r\n\t\t<div id=\"svelte\">" + body + "</div>\r\n\t</body>\r\n</html>\r\n";

let options = null;

const default_settings = { paths: {"base":"/svelte-forms","assets":"https://chainlist.github.io/svelte-forms"} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-a9c08975.js",
			css: [assets + "/_app/assets/start-464e9d0a.css"],
			js: [assets + "/_app/start-a9c08975.js",assets + "/_app/chunks/vendor-b1bbe6fe.js",assets + "/_app/chunks/preload-helper-cd5f4ade.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

// input has already been decoded by decodeURI
// now handle the rest that decodeURIComponent would do
const d = s => s
	.replace(/%23/g, '#')
	.replace(/%3[Bb]/g, ';')
	.replace(/%2[Cc]/g, ',')
	.replace(/%2[Ff]/g, '/')
	.replace(/%3[Ff]/g, '?')
	.replace(/%3[Aa]/g, ':')
	.replace(/%40/g, '@')
	.replace(/%26/g, '&')
	.replace(/%3[Dd]/g, '=')
	.replace(/%2[Bb]/g, '+')
	.replace(/%24/g, '$');

const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.png","size":1571,"type":"image/png"},{"file":"prism.css","size":1920,"type":"text/css"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/test\/?$/,
						params: empty,
						a: ["src/routes/test/__layout.reset.svelte", "src/routes/test/index.svelte"],
						b: []
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("..\\..\\src\\routes\\__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/test/__layout.reset.svelte": () => import("..\\..\\src\\routes\\test\\__layout.reset.svelte"),"src/routes/test/index.svelte": () => import("..\\..\\src\\routes\\test\\index.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"pages/__layout.svelte-8283cf24.js","css":["assets/pages/__layout.svelte-977324a9.css"],"js":["pages/__layout.svelte-8283cf24.js","chunks/preload-helper-cd5f4ade.js","chunks/vendor-b1bbe6fe.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"error.svelte-c26cffb1.js","css":[],"js":["error.svelte-c26cffb1.js","chunks/vendor-b1bbe6fe.js"],"styles":[]},"src/routes/index.svelte":{"entry":"pages/index.svelte-6184231f.js","css":["assets/pages/index.svelte-a07f5dcd.css"],"js":["pages/index.svelte-6184231f.js","chunks/preload-helper-cd5f4ade.js","chunks/vendor-b1bbe6fe.js"],"styles":[]},"src/routes/test/__layout.reset.svelte":{"entry":"pages/test/__layout.reset.svelte-be310358.js","css":[],"js":["pages/test/__layout.reset.svelte-be310358.js","chunks/vendor-b1bbe6fe.js"],"styles":[]},"src/routes/test/index.svelte":{"entry":"pages/test/index.svelte-4f62dacd.js","css":["assets/pages/test/index.svelte-43fafacd.css"],"js":["pages/test/index.svelte-4f62dacd.js","chunks/vendor-b1bbe6fe.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}