import fs from 'fs';

const documentationPackages = [
	'prism-svelte',
	'prismjs',
	'svelte-awesome',
	'ua-parser-js',
	'lodash.kebabcase'
];
const pckg = JSON.parse(fs.readFileSync('./package/package.json'));

Object.keys(pckg.dependencies).forEach((dep) => {
	if (documentationPackages.includes(dep)) {
		delete pckg.dependencies[dep];
	}
});

fs.writeFileSync('./package/package.json', JSON.stringify(pckg, null, 2));

console.log('Cleaning of package.json done...');
