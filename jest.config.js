/** @type {import('jest').Config} */
const config = {
  verbose: true,
  transform: {},
  extensionsToTreatAsEsm: ['.ts', '.js', '.jsx', '.tsx'],
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  moduleFileExtensions: [
    'd.ts',
    'ts',
    'tsx',
    'web.js',
    'js',
    'web.ts',
    'web.tsx',
    'json',
    'web.jsx',
    'jsx',
    'node',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test/tsconfig.json',
    },
  },
  transformIgnorePatterns: ['node_modules/(?!troublesome-dependency/.*)'],
};

module.exports = config;
