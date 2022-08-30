import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { useStore } from '~/store/main';
import { selectUnsupportedNetworkRef } from '~/store/UnsupportedNetworkSlice';
import { selectWeb3Info } from '~/store/Web3Slice';
import { switchNetworks } from '~/utils/rpcMethods';
import { isSupportedNetwork, isSupportedBridgeNetwork } from '~/utils/supportedNetworks';
import { Notification } from '../Notification';

const UnsupportedNetwork: React.FC = () => {
    const router = useRouter();
    const { account, network, provider } = useStore(selectWeb3Info, shallow);
    const { unsupportedNetworkPopupRef, setUnsupportedNetworkPopupRef } = useStore(
        selectUnsupportedNetworkRef,
        shallow,
    );

    // unsupported network popup
    useEffect(() => {
        const bridgePage = router.pathname.startsWith('/bridge');
        if (
            ((bridgePage && !isSupportedBridgeNetwork(network)) || (!bridgePage && !isSupportedNetwork(network))) &&
            !!provider &&
            !!account
        ) {
            // ignore if we are already showing the error
            if (!unsupportedNetworkPopupRef) {
                const toastId = toast(
                    <Notification title="Unsupported Network">
                        <span key="unsupported-network-content" className="text-sm">
                            <a
                                className="mt-3 cursor-pointer text-tracer-400 underline hover:opacity-80"
                                onClick={() => {
                                    switchNetworks(provider, NETWORKS.ARBITRUM);
                                }}
                            >
                                Switch to Arbitrum Mainnet
                            </a>
                            <br />
                            <span>New to Arbitrum? </span>
                            <a
                                href="https://pools.docs.mycelium.xyz/tutorials/tutorials/arbitrum-one"
                                target="_blank"
                                rel="noreferrer noopner"
                                className="mt-3 cursor-pointer text-tracer-400 underline hover:opacity-80"
                            >
                                Get started
                            </a>
                        </span>
                    </Notification>,
                    {
                        type: 'error',
                        autoClose: false,
                        onClose: () => {
                            setUnsupportedNetworkPopupRef(undefined);
                        },
                    },
                );
                setUnsupportedNetworkPopupRef(toastId.toString());
            }
        } else {
            if (unsupportedNetworkPopupRef) {
                toast.update(unsupportedNetworkPopupRef, {
                    render: <Notification title="Switched Network" />,
                    type: 'success',
                    autoClose: 5000,
                });
                setUnsupportedNetworkPopupRef(undefined);
            }
        }
    }, [router.pathname, network, account, provider]);

    return <></>;
};

export default UnsupportedNetwork;
