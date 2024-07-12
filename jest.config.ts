import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  transform: {
    '^.+\\.(ts|js)?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  testMatch: [
    '**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/middleware/custom/**/*.{js,ts}'
  ],
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src']
}

export default config
