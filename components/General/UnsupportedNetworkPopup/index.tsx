import React, { useEffect } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { isSupportedNetwork, isSupportedBridgeNetwork } from '@libs/utils/supportedNetworks';
import { ARBITRUM } from '@libs/constants';
import { switchNetworks } from '@libs/utils/rpcMethods';
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';

const UnsupportedNetwork: React.FC = () => {
    const router = useRouter();
    const { account, network, provider, unsupportedNetworkPopupRef } = useWeb3();
    const { addToast, updateToast } = useToasts();
    // unsupported network popup
    useEffect(() => {
        const bridgePage = router.pathname.startsWith('/bridge');
        if (
            ((bridgePage && !isSupportedBridgeNetwork(network)) || (!bridgePage && !isSupportedNetwork(network))) &&
            !!provider &&
            !!account
        ) {
            // ignore if we are already showing the error
            if (!unsupportedNetworkPopupRef.current) {
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
    }, [router.pathname, network, account, provider]);

    return <></>;
};

export default UnsupportedNetwork;
