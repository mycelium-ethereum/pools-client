import React, { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { useArbitrumBridge } from '@context/ArbitrumBridgeContext';
import { isSupportedNetwork } from '@libs/utils/supportedNetworks';
import { ARBITRUM } from '@libs/constants';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { useToasts } from 'react-toast-notifications';
import { destinationNetworkLookup } from '@libs/utils/bridge';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

const UnsupportedNetwork: React.FC = () => {
    const { account, network, provider, unsupportedNetworkPopupRef } = useWeb3();
    const { bridgeModalIsOpen } = useArbitrumBridge();
    const { addToast, updateToast, removeToast } = useToasts();

    // unsupported network popup
    useEffect(() => {
        // don't show this while the arb bridge is open
        const hasDismissedInitialArbModal = localStorage.getItem('showBridgeFunds') === 'true';
        console.log('unsupported', hasDismissedInitialArbModal, bridgeModalIsOpen, account);
        if (
            hasDismissedInitialArbModal &&
            !bridgeModalIsOpen &&
            !isSupportedNetwork(network) &&
            !!provider &&
            !!account
        ) {
            console.log('in here', unsupportedNetworkPopupRef.current);
            // ignore if we are already showing the error
            if (!unsupportedNetworkPopupRef.current) {
                console.log('Already showing');
                // @ts-ignore
                unsupportedNetworkPopupRef.current = addToast(
                    [
                        'Unsupported Network',
                        <span key="unsupported-network-content" className="text-sm">
                            <a
                                className="mt-3 underline cursor-pointer hover:opacity-80 text-tracer-400"
                                onClick={() => {
                                    switchNetworks(provider, ARBITRUM);
                                }}
                            >
                                Switch to Arbitrum Mainnet
                            </a>
                            <br />
                            <span>New to Arbitrum? </span>
                            <a
                                href="https://docs.tracer.finance/tutorials/add-arbitrum-mainnet-to-metamask"
                                target="_blank"
                                rel="noreferrer noopner"
                                className="mt-3 underline cursor-pointer hover:opacity-80 text-tracer-400"
                            >
                                Get started
                            </a>
                        </span>,
                    ],
                    {
                        appearance: 'error',
                        autoDismiss: false,
                        onDismiss: () => {
                            unsupportedNetworkPopupRef.current = '';
                        },
                    },
                );
            }
        } else {
            if (unsupportedNetworkPopupRef.current) {
                updateToast(unsupportedNetworkPopupRef.current as unknown as string, {
                    content: 'Switched Network',
                    appearance: 'success',
                    autoDismiss: true,
                });
                unsupportedNetworkPopupRef.current = '';
            }
        }
    }, [network, account, provider]);

    // when arb bridge closes, prompt users to switch back to arb if they haven't already
    useEffect(() => {
        if (!bridgeModalIsOpen && network) {
            if (!isSupportedNetwork(network)) {
                // try take them back to destination network, fall back to arb mainnet
                const destinationNetworkId = destinationNetworkLookup[network] || ARBITRUM;
                const destinationNetwork = networkConfig[destinationNetworkId];

                // ignore if we are already showing the error
                if (destinationNetwork && !unsupportedNetworkPopupRef.current) {
                    // @ts-ignore
                    unsupportedNetworkPopupRef.current = addToast(
                        [
                            'Switch back to Arbitrum',
                            <span key="unsupported-network-content" className="text-sm">
                                Perpetual Pools runs on Arbitrum.{' '}
                                <a
                                    className="mt-3 underline cursor-pointer hover:opacity-80 text-tracer-400"
                                    onClick={() => {
                                        switchNetworks(provider, destinationNetworkId);
                                        removeToast(unsupportedNetworkPopupRef.current);
                                        unsupportedNetworkPopupRef.current = '';
                                    }}
                                >
                                    Switch back to {destinationNetwork.name}.
                                </a>
                            </span>,
                        ],
                        {
                            appearance: 'error',
                            autoDismiss: false,
                            onDismiss: () => {
                                unsupportedNetworkPopupRef.current = '';
                            },
                        },
                    );
                }
            }
        }
    }, [bridgeModalIsOpen]);

    return <></>;
};

export default UnsupportedNetwork;
