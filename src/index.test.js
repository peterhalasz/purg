const mockConsole = require('jest-mock-console');
const mockArgv = require('./argv');

jest.mock('./argv', () => ({}));
jest.mock('./fetch-repos', () => () => Promise.resolve([{
  private: false, name: 'test-repo-1',
}, {
  private: false, name: 'test-repo-2',
}, {
  private: false, name: 'test-repo-3',
}, {
  private: false, name: 'test-repo-4',
}]));

const app = require('./index.js');

test('app fails if the number of expected repos dont match', async () => {
  const restoreConsole = mockConsole();

  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

  mockArgv._ = 'test-user';
  mockArgv.n = 10;
  mockArgv.e = undefined;

  await app();

  expect(mockExit).toHaveBeenCalledWith(1);
  expect(console.log).toHaveBeenNthCalledWith(6, "Expected number of public repositories doesn't match. Expected: 10 actual: 4");

  restoreConsole();
});

test('app fails if the expected repos dont match the actual', async () => {
  jest.restoreAllMocks();
  const restoreConsole = mockConsole();

  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

  mockArgv._ = 'test-user';
  mockArgv.n = undefined;
  mockArgv.e = ['test-repo-0', 'test-repo-1', 'test-repo-2', 'test-repo-4'];

  await app();

  expect(mockExit).toHaveBeenCalledWith(1);
  expect(console.log).toHaveBeenNthCalledWith(7, 'test-repo-3');
  expect(console.log).toHaveBeenNthCalledWith(9, 'test-repo-0');

  restoreConsole();
});
