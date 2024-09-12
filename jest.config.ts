import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['next/babel'],
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/utils/firebase$': '<rootDir>/__mocks__/firebase.ts',
  },
  collectCoverageFrom: [
    'src/utils/*.{js,jsx,ts,tsx}',
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/app/**/*',
  ],
  // modulePathIgnorePatterns: [
  //   "<rootDir>/src/app/\\(api\\)/",
  //   "<rootDir>/src/app/\\(pages\\)/"
  // ],
};

export default config;
