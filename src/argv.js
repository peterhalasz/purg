const yargs = require('yargs');

const { argv } = yargs
  .usage('Usage $0 <github user name> [options]')
  .example('$0 microsoft -o', 'Prints the public repos of Microsoft')
  .example('$0 peterhalasz', 'Prints the public repos of peterhalasz')
  .example(
    '$0 peterhalasz -e purg test',
    'Prints the public repos of peterhalasz and fails if it does not match the list',
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

module.exports = argv;
