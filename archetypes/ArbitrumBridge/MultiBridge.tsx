import React, { useState, useMemo, useEffect } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ArrowRightOutlined, LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { Logo } from '~/components/General';
import Button from '~/components/General/Button';
import { Currency } from '~/components/General/Currency';
import { InnerInputText, InputContainer } from '~/components/General/Input';
import { Input } from '~/components/General/Input/Numeric';

import Max from '~/components/General/Max';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { StyledTooltip } from '~/components/Tooltips';
import { bridgeableAssetWarnings } from '~/constants/bridge';
import Error from '~/public/img/notifications/error.svg';
import { BridgeableAsset, BridgeableBalances, BridgeableAssets } from '~/types/bridge';
import { Network } from '~/types/networks';

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
    provider?: ethers.providers.JsonRpcProvider;
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
        provider,
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
        if (!hasUsedBridge && fromNetwork.id !== NETWORKS.MAINNET) {
            // if its the first time using the bridge and they aren't already on L1 Mainnet
            onSwitchNetwork(NETWORKS.MAINNET, () => {
                localStorage.setItem('hasUsedBridge', 'true');
            });
        }
    }, []);

    const bridgeableAssetList = useMemo(() => {
        if (!fromNetwork) {
            return bridgeableAssets.DEFAULT;
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
        console.debug('Checking if ready to refresh balance', provider);
        if (selectedAsset && account && !!provider) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [account, provider]);

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

    const displayButton: () => React.ReactNode = () => {
        if (!fromNetwork?.logoTicker) {
            // unsupported network
            return (
                <StyledTooltip title="Connect to Arbitrum or Ethereum to bridge funds.">
                    <div className="mt-2">
                        <Button variant="primary" size="lg" disabled={true}>
                            Unsupported Network
                        </Button>
                    </div>
                </StyledTooltip>
            );
        } else if (approvalRequired) {
            return (
                <Button variant="primary" size="lg" onClick={approveToken} className="mt-2">
                    Unlock {selectedAsset?.symbol}
                </Button>
            );
        } else {
            return (
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
            );
        }
    };

    return (
        <div className="sm:mt-20">
            <div className="mx-auto w-full max-w-screen-sm bg-theme-background py-12 px-4 sm:rounded-3xl md:py-16 md:px-20 md:shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="text-2xl font-bold">Bridge Funds</div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <div className="my-2 mb-2 w-full font-bold">
                            <label htmlFor="from" className="mb-2 block">
                                From
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="block w-full rounded-md border-2 border-theme-border bg-theme-button-bg p-4 text-theme-text sm:text-sm">
                                    {fromNetwork?.logoTicker ? (
                                        <Logo
                                            className="my-0 mr-2 inline"
                                            ticker={fromNetwork?.logoTicker ?? 'DEFAULT'}
                                        />
                                    ) : (
                                        <Error className="mr-1 inline h-5" />
                                    )}
                                    {fromNetwork?.name || 'Unsupported Network'}
                                </div>
                            </div>
                        </div>

                        <button
                            className="focus:outline-none mx-6 mb-6 mt-auto cursor-pointer text-xl"
                            onClick={() => {
                                if (toNetwork) {
                                    onSwitchNetwork(toNetwork.id);
                                }
                            }}
                        >
                            <ArrowRightOutlined />
                        </button>

                        <div className="my-2 mb-2 w-full font-bold">
                            <label htmlFor="to" className="mb-2 block">
                                To
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="block w-full rounded-md border-2 border-theme-border bg-theme-button-bg p-4 text-theme-text sm:text-sm">
                                    {toNetwork?.logoTicker ? (
                                        <Logo
                                            className="my-0 mr-2 inline"
                                            ticker={toNetwork?.logoTicker ?? 'DEFAULT'}
                                        />
                                    ) : (
                                        <Error className="mr-1 inline h-5" />
                                    )}
                                    {toNetwork?.name || 'Unsupported Network'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-2 mb-2 flex-grow">
                            <label htmlFor="asset" className="mb-2 block font-bold">
                                Asset
                            </label>
                            <TWButtonGroup
                                value={selectedAssetIndex}
                                size="xl"
                                color="tracer"
                                fullWidth={true}
                                onClick={(val) => {
                                    setSelectedAssetIndex(val);
                                }}
                                options={buttonGroupOptions}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-2 mb-2 flex-grow">
                            <label htmlFor="amount" className="mb-2 block font-bold">
                                Amount
                            </label>
                            <InputContainer
                                className="w-full"
                                variation={amountIsInvalid ? 'error' : !!warningText ? 'warning' : undefined}
                            >
                                <Input
                                    className="h-full w-full text-base font-normal"
                                    value={amount}
                                    onUserInput={(val) => setAmount(val)}
                                    disabled={approvalRequired}
                                />
                                <InnerInputText>
                                    {!approvalRequired && warningText ? (
                                        <ExclamationCircleFilled className="mr-2 flex h-auto items-center rounded-xl text-yellow-600" />
                                    ) : null}
                                    {selectedAsset?.symbol ? (
                                        <Currency ticker={selectedAsset.symbol} label={selectedAsset.symbol} />
                                    ) : null}
                                    {approvalRequired ? (
                                        <span className="cursor-not-allowed">Max</span>
                                    ) : (
                                        <Max
                                            className="m-auto"
                                            onClick={(_e) =>
                                                selectedAssetBalance?.balance
                                                    ? setAmount(selectedAssetBalance.balance.toFixed())
                                                    : null
                                            }
                                        >
                                            Max
                                        </Max>
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

                    {displayButton()}

                    <p className="mt-4 w-full text-center text-sm">
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
