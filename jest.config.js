module.exports = {
  transformIgnorePatterns: ['/node_modules/', '/cypress/'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': 'svelte-jester'
  },
  globals: {
    svelte: {
      compilerOptions: {
        accessors: true
      }
    }
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './tests/testSetup'
  ],
  moduleFileExtensions: ['js', 'svelte']
};
