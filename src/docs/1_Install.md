---
filename: 1_Install.md
---

[![https://app.travis-ci.com/chainlist/svelte-forms.svg?branch=master](https://app.travis-ci.com/chainlist/svelte-forms.svg?branch=master)](https://app.travis-ci.com/github/chainlist/svelte-forms)

## getting started

### why

`svelte-forms` first came out because there were back then, no real form validation library for svelte. I then decided to create one that was easy to use... or I thought it was.

The first version was taking advantage of the `onMount` method that could be used anywhere in the code and not just in a component; but a lot of issues started to arrive when [sveltekit](https://kit.svelte.dev/) was announced.
Something shady, that was not really easy to fix because the library was tightly coupled to that famous `onMount` function.

A version 2 was quickly needed. Easier to use and easier to work on because it is developed using the sveltekit `package` command.
That makes possible to create the library as well as the documentation at the same time.

- So today, here we are with the v2 of `svelte-forms` that is hopefully easier to use and less bug prone for everyone!

### install

To install `svelte-forms` do one of the following commands:

```bash
npm install svelte-forms
```

```bash
pnpm add svelte-forms
```

```bash
yarn add svelte-forms
```

### svelte-kit / sapper

`svelte-forms` V2 has been made with the help of `svelte-kit`.

And it runs smoothly with `svelte-kit` or `sapper`, so enjoy!

### github

Check-out the [github repository](https://github.com/chainlist/svelte-forms) if you want to contribute
