import React from 'react';
import { useReducer } from 'react';
import { TWModal } from '~/components/General/TWModal';
import { toApproxCurrency } from '~/utils/converters';
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
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium leading-6 text-gray-900">Bridge Funds to Arbitrum</h2>
                    <div className="cursor-pointer text-xl" onClick={() => props.onClose()}>
                        &times;
                    </div>
                </div>
                <div className="my-2">
                    <p className="text-sm text-gray-500">
                        Tracer runs on Arbitrum mainnet. Bridge funds to Arbitrum Mainnet to get started.
                    </p>
                </div>

                <div className="w-full overflow-hidden">
                    <div
                        className={`flex transform transition duration-200 ${
                            state.step === BridgeStepEnum.Collateral ? 'translate-x-0' : '-translate-x-1/2'
                        }`}
                        style={{ width: '200%' }}
                    >
                        <div className="my-6 w-1/2">
                            <label htmlFor="price" className="block pb-1 text-base font-medium text-gray-700">
                                Collateral
                            </label>
                            <div className="relative mt-1 rounded bg-gray-100 shadow-sm">
                                <input
                                    type="number"
                                    name="collateral"
                                    id="collateral"
                                    className={`block w-full rounded border-2 p-4 sm:text-sm ${
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
                            <p className="my-3 text-base text-gray-500">
                                Balance: {toApproxCurrency(props.USDCBalance)}
                            </p>
                            <p className="text-center text-red-500">{collateralErrorMsg}</p>
                        </div>

                        <div className="my-6 w-1/2">
                            <label htmlFor="price" className="block pb-1 text-base font-medium text-gray-700">
                                Gas
                            </label>
                            <div className="relative mt-1 rounded bg-gray-100 shadow-sm">
                                <input
                                    type="number"
                                    name="gas"
                                    id="gas"
                                    className={`block w-full rounded border-2 p-4 sm:text-sm ${
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
                            <p className="mt-3 text-base text-gray-500">Balance: {props.ETHBalance} ETH</p>
                            <p className="text-center text-red-500">{gasErrorMsg}</p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-center">
                    <div
                        className={`m-2 h-3 w-3 rounded-full bg-blue-800 ${
                            state.step === BridgeStepEnum.Collateral ? 'ring' : ''
                        }`}
                    />
                    <div
                        className={`m-2 h-3 w-3 rounded-full bg-blue-800 ${
                            state.step === BridgeStepEnum.Gas ? 'ring' : ''
                        }`}
                    />
                </div>

                <div className="my-4">
                    <button
                        type="button"
                        onClick={() => handleClickConnect()}
                        disabled={!isConnectBtnEnabled()}
                        className="inline-flex w-full justify-center rounded border bg-blue-800 px-4 py-2 text-base font-medium text-white shadow-sm active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        Ok, {`let's`} connect
                    </button>
                    <button
                        type="button"
                        onClick={() => handleApproveUSDC()}
                        disabled={false}
                        className="inline-flex w-full justify-center rounded border bg-blue-800 px-4 py-2 text-base font-medium text-white shadow-sm active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        Approve USDC
                    </button>
                </div>

                <div className="flex justify-center p-2">
                    {(() => {
                        if (state.step === BridgeStepEnum.Collateral) {
                            if (state.isBridging) {
                                return (
                                    <p className="text-center text-sm text-gray-400">
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
                                    <p className="text-center text-sm text-gray-400">
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
