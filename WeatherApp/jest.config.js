module.exports = {
  roots: ["<rootDir>/src"],
  preset: 'react-native',
  // preset: 'jest-expo',
  setupFilesAfterEnv: [
    // '@testing-library/jest-native/extend-expect'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // "^.+\\.jsx?$": "babel-jest",
    // "^.+\\.tsx?$": "babel-jest"
  },
  testRegex: 'src/.*\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],

  // transformIgnorePatterns: [
  //   'node_modules/(?!(react-native|react-navigation|@react-navigation)/)',
  // ],
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
  // setupFiles: ['./jest.setup.js'],
};

