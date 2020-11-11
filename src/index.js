#!/usr/bin/nodejs

const argv = require('./argv');
const fetchRepositories = require('./fetch-repos');
const { checkRepositoryNames } = require('./check-repos');

function parseAccountType() {
  if (argv.o === true) {
    return 'org';
  }
  return 'user';
}

function printPublicRepositories(publicRepositoryNames) {
  if (publicRepositoryNames.length === 0) {
    console.log(`*** No public repository found for ${argv._} ***`);
  }

  console.log(
    `*** ${publicRepositoryNames.length} public repositories found for ${argv._}: ***`,
  );
  publicRepositoryNames.forEach((name) => console.log(name));
}

async function app() {
  try {
    const accountName = argv._;
    const accountType = parseAccountType();

    const repositories = await fetchRepositories(accountName, accountType);

    const publicRepositoryNames = repositories
      .filter((repo) => repo.private === false)
      .map((repo) => repo.name);

    printPublicRepositories(publicRepositoryNames);

    if (argv.n && argv.n !== publicRepositoryNames.length) {
      console.log(`Expected number of public repositories doesn't match. Expected: ${argv.n} actual: ${publicRepositoryNames.length}`);

      process.exit(1);
    }

    if (argv.e && argv.e.length > 0) {
      const res = checkRepositoryNames(publicRepositoryNames, argv.e);

      if (res.unexpectedReposSet.length > 0) {
        console.log('\n *** Unexpected public repositories ***');
        res.unexpectedReposSet.forEach((r) => console.log(r));
      }

      if (res.expectedButNotFoundRepos.length > 0) {
        console.log('\n *** Expected but not found repositories ***');
        res.expectedButNotFoundRepos.forEach((r) => console.log(r));
      }

      if (res.unexpectedReposSet.length > 0 || res.expectedButNotFoundRepos.length > 0) {
        process.exit(1);
      }

      process.exit(0);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = app;
