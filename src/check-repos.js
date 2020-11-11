function checkRepositoryNames(publicRepositoryNames, expectedRepos) {
  const expectedReposSet = new Set(expectedRepos);
  const unexpectedReposSet = [...publicRepositoryNames].filter(
    (r) => !expectedReposSet.has(r),
  );

  const actualRepos = new Set(publicRepositoryNames);
  const expectedButNotFoundRepos = [...expectedRepos].filter(
    (r) => !actualRepos.has(r),
  );

  return {
    unexpectedReposSet, expectedButNotFoundRepos,
  };
}

module.exports = {
  checkRepositoryNames,
};
