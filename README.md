## Status

This client is still in development. It serves as an interface for Tracer Perpetual Pools, allowing users to long/short assets with no liquidations and no margins.
## Stable Branches

-   master

-   develop

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

## Running

For a fully working version you will need to run a keeper via tracer-cli. But to get it off the ground this will display the list of available pools.

Occasionally npm struggles with the depending pinning so try yarn if you cannot seem to get the install working.

`npm install` or `yarn` then
`npm run dev` or `yarn dev`