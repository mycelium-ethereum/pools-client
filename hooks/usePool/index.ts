import { Dispatch, useEffect, useReducer, useState, useContext } from 'react';
import { ethers } from 'ethers';
import tokenJSON from 'abis/PoolToken.json';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { PoolType } from '@libs/types/General';
import { PoolState, PoolAction, reducer, initialPoolState } from './poolDispatch';
import { TokenState, TokenAction, tokenReducer, initialTokenState } from './tokenDispatch';
import { calcLossMultiplier, calcRatio } from '@libs/utils/calcs';
import { LONG_BURN, LONG_MINT, SHORT_BURN, SHORT_MINT } from './constants';
import { TransactionContext } from '@context/TransactionContext';
import { BigNumber } from 'bignumber.js';
import { LeveragedPool, PoolToken, TestToken, TestToken__factory, LeveragedPool__factory } from '@libs/types/contracts';

export interface Pool {
    poolState: PoolState;
    poolDispatch: Dispatch<PoolAction>;
    tokenState: TokenState;
    tokenDispatch: Dispatch<TokenAction>;
    mint: (amount: number, isShort: boolean) => void;
    burn: (amount: number, isShort: boolean) => void;
}

export const usePool: (pool: PoolType) => Pool = (pool) => {
    const { provider, account } = useWeb3();
    const { handleTransaction } = useContext(TransactionContext);
    const [contract, setContract] = useState<LeveragedPool | undefined>();
    const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
    const [quoteToken, setQuoteToken] = useState<TestToken>();
    const [poolState, poolDispatch] = useReducer(reducer, initialPoolState);
    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState);

    /**
     * First effect which sets the pool contract when either the pool address or provider changes
     * TODO check if the provider changes when changing networks
     */
    useEffect(() => {
        if (pool.address && provider) {
            const contract_ = new ethers.Contract(
                pool.address,
                LeveragedPool__factory.abi,
                provider?.getSigner() ?? provider,
            ) as LeveragedPool;
            poolDispatch({ type: 'setToken', token: pool.name });
            setContract(contract_);
        }
    }, [provider, pool]);

    // Subscribes and fetches all relevant pool info
    useEffect(() => {
        if (contract) {
            fetchInitialValues();
            fetchLastPriceUpdate();
            fetchMarketChange();
            fetchPoolTokens();
            fetchOraclePrice();
            subscribePool();
        }
    }, [contract]);

    // Subscribes and fetches all relevent quoteToken info
    useEffect(() => {
        fetchQuoteTokenBalance();
        subscribeQuoteToken();
    }, [quoteToken]);

    // Subscribes and fetches all relevent pool token info
    useEffect(() => {
        fetchPoolTokenBalances();
        subscribePoolTokens();
    }, [poolTokens]);

    // connects the contracts to the new signer whenever the account changes
    useEffect(() => {
        if (provider) {
            const setSigner = async () => {
                const signer = await provider?.getSigner();
                if (contract) {
                    setContract(contract.connect(signer ?? provider));
                }
                if (poolTokens.length) {
                    setPoolTokens(poolTokens.map((token) => token.connect(signer ?? provider)));
                }
                if (quoteToken) {
                    setQuoteToken(quoteToken.connect(signer ?? provider));
                }
            };
            setSigner();
        }
    }, [account, provider]);

    // Calulates the rebalanceMultiplier when the lastPrice or oraclePrice changes
    useEffect(() => {
        if (!poolState.oraclePrice.eq(0) && !poolState.lastPrice.eq(0)) {
            const priceRatio = calcRatio(poolState.oraclePrice, poolState.lastPrice)
            const rebalanceMultiplier = calcLossMultiplier(priceRatio, poolState.leverage)
            poolDispatch({ type: 'setRebalanceMultiplier', rebalanceMultiplier: rebalanceMultiplier })
        }
    }, [poolState.lastPrice, poolState.oraclePrice])

    /**
     * Mints an amount of pool tokens. This can be long or short pool tokens
     * @param amount to commit
     * @param isShort boolean correseponding to users preference of minting long or short tokens
     */
    const mint = (amount: number, isShort: boolean) => {
        if (contract && handleTransaction) {
            const commitType = isShort ? SHORT_MINT : LONG_MINT;
            handleTransaction(contract.commit, [commitType, amount]);
        }
    };

    /**
     * Burns an amount of pool tokens. This can be long or short pool tokens
     * @param amount to commit
     * @param isShort boolean correseponding to users preference of minting long or short tokens
     */
    const burn = (amount: number, isShort: boolean) => {
        if (contract && handleTransaction) {
            const commitType = isShort ? SHORT_BURN : LONG_BURN;
            handleTransaction(contract.commit, [commitType, amount]);
        }
    };

    // subscribe to the appropriate pool events
    const subscribePool = () => {
        if (contract) {
            contract.on('PriceChange', (startPrice, endPrice, transferAmount) => {
                // TODO handle priceChange
                const oldPrice = new BigNumber(ethers.utils.formatEther(startPrice));
                const newPrice = new BigNumber(ethers.utils.formatEther(endPrice));
                console.debug(
                    `Pool price changed, old: $${oldPrice.toNumber()}, new: $${newPrice.toNumber()}, transferred: ${transferAmount}`,
                );
                // TODO this might need to calc 24 hour change
                poolDispatch({ type: 'setLastPrice', lastPrice: newPrice });
                fetchLastPriceUpdate();
                fetchOraclePrice();
            });
            contract.on('ExecuteCommit', () => {
                console.debug();
            });
        }
    };

    // subscribe to the appropriate token events
    const subscribeQuoteToken = () => {
        if (quoteToken) {
            quoteToken.on('Transfer', () => {
                // fetchQuoteTokenBalance();
            });
        }
    };

    // subsribe to appropriate pool token events
    const subscribePoolTokens = () => {
        if (poolTokens.length === 2) {
            poolTokens[0].on('Transfer', () => {
                fetchPoolTokenBalances();
            });
            poolTokens[1].on('Transfer', () => {
                fetchPoolTokenBalances();
            });
        }
    };

    // Fetch the intitial pool values
    const fetchInitialValues = async () => {
        if (contract) {
            const updateInterval = await contract.updateInterval();
            const lastUpdate = await contract.lastPriceTimestamp();
            const nextUpdate = updateInterval + lastUpdate;
            poolDispatch({ type: 'setNextRebalance', nextRebalance: nextUpdate });
            poolDispatch({ type: 'setUpdateInterval', updateInterval: updateInterval });

            const shortBalance = await contract.shortBalance();
            const longBalance = await contract.longBalance();
            poolDispatch({
                type: 'setPoolBalances',
                balances: {
                    shortBalance: new BigNumber(shortBalance.toString()),
                    longBalance: new BigNumber(longBalance.toString()),
                },
            });

            const quoteToken = await contract.quoteToken();
            setQuoteToken(
                new ethers.Contract(quoteToken, TestToken__factory.abi, provider?.getSigner() ?? provider) as TestToken,
            );
        }
    };

    const fetchOraclePrice = async () => {
        if (contract) {
            const oraclePrice = await contract.getOraclePrice();
            poolDispatch({ type: 'setOraclePrice', oraclePrice: new BigNumber(oraclePrice.toNumber()) });
        }
    }

    const fetchLastPriceUpdate = async () => {
        if (contract) {
            const updateInterval = await contract.updateInterval();
            const lastUpdate = await contract.lastPriceTimestamp();
            const nextUpdate = updateInterval + lastUpdate;
            poolDispatch({ type: 'setNextRebalance', nextRebalance: nextUpdate });
            poolDispatch({ type: 'setUpdateInterval', updateInterval: updateInterval });
        }
    };

    // Fetch and calulate the 24 hour market change
    // TODO this could be simplified by just using an indexer like the graph
    const fetchMarketChange = async () => {
        if (contract) {
            const prices = contract.filters.PriceChange();
            const allEvents = await contract.queryFilter(prices);

            // instead we will do 60 seconds for testing
            const yesterday = (Date.now() / 1000) - 120 ;
            let twentyFourHourPrice = new BigNumber(0);
            let latestPrice = new BigNumber(0);

            if (allEvents.length) {
                latestPrice = new BigNumber(ethers.utils.formatEther(allEvents[allEvents.length -1].args.endPrice));
            }
            for (let i = 1; i < allEvents.length; i++) {
                const priceChange = allEvents[i];
                if ((await priceChange.getBlock()).timestamp < yesterday) {
                    twentyFourHourPrice = new BigNumber(priceChange.args.endPrice.toString());
                    break;
                }
            }
            if (!twentyFourHourPrice.eq(0)) {
                const marketChange = latestPrice.minus(twentyFourHourPrice).div(twentyFourHourPrice).times(100);
                poolDispatch({
                    type: 'setMarketChange',
                    marketChange: marketChange.toNumber(),
                });
            }

            poolDispatch({
                type: 'setLastPrice',
                lastPrice: latestPrice,
            });
        }
    };

    // Fetches the pool token contracts and sets the contract and names of each
    const fetchPoolTokens = async () => {
        if (contract) {
            // Index 0 is the LONG token, index 1 is the SHORT token
            const longTokenAddress = await contract.tokens(0);
            const shortTokenAddress = await contract.tokens(1);
            const shortToken = new ethers.Contract(
                shortTokenAddress,
                tokenJSON.abi,
                provider?.getSigner() ?? provider,
            ) as PoolToken;
            const longToken = new ethers.Contract(
                longTokenAddress,
                tokenJSON.abi,
                provider?.getSigner() ?? provider,
            ) as PoolToken;
            const shortTokenName = await shortToken.name();
            const longTokenName = await longToken.name();
            setPoolTokens([longToken, shortToken]);
            tokenDispatch({ type: 'setNames', shortToken: shortTokenName, longToken: longTokenName });
        }
    };

    // Fetches the pool token balances and allowances
    const fetchPoolTokenBalances = () => {
        if (account && poolTokens.length) {
            const longTokenBalance = poolTokens[0].balanceOf(account);
            const shortTokenBalance = poolTokens[1].balanceOf(account);
            const longTokenAllowance = poolTokens[0].allowance(account, contract?.address as string);
            const shortTokenAllowance = poolTokens[1].allowance(account, contract?.address as string);
            Promise.all([longTokenBalance, shortTokenBalance, longTokenAllowance, shortTokenAllowance])
                .then((res) => {
                    const balances = {
                        longToken: new BigNumber(res[0].toString()),
                        shortToken: new BigNumber(res[1].toString()),
                    };
                    const approvedLong = new BigNumber(res[2].toString());
                    const approvedShort = new BigNumber(res[3].toString());
                    const max = new BigNumber(Number.MAX_SAFE_INTEGER.toString());
                    const approvals = {
                        longToken: approvedLong.gte(max),
                        shortToken: approvedShort.gte(max),
                    };
                    console.debug('Fetched balances', balances);
                    console.debug('Fetched allowances', {
                        longToken: res[2],
                        shortToken: res[3],
                    });
                    tokenDispatch({ type: 'setPoolTokenBalances', balances: balances });
                    tokenDispatch({ type: 'setApprovedTokens', approvals: approvals });
                })
                .catch((err) => {
                    console.error('Failed to fetch pool token balances', err);
                    tokenDispatch({
                        type: 'setPoolTokenBalances',
                        balances: {
                            longToken: new BigNumber(0),
                            shortToken: new BigNumber(0),
                        },
                    });
                });
        }
    };

    // fetches the quoteToken balance and allowance
    const fetchQuoteTokenBalance = () => {
        if (quoteToken && account) {
            Promise.all([quoteToken.balanceOf(account), quoteToken.allowance(account, contract?.address as string)])
                .then((res) => {
                    const tokenBalance = new BigNumber(res[0].toString());
                    const approvedAmount = new BigNumber(res[1].toString());
                    console.debug('Fetched quoteToken balance', res[0]);
                    console.debug('Fetched quoteToken allowance', res[1]);
                    const max = new BigNumber(Number.MAX_SAFE_INTEGER.toString());

                    tokenDispatch({ type: 'setQuoteTokenBalance', quoteTokenBalance: tokenBalance });
                    tokenDispatch({ type: 'setApprovedQuoteToken', value: approvedAmount.gte(max) });
                })
                .catch((err) => {
                    console.error('Failed to fetch quote token balance', err);
                    tokenDispatch({ type: 'setQuoteTokenBalance', quoteTokenBalance: new BigNumber(0) });
                });
        }
    };

    return {
        poolState,
        poolDispatch,
        tokenState,
        tokenDispatch,
        mint,
        burn,
    };
};
