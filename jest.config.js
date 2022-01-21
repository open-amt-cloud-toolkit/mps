module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  transform: {
    '^.+\\.(ts)?$': 'ts-jest'
  },
  testMatch: [
    '**/*.test.ts',
    '**/*.spec.ts'
  ],
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "src/*.{js,ts}",
    "!src/test/**/*.{js,ts}"
  ],
  reporters: ["default", "jest-junit"],
  testEnvironment: 'node'
}
