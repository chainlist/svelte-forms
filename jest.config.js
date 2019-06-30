module.exports = {
  setupFiles: ['jest-localstorage-mock'],
  transformIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svelte$': 'jest-transform-svelte',
  },
  globals: {
    svelte: {
      compilerOptions: {
        accessors: true,
      },
    },
  },
};