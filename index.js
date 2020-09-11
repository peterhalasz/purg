#!/usr/bin/nodejs

const fetch = require('node-fetch');
const yargs = require('yargs');

const { argv } = yargs
  .usage('Usage $0 <github user name> [options]')
  .example('$0 microsoft -o', 'Prints the public repos of Microsoft')
  .example('$0 peterhalasz', 'Prints the public repos of peterhalasz')
  .example(
    '$0 peterhalasz -e',
    'Prints the public repos of peterhalasz and fails if there are any that is public',
  )
  .boolean('o')
  .alias('o', 'org')
  .describe('o', 'Indicates an organisation')
  .array('e')
  .alias('e', 'expected')
  .describe('e', 'Expected public repositories')
  .number('n')
  .alias('n', 'number')
  .describe('n', 'Expected number of public repositories')
  .alias('h', 'help')
  .demandCommand(1)
  .check((args) => {
    if (args.e !== undefined && args.n !== undefined) {
      throw new Error("The 'e' and 'n' flags are mutually exclusive ");
    }

    return true;
  });

function parseAccountType() {
  if (argv.o === true) {
    return 'org';
  }
  return 'user';
}

async function fetchRepositories(accountName, accountType) {
  const response = await fetch(
    `https://api.github.com/${accountType}s/${accountName}/repos`,
  );

  if (response.status !== 200) {
    throw new Error(
      `Error while fetching Github repos for ${accountType} ${accountName}. ${response.status}, ${response.statusText}`,
    );
  }

  return response.json();
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

function performChecks(publicRepositoryNames) {
  if (argv.n && publicRepositoryNames.length !== argv.n) {
    throw new Error(
      `The expected number of public repositories (${argv.n}) does not match the actual number (${publicRepositoryNames.length})!`,
    );
  }

  if (argv.e && argv.e.length > 0) {
    let pass = true;
    const expectedRepos = new Set(argv.e);
    const unexpectedRepos = [...publicRepositoryNames].filter(
      (r) => !expectedRepos.has(r),
    );

    if (unexpectedRepos.length > 0) {
      console.log('\n');
      console.log(`*** Unexpected public repositories for ${argv._} ***`);
      unexpectedRepos.forEach((r) => console.log(r));
      pass = false;
    }

    const actualRepos = new Set(publicRepositoryNames);
    const expectedButNotFoundRepos = [...argv.e].filter(
      (r) => !actualRepos.has(r),
    );

    if (expectedButNotFoundRepos.length > 0) {
      console.log('\n');
      console.log(`*** Expected but not found repositories for ${argv._} ***`);
      expectedButNotFoundRepos.forEach((r) => console.log(r));
      pass = false;
    }

    if (!pass) {
      throw new Error('Checks failed');
    }
  }
}

(async () => {
  try {
    const accountName = argv._;
    const accountType = parseAccountType();

    const repositories = await fetchRepositories(accountName, accountType);

    const publicRepositoryNames = repositories
      .filter((repo) => repo.private === false)
      .map((repo) => repo.name);

    printPublicRepositories(publicRepositoryNames);

    performChecks(publicRepositoryNames);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
