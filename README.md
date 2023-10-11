# Beam Subgraphs Monorepo

This repository contains _[The Graph protocol](https://thegraph.com/docs)_ subgraphs configured for **[Beam network](https://docs.onbeam.com)**.

Included subgraphs:

- `blocks` - forked from [blocklytics/ethereum-blocks](https://github.com/blocklytics/ethereum-blocks)
- `uniswap-v2` - forked from [uniswap/v2-subgraph](https://github.com/uniswap/v2-subgraph)

## Getting started

- install Node.js >=16 and yarn >=1.22
- install [graph-cli](https://github.com/graphprotocol/graph-tooling/blob/main/packages/cli/README.md): `yarn global add @graphprotocol/graph-cli`
- run `yarn` from the repository _root_ to install dependencies

The default network names used in this repo are `beam` and `beamtest`. Your target [graph-node](https://github.com/graphprotocol/graph-node)'s config must match one of these values.

## CLI

All subgraph packages in this monorepo share the following commands to facilitate the development workflow (the extension `-test` refers to using Beam testnet):

- `codegen`: generate types from ABIs and GraphQL schema
- `build[-test]`: build TS into WASM
- `create[-test]`: create a subgraph on the [graph-node](https://github.com/graphprotocol/graph-node)
- `deploy[-test]`: deploy the subgraph to the graph-node
- `all[-test]`: all of the above in sequence

To execute any command for a specific subgraph, use `yarn workspace <packageName> <command>`, e.g.:

```bash
yarn workspace blocks codegen
yarn workspace blocks build-test
yarn workspace blocks create-test
yarn workspace blocks deploy-test

yarn workspace uniswap-v2 all-test
```

## Customization

To customize any of these subgraphs for other networks, check the following for your package:

- add your network and contract setup in `networks.json`
- update node urls and network names in the commands in `package.json > scripts`
- for `uniswap-v2` only: see `./src/configs/config.ts` for all necessary parameters
