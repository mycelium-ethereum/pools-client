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
import Button from '@components/General/Button';
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
    onBridgeAsset: (asset: BridgeableAsset, amount: BigNumber) => Promise<void>;
    onApproveToken: () => Promise<boolean>;
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
    } = props;

    // const [state, dispatch] = useReducer(bridgeReducer, DefaultBridgeState);
    const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);

    console.log('BRIDGEABLE ASSET LIST', bridgeableAssetList);

    const [selectedAsset, setSelectedAsset] = useState(bridgeableAssetList[selectedAssetIndex]);
    const [amount, setAmount] = useState('0');

    // useEffect(() => {
    //     if(show) {
    //         refreshBridgeableBalance(selectedAsset)
    //     }
    // }, [show])

    useEffect(() => {
        setSelectedAsset(bridgeableAssetList[selectedAssetIndex]);
    }, [selectedAssetIndex]);

    useEffect(() => {
        console.log('SELECTED ASSET CHANGED', selectedAsset);
        if (selectedAsset) {
            refreshBridgeableBalance(selectedAsset);
        }
    }, [selectedAsset]);

    const bridgeAsset = () => {
        if (!selectedAsset || !amount) {
            return;
        }
        onBridgeAsset(selectedAsset, new BigNumber(amount));
    };

    const selectedAssetBalance = useMemo(() => {
        const assetBalance = bridgeableBalances[fromNetwork?.id]?.[selectedAsset?.ticker];
        console.log('BALANCE', assetBalance?.balance?.toFixed());
        return assetBalance?.balance || null;
    }, [selectedAsset, fromNetwork, bridgeableBalances]);

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
                                        <Option key={asset.ticker}>{asset.ticker}</Option>
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
                            <div className="flex-grow mt-1 relative rounded-md shadow-sm bg-gray-100">
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    className="block w-full p-4 sm:text-sm rounded-md border-2 border-gray-300 flex-grow"
                                    value={amount}
                                    onChange={(ev) => setAmount(ev.target.value)}
                                />
                            </div>
                            <p className="text-base text-gray-500 mt-3">
                                Balance: {selectedAssetBalance?.toFixed()} {selectedAsset?.ticker}
                            </p>
                        </div>
                    </div>

                    <Button className="primary mb-0">Approve</Button>
                    <Button className="primary" onClick={bridgeAsset}>
                        Bridge
                    </Button>
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
