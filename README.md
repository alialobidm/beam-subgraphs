# Beam Subgraphs Monorepo

This repository contains _[The Graph protocol](https://thegraph.com/docs)_ subgraphs configured for **[Beam network](https://docs.onbeam.com)**.

Included subgraphs:

- `blocks` - forked from [blocklytics/ethereum-blocks](https://github.com/blocklytics/ethereum-blocks)
- `uniswap-v2` - forked from [uniswap/v2-subgraph](https://github.com/uniswap/v2-subgraph)
- `ens` - forked from [ensdomains/ens-subgraph](https://github.com/ensdomains/ens-subgraph)
- `validator-manager` - subgraph for Beam proof of stake
- `erc721` - subgraph for generic NFT data

## Getting started

- install Node.js >=20 and yarn >=1.22
- run `yarn` from the repository _root_ to install dependencies

The default network names used in this repo are `beam` and `beam-testnet`. Your target [graph-node](https://github.com/graphprotocol/graph-node)'s config must match one of these values. You can find instructions on how to [set up your graph-node with Beam](#running-a-graph-node-in-docker) below.

You don't need to install [graph-cli](https://github.com/graphprotocol/graph-tooling/blob/main/packages/cli/README.md), since every subgraph package comes with it's own particular setup to use, depending on the version its code was written for. If you'd need it nevertheless, install it using `yarn global add @graphprotocol/graph-cli`.

## CLI

All subgraph packages in this monorepo share the following commands to facilitate the development workflow (the extension `:test` refers to using Beam testnet):

- `codegen[:test]`: generate types from ABIs and GraphQL schema
- `build[:test]`: build TS into WASM and compile subgraph
- `index[:test]`: create a subgraph on the graph-node (not using `create` here to avoid clash with `yarn create`)
- `deploy[:test]`: deploy the subgraph to the graph-node
- `all[:test]`: all of the above in sequence

To execute any command for a specific subgraph, use `yarn <subfolder> <command>`, e.g.:

```bash
# testnet, step by step
yarn blocks codegen:test
yarn blocks build:test
yarn blocks index:test
yarn blocks deploy:test

# mainnet, using shortcut
yarn uniswap-v2 all
```

## Subgraph customization

To customize any of these subgraphs for other networks, check the following for your package:

- add your network and contract setup in `networks.json`
  - packages using older versions of graph-cli may have separate `network.[networkName].json` files
- update node urls and network names in the commands in `package.json > scripts` (we recommend to introduce your own commands, e.g. `build:myNetwork`)
- for `uniswap-v2` only: see `./src/configs/*` for all necessary parameters

## Running a _graph-node_ in Docker

- set up a VPS, install `git`, `docker`, `docker-compose`
  - e.g. via `sudo apt install git docker docker-compose -y`
- clone [graph-node](https://github.com/graphprotocol/graph-node)
  - `git clone --depth=1 https://github.com/graphprotocol/graph-node.git`
- update `docker-compose.yml` in `./graph-node/docker` (see also [docs](https://github.com/graphprotocol/graph-node/blob/master/docker/README.md))
  - change `graph-node > environments > ethereum` to look like this: `<network name>:<rpc url>`, e.g. `beam:https://myArchiveRpc.foo`
  - update `postgress_pass` and `POSTGRES_PASSWORD` to _not_ use the default password
- create a **systemd** service to run the docker containers automatically
  - create `/etc/systemd/system/graph.service`, e.g. by running `sudo nano /etc/systemd/system/graph.service` and pasting the contents below from the clipboard
  - update `User` and `WorkingDirectory` to match your setup

```
[Unit]
Description=graph
Requires=docker.service
After=docker.service
[Service]
Restart=always
User=root
Group=docker
WorkingDirectory=/root/graph-node/docker
ExecStartPre=/usr/bin/docker-compose -f docker-compose.yml down
ExecStart=/usr/bin/docker-compose -f docker-compose.yml up
ExecStop=/usr/bin/docker-compose -f docker-compose.yml down
[Install]
WantedBy=multi-user.target
```

- enable and run services

```bash
sudo systemctl start docker

sudo systemctl enable graph
sudo systemctl start graph

sudo systemctl status graph
```

### Considerations

- an _archive node_ is required to run the graph-node
- do not run service as root/superuser
- exposed [admin endpoints](https://thegraph.com/docs/en/operating-graph-node/#ports) should be protected
- SSL needs to be set up (e.g. via nginx reverse proxy + certbot)
