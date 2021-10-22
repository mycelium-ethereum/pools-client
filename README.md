## Status

This client is still in development. It serves as an interface for Tracer Perpetual Pools, allowing users to long/short assets with no liquidations and no margins.
## Stable Branches

-   master

-   develop

## Development and Contributions

Development should branch from `develop` until a staged release into `master`. When creating a branch use either
- `update/<BRANCH-NAME-HYPHEN-SEPERATED>`
- `fix/<BRANCH-NAME-HYPHEN-SEPERATED>`
- `feature/<BRANCH-NAME-HYPHEN-SEPERATED>`

Update refers to any sort of maintenance or general changes that arent necessarily a fix. These can include improvements, maintenance and any sort of general admin.

Fixes relate specifically to an issue that is being resolved.

Feature branches are for larger or new features which do not exist in the current code base.

### Pull requests
Pull requests follow a basic template. This includes two headings `Motivation` and `Changes`. `Motivation` is basically the why. What is the code you are adding trying to achieve. `Changes` is any intended functionality you were trying to achieve. This can be as granular as you like since it makes reviewing the PR a lot easier.

## Setup

In order to get the full Dapp running locally you will need to run a number of things. 

- Run a development eth-client using hardhat or ganache-cli.
- Deploy pools contracts
- Copy the Pool Factory address into a .env or .env.local file as below
- The RPC variables are optional in the .env files although it is recommended to set some up for development as the default arbitrum RPC's are temperamental

```
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x54e98762CA9E0C970F1Df47b0F3B4Bb4f5e6C655

NEXT_PUBLIC_MAINNET_RPC='MAINNET_RPC'
NEXT_PUBLIC_MAINNET_WSS_RPC='MAINNET_WSS'
NEXT_PUBLIC_TESTNET_RPC='TESTNET_RPC'
NEXT_PUBLIC_TESTNET_WSS_RPC='TESTNET_WSS'
```

You should be able to run the application on `Arbitrum` and `Arbitrum Rinkeby` without any configuration. Both these networks have active keeper bots running.

## Running


Occasionally npm struggles with the depending pinning so try yarn if you cannot seem to get the install working.

`npm install` or `yarn` then
`npm run dev` or `yarn dev`

### Running Locally

For a fully working version you will need to run a keeper otherwise the pools will never be upkept and you will never receive your pool tokens after committing. You can either write your own keeper bot or there is a [python implementation](https://github.com/mycelium-ethereum/PerpetualPoolsKeeper) created by the [one and only](https://github.com/orgs/tracer-protocol/people/mynameuhh).