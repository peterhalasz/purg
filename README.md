# purg - public repository guard

A simple CLI app to check the public repositories of a user or organization.
Use it in your CI to make sure you're not leaking any source code.

# Getting the app

Install the app with yarn

```
yarn global add purg
```

or npm

```
npm install -G purg
```

and run it with

```
purg <github user name> [options]
```

Alternatively you can run it without installation with [npx](https://www.npmjs.com/package/npx)

```
npx purg <github user name> [options]
```

# Usage

```
Usage purg <github user name> [options]

Options:
  --version       Show version number                                  [boolean]
  -o, --org       Indicates an organisation                            [boolean]
  -e, --expected  Expected public repositories                           [array]
  -n, --number    Expected number of public repositories                [number]
  -h, --help      Show help                                            [boolean]

Examples:
  purg microsoft -o               Prints the public repos of Microsoft
  purg peterhalasz                Prints the public repos of peterhalasz
  purg peterhalasz -e purg test   Prints the public repos of peterhalasz and fails if it does not match the list
```

# Contributing

Yes please (:
