import { Dispatch, useEffect, useReducer, useState, useContext } from 'react';
import { BigNumber, ethers } from 'ethers';
import tokenJSON from 'abis/PoolToken.json';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { PoolType } from '@libs/types/General';
import { PoolState, PoolAction, reducer, initialPoolState } from './poolDispatch';
import { TokenState, TokenAction, tokenReducer, initialTokenState } from './tokenDispatch';
import { calcLossMultiplier, calcRatio } from '@libs/utils/calcs';
import { LONG_BURN, LONG_MINT, SHORT_BURN, SHORT_MINT } from './constants';
import { TransactionContext } from '@context/TransactionContext';
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
    const [ contract, setContract ] = useState<LeveragedPool | undefined>();
    const [ poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
    const [ quoteToken, setQuoteToken] = useState<TestToken>();
    const [poolState, poolDispatch] = useReducer(reducer, initialPoolState);
    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState);

    useEffect(() => {
        if (pool.address && provider) {
            const contract_ = new ethers.Contract(pool.address, LeveragedPool__factory.abi, provider?.getSigner() ?? provider) as LeveragedPool;
            poolDispatch({ type: 'setToken', token: pool.name })
            setContract(contract_)
        }
    }, [provider, pool]);


    useEffect(() => {
        fetchInitialValues();
        fetchMarketChange();
        fetchPoolTokens();
    }, [contract])

    useEffect(() => {
        if (provider) {
            const setSigner = async () => {
                const signer = await provider?.getSigner()
                if (contract) {
                    setContract(contract.connect(signer ?? provider))
                } 
                if (poolTokens.length) {
                    setPoolTokens(poolTokens.map((token) => token.connect(signer ?? provider)))
                }
                if (quoteToken) {
                    setQuoteToken(quoteToken.connect(signer ?? provider))
                }
            }
            setSigner();
        }
    }, [account, provider])

    useEffect(() => {
        fetchPoolTokenBalances();
    }, [poolTokens])

    useEffect(() => {
        fetchQuoteTokenBalance()
    }, [quoteToken])

    useEffect(() => {
        if (!poolState.oraclePrice.eq(0) && !poolState.lastPrice.eq(0)) {
            const priceRatio = calcRatio(poolState.oraclePrice, poolState.lastPrice)
            const rebalanceMultiplier = calcLossMultiplier(priceRatio, poolState.leverage)
            poolDispatch({ type: 'setRebalanceMultiplier', rebalanceMultiplier: rebalanceMultiplier })
        }
    }, [poolState.lastPrice, poolState.oraclePrice])

    /**
     * 
     * @param amount to commit
     * @param short long or short
     */
    const mint = (amount: number, isShort: boolean) => {
        if (contract && handleTransaction) {
            const commitType = isShort ? SHORT_MINT : LONG_MINT
            handleTransaction(
                contract.commit,
                [commitType, amount]
            )
        }
    }
    
    /**
     * 
     * @param amount to commit
     * @param short long or short
     */
    const burn = (amount: number, isShort: boolean) => {
        if (contract && handleTransaction) {
            const commitType = isShort ? SHORT_BURN : LONG_BURN
            handleTransaction(
                contract.commit,
                [commitType, amount]
            )
        }
    }

    const fetchInitialValues = async () => {
        if (contract) {
            const updateInterval = await contract.updateInterval();
            const lastUpdate = await contract.lastPriceTimestamp();
            const nextUpdate = updateInterval + lastUpdate;
            poolDispatch({ type: 'setNextRebalance', nextRebalance: nextUpdate })
            poolDispatch({ type: 'setUpdateInterval', updateInterval: updateInterval })

            const shortBalance = await contract.shortBalance();
            const longBalance = await contract.longBalance();
            poolDispatch({ type: 'setPoolBalances', balances: {
                shortBalance: shortBalance,
                longBalance: longBalance
            }})

            const oraclePrice = await contract.getOraclePrice();
            poolDispatch({ type: 'setOraclePrice', oraclePrice: oraclePrice })

            
            const quoteToken = await contract.quoteToken();
            setQuoteToken(new ethers.Contract(quoteToken, TestToken__factory.abi, provider?.getSigner() ?? provider) as TestToken)
        }
    }

    const fetchMarketChange = async () => {
        if (contract) {
            const prices = contract.filters.PriceChange()
            const allEvents = await contract.queryFilter(prices);
            const yesterday = Date.now() / 1000;
            let twentyFourHourPrice = BigNumber.from(0);
            let latestPrice = BigNumber.from(0);
            console.log(allEvents, "All events")
            if (allEvents[0]) {
                latestPrice = allEvents[0].args.endPrice;
            }
            for (let i = 1; i < allEvents.length; i++) {
                const priceChange = allEvents[i];
                if ((await priceChange.getBlock()).timestamp < yesterday) {
                    twentyFourHourPrice = priceChange.args.endPrice;
                    break;
                }
            }
            if (!twentyFourHourPrice.eq(0)) {
                const marketChange = ((latestPrice.sub(twentyFourHourPrice)).div(twentyFourHourPrice)).mul(100);
                poolDispatch({
                    type: 'setMarketChange',
                    marketChange: marketChange.toNumber()
                })
            }

            poolDispatch({
                type: 'setLastPrice',
                lastPrice: latestPrice
            })
            
        }
    }

    const fetchPoolTokens = async () => {
        if (contract) {
            // Index 0 is the LONG token, index 1 is the SHORT token
            const longTokenAddress = await contract.tokens(0);
            const shortTokenAddress = await contract.tokens(1);
            const shortToken = new ethers.Contract(shortTokenAddress, tokenJSON.abi, provider?.getSigner() ?? provider) as PoolToken;
            const longToken = new ethers.Contract(longTokenAddress, tokenJSON.abi, provider?.getSigner() ?? provider) as PoolToken;
            const shortTokenName = await shortToken.name();
            const longTokenName = await longToken.name();
            setPoolTokens([longToken, shortToken])
            tokenDispatch({ type: 'setNames', shortToken: shortTokenName, longToken: longTokenName })
        }
    }

    const fetchPoolTokenBalances = () => {
        if (account && poolTokens.length) {
            const longTokenBalance = poolTokens[0].balanceOf(account)
            const shortTokenBalance = poolTokens[1].balanceOf(account)
            const longTokenAllowance = poolTokens[0].allowance(account, contract?.address as string)
            const shortTokenAllowance = poolTokens[1].allowance(account, contract?.address as string)
            Promise.all([longTokenBalance, shortTokenBalance, longTokenAllowance, shortTokenAllowance])
                .then((res) => {
                    const balances = {
                        longToken: res[0],
                        shortToken: res[1],
                    }
                    const max = BigNumber.from(Number.MAX_SAFE_INTEGER.toString())
                    const approvals = {
                        longToken: res[2].gte(max),
                        shortToken: res[3].gte(max)
                    }
                    console.debug("Fetched balances", balances)
                    console.debug("Fetched allowances", {
                        longToken: res[2],
                        shortToken: res[3]
                    })
                    tokenDispatch({ type: 'setPoolTokenBalances', balances: balances })
                    tokenDispatch({ type: 'setApprovedTokens', approvals: approvals})
                }).catch((err) => {
                    console.error("Failed to fetch pool token balances", err)
                    tokenDispatch({ type: 'setPoolTokenBalances', balances: {
                        longToken: ethers.BigNumber.from(0),
                        shortToken: ethers.BigNumber.from(0),
                    }})

                })
        }
    }

    const fetchQuoteTokenBalance = () => {
        if (quoteToken && account) {
            Promise.all([quoteToken.balanceOf(account), quoteToken.allowance(account, contract?.address as string)])
                .then((res) => {
                    console.debug("Fetched quoteToken balance", res[0])
                    console.debug("Fetched quoteToken allowance", res[1])
                    const max = BigNumber.from(Number.MAX_SAFE_INTEGER.toString())
                    tokenDispatch({ type: 'setQuoteTokenBalance', quoteTokenBalance: res[0] })
                    tokenDispatch({ type: 'setApprovedQuoteToken', value: res[1].gte(max)})
                })
                .catch((err) => {
                    console.error("Failed to fetch quote token balance", err)
                    tokenDispatch({ type: 'setQuoteTokenBalance', quoteTokenBalance: ethers.BigNumber.from(0)})
                })
        }
    }

    return {
        poolState,
        poolDispatch,
        tokenState,
        tokenDispatch,
        mint,
        burn
    };
};