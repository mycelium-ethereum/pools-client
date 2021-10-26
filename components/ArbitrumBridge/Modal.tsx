import React from 'react';
import { TWModal } from '@components/General/TWModal';
import { toApproxCurrency } from '@libs/utils/converters';
import { useReducer } from 'react';
import { bridgeReducer, DefaultBridgeState, BridgeStepEnum } from './state';

interface ArbitrumBridgeModalProps {
    isOpen: boolean;
    USDCBalance: number;
    ETHBalance: number;
    onClose: () => void;
    onBridgeUSDC: (amount: number) => Promise<boolean>;
    onApproveUSDC: () => Promise<boolean>;
    onBridgeETH: (amount: number) => Promise<boolean>;
}

export const ArbitrumBridgeModal: React.FC<ArbitrumBridgeModalProps> = (props) => {
    const [state, dispatch] = useReducer(bridgeReducer, DefaultBridgeState);

    function isConnectBtnEnabled() {
        if (state.isBridging) {
            return false;
        }
        if (state.step === BridgeStepEnum.Collateral) {
            return state.USDCAmount && state.USDCAmount > 0 && state.USDCAmount <= props.USDCBalance;
        } else if (state.step === BridgeStepEnum.Gas) {
            return state.ETHAmount && state.ETHAmount > 0 && state.ETHAmount <= props.ETHBalance;
        }
    }

    function handleClickConnect() {
        if (state.isBridging) {
            return;
        }
        if (state.step === BridgeStepEnum.Collateral) {
            handleBridgeUSDC();
        } else if (state.step === BridgeStepEnum.Gas) {
            handleBridgeETH();
        }
    }

    async function handleBridgeUSDC() {
        if (!state.USDCAmount) {
            return;
        }
        dispatch({ type: 'setBridging', status: true });
        try {
            const success = await props.onBridgeUSDC(state.USDCAmount);
            if (!success) {
                throw Error('Bridge failed');
            }
            dispatch({ type: 'setStep', step: BridgeStepEnum.Gas });
        } catch (err) {
            // Display error here message if necessary
        } finally {
            dispatch({ type: 'setBridging', status: false });
        }
    }

    async function handleApproveUSDC() {
        dispatch({ type: 'setApproving', status: true });
        try {
            const success = await props.onApproveUSDC();
            if (!success) {
                throw Error('Approve failed');
            }
            dispatch({ type: 'setStep', step: BridgeStepEnum.Gas });
        } catch (err) {
            // Display error here message if necessary
        } finally {
            dispatch({ type: 'setApproving', status: false });
        }
    }

    async function handleBridgeETH() {
        if (!state.ETHAmount) {
            return;
        }
        dispatch({ type: 'setBridging', status: true });
        try {
            const success = await props.onBridgeETH(state.ETHAmount);
            if (!success) {
                throw Error('Bridge failed');
            }
            props.onClose();
            // Wait 1 second for animation to complete
            setTimeout(() => dispatch({ type: 'reset' }), 1000);
        } catch (err) {
            // Display error here message if necessary
        } finally {
            dispatch({ type: 'setBridging', status: false });
        }
    }

    let collateralErrorMsg: string | null = null;
    if (state.USDCAmount && state.USDCAmount < 0) {
        collateralErrorMsg = 'Invalid amount';
    }
    if (state.USDCAmount && state.USDCAmount > props.USDCBalance) {
        collateralErrorMsg = 'Insufficient funds';
    }

    let gasErrorMsg: string | null = null;
    if (state.ETHAmount && state.ETHAmount < 0) {
        gasErrorMsg = 'Invalid amount';
    }
    if (state.ETHAmount && state.ETHAmount > props.ETHBalance) {
        gasErrorMsg = 'Insufficient funds';
    }

    return (
        <TWModal open={props.isOpen} onClose={() => props.onClose()}>
            <div className="bg-white p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Bridge Funds to Arbitrum</h2>
                    <div className="text-xl cursor-pointer" onClick={() => props.onClose()}>
                        &times;
                    </div>
                </div>
                <div className="my-2">
                    <p className="text-sm text-gray-500">
                        Tracer runs on Arbitrum mainnet. Bridge funds to Arbitrum Mainnet to get started.
                    </p>
                </div>

                <div className="overflow-hidden w-full">
                    <div
                        className={`transition duration-200 transform flex ${
                            state.step === BridgeStepEnum.Collateral ? 'translate-x-0' : '-translate-x-1/2'
                        }`}
                        style={{ width: '200%' }}
                    >
                        <div className="my-6 w-1/2">
                            <label htmlFor="price" className="block text-base font-medium text-gray-700 pb-1">
                                Collateral
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm bg-gray-100">
                                <input
                                    type="number"
                                    name="collateral"
                                    id="collateral"
                                    className={`block w-full p-4 sm:text-sm rounded-md border-2 ${
                                        collateralErrorMsg ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="$4,000"
                                    max={props.USDCBalance}
                                    min={0}
                                    value={typeof state.USDCAmount === 'number' ? state.USDCAmount : ''}
                                    onChange={(ev) =>
                                        dispatch({
                                            type: 'setUSDC',
                                            amount: ev.target.value === '' ? undefined : Number(ev.target.value),
                                        })
                                    }
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <button
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => dispatch({ type: 'setUSDC', amount: props.USDCBalance })}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <p className="text-base text-gray-500 my-3">
                                Balance: {toApproxCurrency(props.USDCBalance)}
                            </p>
                            <p className="text-red-500 text-center">{collateralErrorMsg}</p>
                        </div>

                        <div className="my-6 w-1/2">
                            <label htmlFor="price" className="block text-base font-medium text-gray-700 pb-1">
                                Gas
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm bg-gray-100">
                                <input
                                    type="number"
                                    name="gas"
                                    id="gas"
                                    className={`block w-full p-4 sm:text-sm rounded-md border-2 ${
                                        gasErrorMsg ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder={props.ETHBalance + ' ETH'}
                                    value={typeof state.ETHAmount === 'number' ? state.ETHAmount : ''}
                                    onChange={(ev) =>
                                        dispatch({
                                            type: 'setETH',
                                            amount: ev.target.value === '' ? undefined : Number(ev.target.value),
                                        })
                                    }
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <button
                                        className="cursor-pointer text-blue-600"
                                        onClick={() => dispatch({ type: 'setETH', amount: props.ETHBalance })}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                            <p className="text-base text-gray-500 mt-3">Balance: {props.ETHBalance} ETH</p>
                            <p className="text-red-500 text-center">{gasErrorMsg}</p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-center">
                    <div
                        className={`rounded-full bg-blue-800 w-3 h-3 m-2 ${
                            state.step === BridgeStepEnum.Collateral ? 'ring' : ''
                        }`}
                    />
                    <div
                        className={`rounded-full bg-blue-800 w-3 h-3 m-2 ${
                            state.step === BridgeStepEnum.Gas ? 'ring' : ''
                        }`}
                    />
                </div>

                <div className="my-4">
                    <button
                        type="button"
                        onClick={() => handleClickConnect()}
                        disabled={!isConnectBtnEnabled()}
                        className="w-full inline-flex justify-center rounded-md bg-blue-800 active:bg-blue-600 border shadow-sm px-4 py-2 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        Ok, {`let's`} connect
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApproveUSDC()}
                        disabled={false}
                        className="w-full inline-flex justify-center rounded-md bg-blue-800 active:bg-blue-600 border shadow-sm px-4 py-2 text-base font-medium text-white disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        Approve USDC
                    </button>
                </div>

                <div className="p-2 flex justify-center">
                    {(() => {
                        if (state.step === BridgeStepEnum.Collateral) {
                            if (state.isBridging) {
                                return (
                                    <p className="text-gray-400 text-sm text-center">
                                        Currently bridging USDC. If you are experiencing technical problems, please{' '}
                                        <a className="text-blue-300 underline" href="#">
                                            contact us
                                        </a>
                                        .
                                    </p>
                                );
                            } else {
                                return (
                                    <button
                                        className="text-blue-300 underline"
                                        onClick={() => dispatch({ type: 'setStep', step: BridgeStepEnum.Gas })}
                                    >
                                        Skip, I already have USDC on Arbitrum
                                    </button>
                                );
                            }
                        } else if (state.step === BridgeStepEnum.Gas) {
                            if (state.isBridging) {
                                return (
                                    <p className="text-gray-400 text-sm text-center">
                                        Currently bridging ETH. If you are experiencing technical problems, please{' '}
                                        <a className="text-blue-300 underline" href="#">
                                            contact us
                                        </a>
                                        .
                                    </p>
                                );
                            } else {
                                return (
                                    <button className="text-blue-300 underline" onClick={() => props.onClose()}>
                                        Skip, I already have ETH on Arbitrum
                                    </button>
                                );
                            }
                        }
                    })()}
                </div>
            </div>
        </TWModal>
    );
};
