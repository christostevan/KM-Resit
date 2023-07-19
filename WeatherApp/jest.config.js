module.exports = {
  roots: ["<rootDir>/src"],
  preset: 'react-native',
  setupFilesAfterEnv: [
    
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'src/.*\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};

