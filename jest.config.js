const {defaults} = require('jest-config');

module.exports = {
    preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@babel/parser/.*)"
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
   transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
          automock: false,
          modulePathIgnorePatterns: ["src/index.ts", "src/util.ts", "node_modules/multer-s3"],
 collectCoverageFrom: [
    '!src/util.ts',
    '!src/index.ts',
    '!dist/',
    '!node_modules'
],
  coveragePathIgnorePatterns: [
      "/node_modules/"
    ],
  setupFiles: ["<rootDir>/jest/setup.js"],


}