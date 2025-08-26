module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
};
