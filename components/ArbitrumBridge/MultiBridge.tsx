import React, { useState, useMemo, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { TWModal } from '@components/General/TWModal';
import { Network } from '@context/Web3Context/Web3Context.Config';
import { SwapOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input } from '@components/General/Input/Numeric';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Currency } from '@components/General/Currency';
import Button from '@components/General/Button';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { BridgeableAsset, BridgeableBalances } from '@libs/types/General';
import Close from '../../public/img/general/close.svg';

interface MultiBridgeProps {
    show: boolean;
    fromNetwork: Network;
    toNetwork?: Network;
    bridgeableAssetList: BridgeableAsset[];
    bridgeableBalances: BridgeableBalances;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    onSwitchNetwork: (networkId: Network['id']) => void;
    onClose: () => void;
    onBridgeAsset: (asset: BridgeableAsset, amount: BigNumber, onSuccess: () => void) => void;
    onApproveToken: (tokenAddress: string, spender: string) => void;
}

export const MultiBridge: React.FC<MultiBridgeProps> = (props) => {
    const {
        fromNetwork,
        toNetwork,
        bridgeableAssetList,
        bridgeableBalances,
        onSwitchNetwork,
        refreshBridgeableBalance,
        onBridgeAsset,
        show,
        onClose,
        onApproveToken,
    } = props;

    const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);

    const [selectedAsset, setSelectedAsset] = useState(bridgeableAssetList[selectedAssetIndex]);
    const [amount, setAmount] = useState(new BigNumber(0));
    const [isBridging, setIsBridging] = useState(false);

    useEffect(() => {
        if (show) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [show]);

    useEffect(() => {
        setSelectedAsset(bridgeableAssetList[selectedAssetIndex]);
    }, [selectedAssetIndex]);

    useEffect(() => {
        if (selectedAsset) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [selectedAsset]);

    const bridgeAsset = () => {
        if (!selectedAsset || amount.eq(0)) {
            return;
        }

        setIsBridging(true);
        onBridgeAsset(selectedAsset, amount, () => {
            setIsBridging(false);
            setAmount(new BigNumber(0));
        });
    };

    const selectedAssetBalance = useMemo(() => {
        const assetBalance = bridgeableBalances[fromNetwork?.id]?.[selectedAsset?.symbol];
        return assetBalance || null;
    }, [selectedAsset, fromNetwork, bridgeableBalances]);

    const approveToken = () => {
        if (!selectedAsset || !selectedAsset.address || !selectedAssetBalance) {
            return;
        }

        onApproveToken(selectedAsset.address, selectedAssetBalance.spender);
    };

    const buttonGroupOptions = useMemo(() => {
        return bridgeableAssetList.map(({ symbol }, index) => ({
            key: index,
            text: symbol,
        }));
    }, [bridgeableAssetList]);

    const approvalRequired = useMemo(() => {
        if (!selectedAsset || !selectedAssetBalance) {
            return false;
        }

        if (selectedAsset.symbol === 'ETH') {
            return false;
        }

        return selectedAssetBalance.allowance.eq(0);
    }, [selectedAsset, selectedAssetBalance]);

    return (
        <TWModal open={show} onClose={() => onClose()}>
            <div>
                <div className="flex justify-between items-center">
                    <div className="font-bold text-2xl">Bridge Funds</div>
                    <div className="w-3 h-3 ml-4 cursor-pointer" onClick={() => onClose()}>
                        <Close />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <div className="my-2 mb-4 w-full">
                            <label htmlFor="from" className="block text-base font-medium mb-2">
                                From
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    disabled
                                    type="text"
                                    name="fromNetwork"
                                    id="fromNetwork"
                                    className="block w-full p-4 sm:text-sm rounded-md border-2 font-normal border-theme-border bg-theme-button-bg text-theme-text"
                                    value={fromNetwork?.name}
                                />
                            </div>
                        </div>

                        <button
                            className="cursor-pointer p-6 text-xl focus:outline-none"
                            onClick={() => {
                                if (toNetwork) {
                                    onSwitchNetwork(toNetwork.id);
                                }
                            }}
                        >
                            <SwapOutlined />
                        </button>

                        <div className="my-2 mb-4 w-full">
                            <label htmlFor="to" className="block text-base font-medium mb-2">
                                To
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    disabled
                                    type="text"
                                    name="toNetwork"
                                    id="toNetwork"
                                    className="block w-full p-4 sm:text-sm rounded-md border-2 font-normal border-theme-border bg-theme-button-bg text-theme-text"
                                    value={toNetwork?.name || 'N/A'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-2 mb-4 flex-grow">
                            <label htmlFor="asset" className="block text-base font-medium mb-2">
                                Asset
                            </label>
                            <TWButtonGroup
                                value={selectedAssetIndex}
                                size="xl"
                                color="tracer"
                                fullWidthButtons={true}
                                onClick={(val) => {
                                    setSelectedAssetIndex(val);
                                }}
                                options={buttonGroupOptions}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-2 mb-4 flex-grow">
                            <label htmlFor="amount" className="block text-base font-medium mb-2">
                                Amount
                            </label>
                            <InputContainer className="w-full ">
                                <Input
                                    type="text"
                                    className="w-full h-full font-normal text-base"
                                    value={amount.eq(0) ? '' : amount.toFixed()}
                                    onUserInput={(val) => setAmount(new BigNumber(val || 0))}
                                />
                                <InnerInputText>
                                    {selectedAsset.symbol ? (
                                        <Currency ticker={selectedAsset.symbol} label={selectedAsset.symbol} />
                                    ) : null}
                                    {approvalRequired ? (
                                        <span className="cursor-not-allowed">Max</span>
                                    ) : (
                                        <div
                                            className="m-auto cursor-pointer hover:underline"
                                            onClick={(_e) =>
                                                selectedAssetBalance?.balance
                                                    ? setAmount(selectedAssetBalance.balance)
                                                    : null
                                            }
                                        >
                                            Max
                                        </div>
                                    )}
                                </InnerInputText>
                            </InputContainer>
                            {approvalRequired ? (
                                <p className="text-base mt-3">Token approval required</p>
                            ) : (
                                <p className="text-base mt-3">
                                    Balance: {selectedAssetBalance?.balance?.toFixed()} {selectedAsset?.symbol}
                                </p>
                            )}
                        </div>
                    </div>

                    {approvalRequired ? (
                        <Button variant="primary" size="lg" onClick={approveToken} className="mt-2">
                            Approve
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={bridgeAsset}
                            className="mt-2"
                            disabled={amount.eq(0)}
                        >
                            Bridge
                            {isBridging ? <LoadingOutlined className="ml-2" aria-hidden="true" /> : null}
                        </Button>
                    )}
                    <a
                        href="https://bridge.arbitrum.io"
                        target="_blank"
                        className="text-center w-full mt-4"
                        rel="noreferrer"
                    >
                        Visit the Official Arbitrum Bridge to see pending transactions
                    </a>
                </div>
            </div>
        </TWModal>
    );
};
