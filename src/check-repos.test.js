const { checkRepositoryNames } = require('./check-repos');

test('checkRepositoryNames no input', () => {
  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames([], []);

  expect(unexpectedReposSet).toEqual([]);
  expect(expectedButNotFoundRepos).toEqual([]);
});

test('checkRepositoryNames no expected repos input', () => {
  const publicRepositoryNames = ['test1', 'test2', 'test3'];
  const expectedRepos = [];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual(['test1', 'test2', 'test3']);
  expect(expectedButNotFoundRepos).toEqual([]);
});

test('checkRepositoryNames no actual repos input', () => {
  const publicRepositoryNames = [];
  const expectedRepos = ['test1', 'test2', 'test3'];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual([]);
  expect(expectedButNotFoundRepos).toEqual(['test1', 'test2', 'test3']);
});

test('checkRepositoryNames actual repos match expected repos', () => {
  const publicRepositoryNames = ['test1', 'test2', 'test3'];
  const expectedRepos = ['test1', 'test2', 'test3'];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual([]);
  expect(expectedButNotFoundRepos).toEqual([]);
});

test('checkRepositoryNames more actual repos than expected', () => {
  const publicRepositoryNames = ['test1', 'test2', 'test3', 'test4'];
  const expectedRepos = ['test1', 'test2', 'test3'];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual(['test4']);
  expect(expectedButNotFoundRepos).toEqual([]);
});

test('checkRepositoryNames more expected repos than actual', () => {
  const publicRepositoryNames = ['test1', 'test2', 'test3'];
  const expectedRepos = ['test1', 'test2', 'test3', 'test4'];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual([]);
  expect(expectedButNotFoundRepos).toEqual(['test4']);
});

test('checkRepositoryNames nothing matches', () => {
  const publicRepositoryNames = ['test1', 'test2', 'test3'];
  const expectedRepos = ['test4', 'test5', 'test6'];

  const { unexpectedReposSet, expectedButNotFoundRepos } = checkRepositoryNames(publicRepositoryNames, expectedRepos);

  expect(unexpectedReposSet).toEqual(['test1', 'test2', 'test3']);
  expect(expectedButNotFoundRepos).toEqual(['test4', 'test5', 'test6']);
});
