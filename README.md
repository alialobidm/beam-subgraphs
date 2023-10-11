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
- `build[-test]`: build TS into WASM and compile subgraph
- `create[-test]`: create a subgraph on the graph-node
- `deploy[-test]`: deploy the subgraph to the graph-node
- `all[-test]`: all of the above in sequence

To execute any command for a specific subgraph, use `yarn workspace <packageName> <command>`, e.g.:

```bash
yarn workspace blocks codegen
yarn workspace blocks build-test
yarn workspace blocks create-test
yarn workspace blocks deploy-test

yarn workspace uniswap-v2 all
```

## Subgraph customization

To customize any of these subgraphs for other networks, check the following for your package:

- add your network and contract setup in `networks.json`
- update node urls and network names in the commands in `package.json > scripts`
- for `uniswap-v2` only: see `./src/configs/config.ts` for all necessary parameters

## Running a [graph-node](https://github.com/graphprotocol/graph-node) in Docker

- set up a VPS, install `git`, `docker`, `docker-compose`
  - e.g. via `sudo apt install git docker docker-compose`
- clone [graph-node](https://github.com/graphprotocol/graph-node)
  - `git clone --depth=1 https://github.com/graphprotocol/graph-node.git graph-node`
- update `docker-compose.yml` in `./graph-node/docker` (see also [docs](https://github.com/graphprotocol/graph-node/blob/master/docker/README.md))
  - change the ethereum parameter in `graph-node > environments` to look like this: `<network name>:<rpc url>`, e.g. `beamtest:http://myrpc.foo`
- create a **systemd** service to run the docker containers automatically
  - create `thegraph.service` in `/etc/systemd/system` like below. Update `User` and `WorkingDirectory` to match your setup

```
[Unit]
Description=thegraph
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
sudo systemctl enable docker
sudo systemctl start docker

sudo systemctl enable thegraph
sudo systemctl start thegraph
sudo systemctl status thegraph
```

### Considerations

- do not run service as root/superuser
- exposed [admin endpoints](https://thegraph.com/docs/en/operating-graph-node/#ports) should be protected
- https needs to be set up
