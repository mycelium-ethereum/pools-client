import React, { useState, useMemo, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Network } from '@context/Web3Context/Web3Context.Config';
import { ArrowRightOutlined, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Input } from '@components/General/Input/Numeric';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Currency } from '@components/General/Currency';
import Button from '@components/General/Button';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { BridgeableAsset, BridgeableBalances } from '@libs/types/General';
import { BridgeableAssets, bridgeableAssetWarnings } from '@libs/utils/bridge';
import { MAINNET } from '@libs/constants';
import { Logo } from '@components/General';

interface MultiBridgeProps {
    fromNetwork: Network;
    toNetwork?: Network;
    bridgeableAssets: BridgeableAssets;
    bridgeableBalances: BridgeableBalances;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    onSwitchNetwork: (networkId: Network['id'], callback?: () => void) => void;
    onBridgeAsset: (asset: BridgeableAsset, amount: BigNumber, callback: () => void) => void;
    onApproveToken: (tokenAddress: string, spender: string) => void;
    account?: string;
}

export const MultiBridge: React.FC<MultiBridgeProps> = (props) => {
    const {
        fromNetwork,
        toNetwork,
        bridgeableAssets,
        bridgeableBalances,
        onSwitchNetwork,
        refreshBridgeableBalance,
        onBridgeAsset,
        onApproveToken,
        account,
    } = props;

    const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
    const [amount, setAmount] = useState('');
    const [amountsByAsset, setAmountsByAsset] = useState<Record<string, string>>({});
    const [amountIsInvalid, setAmountIsInvalid] = useState(false);
    const [warningText, setWarningText] = useState<string | null>(null);
    const [isBridging, setIsBridging] = useState(false);

    // if this is the first time using the bridge, automatically switch them to L1 Mainnet
    useEffect(() => {
        const hasUsedBridge = localStorage.getItem('hasUsedBridge') === 'true';
        if (!hasUsedBridge && fromNetwork.id !== MAINNET) {
            // if its the first time using the bridge and they aren't already on L1 Mainnet
            onSwitchNetwork(MAINNET, () => {
                localStorage.setItem('hasUsedBridge', 'true');
            });
        }
    }, []);

    const bridgeableAssetList = useMemo(() => {
        if (!fromNetwork) {
            return [];
        }

        return bridgeableAssets[fromNetwork.id];
    }, [fromNetwork]);

    const selectedAsset = useMemo(() => {
        if (!bridgeableAssetList) {
            return null;
        }
        return bridgeableAssetList[selectedAssetIndex];
    }, [selectedAssetIndex, bridgeableAssetList]);

    // fetch balance when modal initially shows
    useEffect(() => {
        if (fromNetwork?.id && selectedAsset) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, []);

    // refresh asset balance when selectedAsset changes
    useEffect(() => {
        if (selectedAsset) {
            refreshBridgeableBalance(selectedAsset);
            setAmount(amountsByAsset[selectedAsset.symbol] || '');
        }
    }, [selectedAsset]);

    // when selected asset or amount change, sync amount and amountsByAsset
    useEffect(() => {
        if (selectedAsset) {
            setAmountsByAsset((previousValue) => ({
                ...previousValue,
                [selectedAsset.symbol]: amount,
            }));
        }
    }, [amount, selectedAsset]);

    // refresh asset balance when selected account changes
    useEffect(() => {
        if (selectedAsset && account) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [account]);

    // refresh asset balance when selected network changes
    useEffect(() => {
        if (selectedAsset && fromNetwork) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [fromNetwork]);

    const selectedAssetBalance = useMemo(() => {
        if (!selectedAsset || !account) {
            return null;
        }
        const assetBalance = bridgeableBalances[fromNetwork?.id]?.[account]?.[selectedAsset?.symbol];
        return assetBalance || null;
    }, [selectedAsset, fromNetwork, bridgeableBalances]);

    // validate amount whenever it changes
    useEffect(() => {
        if (!selectedAssetBalance) {
            // nothing to compare it to
            return setAmountIsInvalid(false);
        }

        if (fromNetwork && selectedAsset && bridgeableAssetWarnings[fromNetwork.id]?.[selectedAsset.symbol]) {
            const warningText = bridgeableAssetWarnings[fromNetwork.id][selectedAsset.symbol]?.getWarningText({
                amount: new BigNumber(amount),
            });

            setWarningText(warningText);
        } else {
            // no warning checks for selected asset on current network
            setWarningText(null);
        }
        setAmountIsInvalid(selectedAssetBalance.balance.lt(amount));
    }, [amount, selectedAssetBalance, fromNetwork]);

    const bridgeAsset = () => {
        if (!selectedAsset || !amount) {
            return;
        }

        setIsBridging(true);
        onBridgeAsset(selectedAsset, new BigNumber(amount), () => {
            setIsBridging(false);
            setAmount('');
        });
    };

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
    }, [selectedAsset, selectedAssetBalance?.allowance]);

    return (
        <div className="sm:mt-20">
            <div className="bg-theme-background w-full max-w-screen-sm md:shadow-xl sm:rounded-3xl py-12 px-4 md:py-16 md:px-20 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="font-bold text-2xl">Bridge Funds</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <div className="my-2 mb-2 w-full font-bold">
                            <label htmlFor="from" className="block mb-2">
                                From
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="block w-full p-4 sm:text-sm rounded-md border-2 border-theme-border bg-theme-button-bg text-theme-text">
                                    <Logo className="inline mr-2 my-0" ticker={fromNetwork?.logoTicker ?? 'DEFAULT'} />
                                    {fromNetwork?.name || 'Unsupported Network'}
                                </div>
                            </div>
                        </div>

                        <button
                            className="cursor-pointer mx-6 mb-6 mt-auto text-xl focus:outline-none"
                            onClick={() => {
                                if (toNetwork) {
                                    onSwitchNetwork(toNetwork.id);
                                }
                            }}
                        >
                            <ArrowRightOutlined />
                        </button>

                        <div className="my-2 mb-2 w-full font-bold">
                            <label htmlFor="to" className="block mb-2">
                                To
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="block w-full p-4 sm:text-sm rounded-md border-2 border-theme-border bg-theme-button-bg text-theme-text">
                                    <Logo className="inline mr-2 my-0" ticker={toNetwork?.logoTicker ?? 'DEFAULT'} />
                                    {toNetwork?.name || 'Unsupported Network'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-2 mb-2 flex-grow">
                            <label htmlFor="asset" className="block mb-2">
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
                        <div className="my-2 mb-2 flex-grow">
                            <label htmlFor="amount" className="block mb-2">
                                Amount
                            </label>
                            <InputContainer className="w-full" error={amountIsInvalid} warning={Boolean(warningText)}>
                                <Input
                                    className="w-full h-full font-normal text-base"
                                    value={amount}
                                    onUserInput={(val) => setAmount(val)}
                                    disabled={approvalRequired}
                                />
                                <InnerInputText>
                                    {!approvalRequired && warningText ? (
                                        <ExclamationCircleFilled className="flex items-center h-auto mr-2 rounded-xl text-yellow-600" />
                                    ) : null}
                                    {selectedAsset?.symbol ? (
                                        <Currency ticker={selectedAsset.symbol} label={selectedAsset.symbol} />
                                    ) : null}
                                    {approvalRequired ? (
                                        <span className="cursor-not-allowed">Max</span>
                                    ) : (
                                        <div
                                            className="m-auto cursor-pointer hover:underline"
                                            onClick={(_e) =>
                                                selectedAssetBalance?.balance
                                                    ? setAmount(selectedAssetBalance.balance.toFixed())
                                                    : null
                                            }
                                        >
                                            Max
                                        </div>
                                    )}
                                </InnerInputText>
                            </InputContainer>
                            {!approvalRequired && warningText ? (
                                <div className="mt-2 text-sm text-yellow-600">{warningText}</div>
                            ) : null}
                            {approvalRequired ? (
                                <div className="mt-2 text-sm">Token approval required</div>
                            ) : (
                                <div
                                    className={`mt-2 text-sm ${
                                        amountIsInvalid ? 'text-red-500 focus-within:ring-red-500' : ''
                                    }`}
                                >
                                    {selectedAssetBalance?.balance
                                        ? `Balance: ${selectedAssetBalance.balance.toFixed(
                                              selectedAsset?.displayDecimals || 6,
                                          )}`
                                        : ''}
                                    {selectedAssetBalance?.balance && Number(amount) > 0
                                        ? ` >>> ${selectedAssetBalance.balance
                                              .minus(amount)
                                              .toFixed(selectedAsset?.displayDecimals || 6)}`
                                        : ''}
                                </div>
                            )}
                        </div>
                    </div>

                    {approvalRequired ? (
                        <Button variant="primary" size="lg" onClick={approveToken} className="mt-2">
                            Unlock {selectedAsset?.symbol}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={bridgeAsset}
                            className="mt-2"
                            disabled={!(Number(amount) > 0) || amountIsInvalid}
                        >
                            Bridge {toNetwork ? `to ${toNetwork.name}` : 'Funds'}
                            {isBridging ? <LoadingOutlined className="ml-2" aria-hidden="true" /> : null}
                        </Button>
                    )}

                    <p className="text-center w-full mt-4 text-sm">
                        {approvalRequired ? (
                            <span>
                                Unlock {selectedAsset?.symbol} to bridge funds. This is a one-time transaction per
                                network for each unique asset.
                            </span>
                        ) : (
                            <>
                                <b>Note</b>: Withdrawals from Arbitrum take approximately 8 days to complete. Visit the{' '}
                                <a
                                    href="https://bridge.arbitrum.io"
                                    target="_blank"
                                    className="underline"
                                    rel="noreferrer"
                                >
                                    Official Arbitrum Bridge
                                </a>{' '}
                                to see pending deposits/withdrawals.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
