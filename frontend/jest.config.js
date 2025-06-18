module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/**/*.stories.{js,jsx}',
    '!src/**/*.styles.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}; 