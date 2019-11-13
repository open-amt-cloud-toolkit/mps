module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json'
    }
  },  
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx'
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  testMatch: [
    '**/test/**/*.test.ts',
    '**/test/**/*.spec.ts',
    '**/test/**/*.spec.tsx'
  ],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts']
}
