import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { PoolsV1TokenRowProps } from '~/types/poolsV1Tokens';
import { useStore } from '~/store/main';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { selectAccount, selectNetwork, selectProvider } from '~/store/Web3Slice';
import { PoolsV1TokensTable } from './PoolsV1TokensTable';
import { OverviewTable } from '../OverviewTable';
import { poolsLists } from '~/utils/poolsV1/poolsList';
import erc20Abi from '~/utils/poolsV1/abi/erc20';
import leveragedPoolAbi from '~/utils/poolsV1/abi/leveragedPool';
import poolCommitterAbi from '~/utils/poolsV1/abi/poolCommitter';
import BigNumber from 'bignumber.js';
import { PoolStatus } from '~/types/pools';
import { SideEnum, ethersBNtoBN } from '@tracer-protocol/pools-js';
import { OnClickV1BurnAll } from '~/types/portfolio';
import { TransactionType } from '~/store/TransactionSlice/types';

export const PoolsV1Tokens = (): JSX.Element => {
    const account = useStore(selectAccount);
    const provider = useStore(selectProvider);
    const network = useStore(selectNetwork);
    const handleTransaction = useStore(selectHandleTransaction);

    // console.log('POOLS V! TOKENS ACCOUNT', account);
    // console.log('POOLS V! TOKENS PROVIDER', provider);
    const [poolsV1Tokens, setPoolsV1Tokens] = useState<Record<string, PoolsV1TokenRowProps>>({});

	const onClickV1BurnAll: OnClickV1BurnAll = (
		poolCommitter, 
		commitType, 
		amount, 
		tokenName,
		tokenAddress,
		settlementTokenName
	) => {
		const poolCommitterInstance = new ethers.Contract(poolCommitter, poolCommitterAbi, provider?.getSigner());
		if(handleTransaction) {

			console.log('v1 BURN TX', poolCommitterInstance, commitType, amount)

			handleTransaction({
				callMethod: poolCommitterInstance.commit,
				type: TransactionType.V1_BURN_ALL,
				injectedProps: {
					tokenName,
					settlementTokenName
				},
				// @ts-ignore
				params: [commitType, amount],
				callBacks: {
					onSuccess: () => {
						// clear the token from the table
						setPoolsV1Tokens(prev => {
							const next = { ...prev };
							delete next[tokenAddress];

							return next;
						})
					}
				}
			})
		}
	}

    useEffect(() => {
        console.log('RREFRESHING POOLS V1 TOKENS')
        if(account && network && provider && poolsLists[network].pools) {
			const syncHoldings = async () => {
				for (const pool of poolsLists[network].pools) {
					
					// const poolCommitterInstance = new ethers.Contract(pool.committer.address, poolCommitterAbi, provider);
					// const gov = await poolCommitterInstance.governance();
					// console.log('v1 committer gov', pool.committer.address, gov);
					// const calldata = poolCommitterInstance.encodeFunctionData('setMinimumCommitSize', ['0'])
                    // console.log('syncing pool', pool)
					// console.log('v1 CALLDATA', calldata);
                    const shortToken = new ethers.Contract(pool.shortToken.address, erc20Abi, provider);
                    const longToken = new ethers.Contract(pool.longToken.address, erc20Abi, provider);
                    const [
                        _shortTokenBalance,
                        _longTokenBalance
                    ] = await Promise.all([
                        shortToken.balanceOf(account),
                        longToken.balanceOf(account)
                    ])

					const shortTokenBalance = ethersBNtoBN(_shortTokenBalance, pool.shortToken.decimals);
					const longTokenBalance = ethersBNtoBN(_longTokenBalance, pool.longToken.decimals);
                    // console.log('--------------------')
                    // console.log(`${pool.name}`);
                    // console.log(`${pool.shortToken.name} balance: ${shortTokenBalance}`);
                    // console.log(`${pool.longToken.name} balance: ${longTokenBalance}`);
                    if(shortTokenBalance.gt(0) || longTokenBalance.gt(0)) {
                        const poolInstance = new ethers.Contract(pool.address, leveragedPoolAbi, provider);
                        // load pool details 
                        const [
							balances,
							_shortSupply,
							_longSupply
                        ] = await Promise.all([
							poolInstance.balances(),
							shortToken.totalSupply(),
							longToken.totalSupply(),
						]);

						const shortSupply = ethersBNtoBN(_shortSupply, pool.shortToken.decimals);
						const longSupply = ethersBNtoBN(_longSupply, pool.longToken.decimals);

						const shortBalance = ethersBNtoBN(balances[0], pool.shortToken.decimals);
						const longBalance = ethersBNtoBN(balances[1], pool.longToken.decimals);

						const shortTokenPrice = shortBalance.div(shortSupply);
						const longTokenPrice = longBalance.div(longSupply);
						console.log(`v1 ${pool.shortToken.name} price: ${shortTokenPrice.toString()}`);
						console.log(`v1 ${pool.longToken.name} price: ${longTokenPrice.toString()}`);

						if(shortTokenBalance.gt(0)) {

							setPoolsV1Tokens(prev => {
								return {
									...prev,
									[pool.shortToken.address]: {
										tokenName: pool.shortToken.symbol,
										settlementTokenName: pool.settlementToken.symbol,
										address: pool.shortToken.address,
										poolCommitterAddress: pool.committer.address,
										commitType: 1,
										entryPrice: new BigNumber(0),
										decimals: pool.shortToken.decimals,
										currentTokenPrice: shortTokenPrice,
										leveragedNotionalValue: shortTokenBalance.times(shortTokenPrice).times(pool.leverage),
										symbol: pool.shortToken.symbol,
										side: SideEnum.short,
										network: network,
										balance: shortTokenBalance,
										name: pool.shortToken.name,
										poolAddress: pool.address,
										settlementTokenSymbol: pool.settlementToken.symbol,
										oraclePrice: new BigNumber(0),
										effectiveGain: pool.leverage,
										stakedTokens: new BigNumber(0),
										poolStatus: PoolStatus.V1,
										expectedExecution: 0
									}
								}
							})
						}

						if(longTokenBalance.gt(0)) {
							setPoolsV1Tokens(prev => {
								return {
									...prev,
									[pool.longToken.address]: {
										address: pool.longToken.address,
										poolCommitterAddress: pool.committer.address,
										tokenName: pool.longToken.symbol,
										settlementTokenName: pool.settlementToken.symbol,
										commitType: 3,
										entryPrice: new BigNumber(0),
										decimals: pool.longToken.decimals,
										currentTokenPrice: longTokenPrice,
										leveragedNotionalValue: longTokenBalance.times(longTokenPrice).times(pool.leverage),
										symbol: pool.longToken.symbol,
										side: SideEnum.long,
										network: network,
										balance: longTokenBalance,
										name: pool.longToken.name,
										poolAddress: pool.address,
										settlementTokenSymbol: pool.settlementToken.symbol,
										oraclePrice: new BigNumber(0),
										effectiveGain: pool.leverage,
										stakedTokens: new BigNumber(0),
										poolStatus: PoolStatus.V1,
										expectedExecution: 0
									}
								}
							})
						}
					}
                }
            }
            syncHoldings();
        }
    }, [account, provider, network]);

    // const { rows: tokens, isLoading } = useUserPoolsV1Tokens();
    // on load, fetch long and short balances for all known v1 pools
    // if there is a non-zero balance, create a row and fetch the following data
    // PoolCommitter approval of pool token
    // if approval is required, button text = 'approve erc20'
    // get estimated token price (<sideBalance>/<sideSupply - pendingBurn + pendingMint>)
    // 

    return (
        <OverviewTable
            title="Pools V1 Tokens"
            subTitle="Pools V1 tokens in your wallet."
            firstActionTitle=""
            firstAction={null}
            secondAction={null}
            isLoading={false}
            rowCount={Object.values(poolsV1Tokens).length}
        >
            <PoolsV1TokensTable
                rows={Object.values(poolsV1Tokens)}
				onClickV1BurnAll={onClickV1BurnAll}
            />
        </OverviewTable>
    );
};

export default PoolsV1Tokens;
