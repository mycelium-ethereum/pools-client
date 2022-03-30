import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { isSupportedNetwork, isSupportedBridgeNetwork } from '~/utils/supportedNetworks';
import { ARBITRUM } from '~/constants/networks';
import { switchNetworks } from '~/utils/rpcMethods';
import { useRouter } from 'next/router';
import { Notification } from '../Notification';

const UnsupportedNetwork: React.FC = () => {
    const router = useRouter();
    const { account, network, provider, unsupportedNetworkPopupRef } = useWeb3();

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
                unsupportedNetworkPopupRef.current = toast(
                    <Notification title="Unsupported Network">
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
                        </span>
                        ,
                    </Notification>,
                    {
                        type: 'error',
                        autoClose: false,
                        onClose: () => {
                            unsupportedNetworkPopupRef.current = '';
                        },
                    },
                );
            }
        } else {
            if (unsupportedNetworkPopupRef.current) {
                toast.update(unsupportedNetworkPopupRef.current, {
                    render: <Notification title="Switched Network" />,
                    type: 'success',
                    autoClose: 5000,
                });
                unsupportedNetworkPopupRef.current = '';
            }
        }
    }, [router.pathname, network, account, provider]);

    return <></>;
};

export default UnsupportedNetwork;
