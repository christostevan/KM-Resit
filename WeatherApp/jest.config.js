module.exports = {
  roots: ["<rootDir>/src"],
  preset: 'react-native',
  setupFilesAfterEnv: [
    
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '__tests__/.*\\.test\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

