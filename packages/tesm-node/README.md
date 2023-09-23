# tesm-node

A thin wrapper around [ts-node-esm](https://github.com/TypeStrong/ts-node) that adds
support for [tsconfig
paths](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
and importing files [without file
extensions](https://nodejs.org/api/esm.html#mandatory-file-extensions) when
developing in TypeScript with ESM.

## Install

```sh
# Locally in your project
npm i -D typescript ts-node tesm-node

# Or globally
npm i -g typescript ts-node tesm-node

# If using tsconfig paths
npm i -D tsconfig-paths

# Depending on configuration, you may also need types
npm i -D @types/node
```

## Usage

Because this is just a wrapper around
[ts-node](https://www.npmjs.com/package/ts-node), it retains nearly all of it's API. Just replace `ts-node` with
`tesm-node`.

```sh
# Basic usage.
tesm-node src/script.ts

# With tsconfig-paths
tesm-node src/script

# With the loader flag
node --loader tesm-node script.ts
```
