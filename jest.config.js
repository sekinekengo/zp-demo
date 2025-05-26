export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
      moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/components/$1',
  },
    testEnvironment: 'node',
      transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.jest.json',
    }],
  },
    testMatch: [
        '<rootDir>/jest-samples/**/*.test.(ts|tsx|js|jsx)',
    ],
    collectCoverageFrom: [
        'jest-samples/**/*.{ts,tsx,js,jsx}',
        '!jest-samples/**/*.test.{ts,tsx,js,jsx}',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    setupFilesAfterEnv: ['<rootDir>/jest-samples/setup.ts'],
}; 