import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { useStore } from '@store/main';
import { selectWeb3Info } from '@store/Web3Slice';
import { selectUnsupportedNetworkRef } from '@store/UnsupportedNetworkSlice';
import { switchNetworks } from '~/utils/rpcMethods';
import { isSupportedNetwork, isSupportedBridgeNetwork } from '~/utils/supportedNetworks';
import { Notification } from '../Notification';

const UnsupportedNetwork: React.FC = () => {
    const router = useRouter();
    const { account, network, provider } = useStore(selectWeb3Info);
    const { unsupportedNetworkPopupRef, setUnsupportedNetworkPopupRef } = useStore(selectUnsupportedNetworkRef);

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
                                className="mt-3 underline cursor-pointer hover:opacity-80 text-tracer-400"
                                onClick={() => {
                                    switchNetworks(provider, NETWORKS.ARBITRUM);
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
