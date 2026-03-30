module.exports = {
  projects: [
    {
      displayName: 'api',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/apps/api/**/__tests__/**/*.test.ts'],
      preset: 'ts-jest',
    },
    {
      displayName: 'contracts',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/contracts/test/**/*.test.ts'],
      preset: 'ts-jest',
    },
  ],
};
