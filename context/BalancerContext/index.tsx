import React, { useContext, useMemo, useReducer, useEffect, useState } from 'react';
import { Children, StaticPoolInfo } from 'libs/types/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { initialDexState, reducer, TransactionState } from './dexDispatch';
import { ARBITRUM, MAX_SOL_UINT, SideEnum } from '@libs/constants';
import { tokenMap } from '@libs/constants/tokenList';
import { ethers } from 'ethers';
import { swapDefaults, useSwapContext } from '@context/SwapContext';
import { poolMap } from '@libs/constants/poolLists';
import { ERC20__factory, ERC20 } from '@libs/staking/typechain';
import { useTransactionContext } from '@context/TransactionContext';
import { SOR } from '@balancer-labs/sor';
// import { AvailableNetwork } from '@context/Web3Context/Web3Context.Config';


// const config: Record<AvailableNetwork, {
//     proxyAddress: string,
// }> = {
//     [ARBITRUM]: {
//         proxyAddress: ''
//     }
// }


interface ContextProps {
    txnState: TransactionState,
    usdcApproved: boolean
}

interface ActionContextProps {
    makeTrade: () => void;
    // commit: (pool: string, commitType: CommitEnum, amount: BigNumber, options?: Options) => Promise<void>;
    approve: () => void;
}

export const DexContext = React.createContext<ContextProps>(initialDexState);
export const DexActionsContext = React.createContext<Partial<ActionContextProps>>({});

const BASE_1INCH_API = 'https://api.1inch.exchange/v3.0';
const V3_1INCH_AGGREGATOR = '0x11111112542d85b3ef69ae05771c2dccff4faa26';
const ARBITRUM_USDC = tokenMap[ARBITRUM].USDC;

const POOLS_URL = `/static/pools.json`;
// 'http://localhost:3002/static/pools.json'

/**
 * Wrapper store for all pools information
 */
export const DexStore: React.FC<Children> = ({ children }: Children) => {
    const { network, signer, provider, account } = useWeb3();
    const [contract, setContract] = useState<ERC20 | undefined>();
    const [_sor, setSor] = useState<SOR | undefined>();
    const { swapState: {
        selectedPool,
        side,
        amount,
    } = swapDefaults } = useSwapContext();

    useEffect(() => {
        if (provider) {
            console.log("here")
            switch (network) {
                case ARBITRUM:
                    console.log("not here")
                    const sor = new SOR(provider, parseInt(ARBITRUM), POOLS_URL);
                    console.log(sor.provider.getNetwork())
                    sor.fetchPools().then((res) => {
                        console.log("fetched pools", res);
                    }).catch((err) => {
                        console.log('Failed to fetch pools', err)
                    })
                    break
                default:
                    console.log("Lots here")
                    setSor(undefined)
            }
        }
    }, [network, provider])

    const pool: StaticPoolInfo | undefined = poolMap[ARBITRUM][selectedPool ?? 0] // 0 pool does not exist

    const token = useMemo(() => side === SideEnum.long ? pool?.longToken : pool?.shortToken, [pool, side])

    const { handleTransaction } = useTransactionContext();
    const [dexState, dexDispatch] = useReducer(reducer, initialDexState);

    useEffect(() => {
        if (provider) {
            if (contract) {
                // connect old contract
                setContract(contract.connect(provider))
            } else {
                // set new contract
                setContract(ERC20__factory.connect(ARBITRUM_USDC.address, provider));
            }
        }
    }, [provider])

    useEffect(() => {
        if (account) {
            dexDispatch({ type: 'setCheckingAllowance', checking: true })
            checkAllowance().finally(() => {
                dexDispatch({ type: 'setCheckingAllowance', checking: false })
            })
        }
    }, [account, contract])

    const fetchTrade: () => Promise<ethers.providers.TransactionResponse> = async () => {
        const trade = await fetch(
            `${BASE_1INCH_API}/${network}/swap?` + 
            `fromTokenAddress=${ARBITRUM_USDC.address}&` +
            `toTokenAddress=${token?.address}&` +
            `amount=${ethers.utils.parseUnits(amount.toString(), ARBITRUM_USDC.decimals)}&` +
            // `fromAddress=${account}&` +
            `fromAddress=${'0x2252A85e520fE2f29E0be62104D8551B32649C66'}&` +
            `slippage=1`, {
                headers: {
                    'accept': 'application/json'
                }
            }
        ).then((res) => res.json())
        .catch((err) => {
            console.log(`Failed to fetch trade ${err}`)
            throw Error('Failed to fetch trade' + err?.message)
        })
        console.log(trade.tx.value.slice(), "initial value")

        delete trade.tx.gasPrice;
        delete trade.tx.gas;                             //ethersjs will find the gasLimit for users
        //we also need value in the form of hex
        let val: string = '0x' + parseInt(trade.tx["value"]).toString(16);			//get the value from the transaction
        //add a leading 0x after converting from decimal to hexadecimal
        trade.tx["value"] = val;	
        console.log(trade)
        return (signer as ethers.Signer).sendTransaction(trade.tx)
    }

    const makeTrade = async () => {
        dexDispatch({ type: 'setState', state: TransactionState.fetchingTrade })
        if (handleTransaction) {
            handleTransaction(fetchTrade, [], {
                statusMessages: {
                    waiting: {
                        title: `${side === SideEnum.long ? 'Buying' : 'Selling'} ${token?.name} `,
                        body: '',
                    },
                    success: {
                        title: `${token?.name} ${side === SideEnum.long ? 'bought' : 'sold'}`,
                        body: '',
                    },
                    error: {
                        title: `${token?.name} ${side === SideEnum.long ? 'buy' : 'sell'} failed`,
                        body: '',
                    },
                },
                onSuccess: () => {
                    dexDispatch({ type: 'setState', state: TransactionState.fetchedTrade})
                },
                onError: () => {
                    dexDispatch({ type: 'setState', state: TransactionState.fetchedTrade})
                }
            })
        }
        
    }

    const checkAllowance = async () => {
        if (!contract) {
            console.error('Faled to check allowance: contract undefined')
            return
        } 
        if (!account) {
            console.error('Failed to check allowance: account undefined')
            return
        }
        // can use sdk here Token.Create
        const allowance = await contract.allowance(account as string, V3_1INCH_AGGREGATOR).catch((err) => {
            console.error("Failed to fetch allowance", err)
            return ethers.BigNumber.from(0);
        })
        console.log("Allowance", allowance.toNumber())
        dexDispatch({ type: 'setApproved', approved: allowance.gt(0) })
    }

    const approve = async () => {
        if (signer && contract && handleTransaction) {
            handleTransaction(contract.connect(signer).approve, [account, MAX_SOL_UINT.toString()], {
                statusMessages: {
                    waiting: {
                        title: `Unlocking USDC`,
                        body: 'Unlocking USDC to spend on 1Inch',
                    },
                    success: {
                        title: `USDC Unlocked`,
                        body: '',
                    },
                    error: {
                        title: `Unlock USDC failed`,
                        body: '',
                    },
                },
                onSuccess: () => {

                },
            });
        }
    }

    return (
        <DexContext.Provider
            value={{
                usdcApproved: dexState.usdcApproved,
                txnState: dexState.txnState
            }}
        >
            <DexActionsContext.Provider
                value={{
                    approve,
                    makeTrade
                }}
            >
                {children}
            </DexActionsContext.Provider>
        </DexContext.Provider>
    );
};

export const useDex: () => Partial<ContextProps> = () => {
    const context = useContext(DexContext);
    if (context === undefined) {
        throw new Error(`useDex must be called within DexContext`);
    }
    return context;
};

export const useDexActions: () => Partial<ActionContextProps> = () => {
    const context = useContext(DexActionsContext);
    if (context === undefined) {
        throw new Error(`useDexActions must be called within DexActionsContext`);
    }
    return context;
};