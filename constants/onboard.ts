import { NETWORKS } from "@tracer-protocol/pools-js"
import {Initialization} from "@tracer-protocol/onboard/dist/src/interfaces";
import {DEFAULT_NETWORK, networkConfig} from "@context/Web3Context/Web3Context.Config"


export const onboardConfig: Initialization = {
    networkId: parseInt(DEFAULT_NETWORK),
    hideBranding: true,
    walletSelect: {
        heading: 'Connect Wallet',
        wallets: [
            { walletName: 'metamask' },
            { walletName: 'coinbase' },
            { walletName: 'torus' },
            // { walletName: "binance" },

            {
                walletName: 'walletConnect',
                rpc: {
                    [NETWORKS.ARBITRUM]: networkConfig[NETWORKS.ARBITRUM].publicRPC,
                    [NETWORKS.ARBITRUM_RINKEBY]: networkConfig[NETWORKS.ARBITRUM_RINKEBY].publicRPC,
                    [NETWORKS.MAINNET]: networkConfig[NETWORKS.MAINNET].publicRPC,
                },
            },
        ],

    },
    walletCheck: [{ checkName: 'accounts' }, { checkName: 'connect' }]
}
