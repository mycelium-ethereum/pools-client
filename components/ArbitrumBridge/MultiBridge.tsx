import React, {
    // useReducer,
    useState,
    useMemo,
    useEffect,
} from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { TWModal } from '@components/General/TWModal';
import { Network } from '@context/Web3Context/Web3Context.Config';
import SlideSelect, { Option } from '@components/General/SlideSelect';
import { Input } from '@components/General/Input/Numeric';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Currency } from '@components/General/Currency';
import Button from '@components/General/Button';
import { tokenSymbolToLogoTicker } from '@components/General';
import { BridgeableAsset, BridgeableBalances } from '@libs/types/General';
// import { destinationNetworkLookup, bridgeableTokens, bridgeableTickers } from '@libs/utils';
// import { bridgeReducer, DefaultBridgeState } from './state';
interface MultiBridgeProps {
    show: boolean;
    fromNetwork: Network;
    toNetwork?: Network;
    bridgeableAssetList: BridgeableAsset[];
    bridgeableBalances: BridgeableBalances;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    onSwitchNetwork: (networkId: Network['id']) => void;
    onClose: () => void;
    onBridgeAsset: (asset: BridgeableAsset, amount: BigNumber) => void;
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

    // const [state, dispatch] = useReducer(bridgeReducer, DefaultBridgeState);
    const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);

    const [selectedAsset, setSelectedAsset] = useState(bridgeableAssetList[selectedAssetIndex]);
    const [amount, setAmount] = useState(new BigNumber(0));

    // useEffect(() => {
    //     if(show) {
    //         refreshBridgeableBalance(selectedAsset)
    //     }
    // }, [show])

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

        onBridgeAsset(selectedAsset, amount);
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

    return (
        <TWModal open={show} onClose={() => onClose()}>
            <div className="bg-white p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Bridge Funds</h2>
                    <div className="text-xl cursor-pointer" onClick={() => onClose()}>
                        &times;
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <div className="my-6">
                            <label htmlFor="from" className="block text-base font-medium text-gray-700 pb-1">
                                From
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm bg-gray-100">
                                <input
                                    disabled
                                    type="text"
                                    name="fromNetwork"
                                    id="fromNetwork"
                                    className="block w-full p-4 sm:text-sm rounded-md border-2 border-gray-300"
                                    value={fromNetwork.name}
                                />
                            </div>
                        </div>

                        <button
                            className="cursor-pointer text-blue-600 p-4"
                            onClick={() => {
                                if (toNetwork) {
                                    onSwitchNetwork(toNetwork.id);
                                }
                            }}
                        >
                            {'>'}
                        </button>

                        <div className="my-6">
                            <label htmlFor="to" className="block text-base font-medium text-gray-700 pb-1">
                                To
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm bg-gray-100">
                                <input
                                    disabled
                                    type="text"
                                    name="toNetwork"
                                    id="toNetwork"
                                    className="block w-full p-4 sm:text-sm rounded-md border-2 border-gray-300"
                                    value={toNetwork?.name || 'N/A'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-6 flex-grow">
                            <label htmlFor="asset" className="block text-base font-medium text-gray-700 pb-1">
                                Asset
                            </label>
                            <StyledSlideSelect>
                                <SlideSelect
                                    className="bg-gray-100 rounded-md border-2 border-gray-300 p-4"
                                    value={selectedAssetIndex}
                                    onClick={(index, _e) => {
                                        setSelectedAssetIndex(index);
                                    }}
                                >
                                    {bridgeableAssetList.map((asset) => (
                                        <Option key={asset.symbol}>{asset.symbol}</Option>
                                    ))}
                                </SlideSelect>
                            </StyledSlideSelect>
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="my-6 flex-grow">
                            <label htmlFor="amount" className="block text-base font-medium text-gray-700 pb-1">
                                Amount
                            </label>
                            <InputContainer className="w-full ">
                                <Input
                                    className="w-full h-full font-normal text-base"
                                    value={amount.eq(0) ? '' : amount.toFixed()}
                                    onUserInput={(val) => setAmount(new BigNumber(val || 0))}
                                />
                                <InnerInputText>
                                    {selectedAsset.symbol ? (
                                        <Currency
                                            ticker={tokenSymbolToLogoTicker(selectedAsset.symbol)}
                                            label={selectedAsset.symbol}
                                        />
                                    ) : null}
                                    <div
                                        className="m-auto cursor-pointer hover:underline"
                                        onClick={(_e) => setAmount(selectedAssetBalance.balance)}
                                    >
                                        Max
                                    </div>
                                </InnerInputText>
                            </InputContainer>
                            {selectedAssetBalance?.allowance.eq(0) ? (
                                <p className="text-base text-gray-500 mt-3">Token approval required</p>
                            ) : (
                                <p className="text-base text-gray-500 mt-3">
                                    Balance: {selectedAssetBalance?.balance?.toFixed()} {selectedAsset?.symbol}
                                </p>
                            )}
                        </div>
                    </div>

                    {selectedAssetBalance?.allowance.eq(0) ? (
                        <Button variant="primary" onClick={approveToken}>
                            Approve
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={bridgeAsset}>
                            Bridge
                        </Button>
                    )}
                </div>
            </div>
        </TWModal>
    );
};

const StyledSlideSelect = styled.div`
    & ${SlideSelect} {
        height: auto;
    }
`;
