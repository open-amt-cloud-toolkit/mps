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
  reporters: ["default", "jest-junit"],
  testEnvironment: 'node'
}
