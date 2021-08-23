import { LONG, SHORT } from "@libs/constants";
import { Pool, PoolType } from "@libs/types/General";
import { LeveragedPool__factory, LeveragedPool, PoolToken, TestToken__factory, ERC20 } from "@libs/types/typechain";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { 
	ERC20__factory, TestToken 
} from '@libs/types/typechain'

/**
 * 
 * @param pool address and name of the pool
 * @param provider ethers provider
 * @returns a Pool object
 */
export const initPool: (pool: PoolType, provider: ethers.providers.JsonRpcProvider) => Promise<Pool> = async (pool, provider) => {
	const contract = new ethers.Contract(
		pool.address,
		LeveragedPool__factory.abi,
		provider,
	) as LeveragedPool;

	const [
		updateInterval,
		lastUpdate,
		shortBalance,
		longBalance,
		oraclePrice,
		quoteToken,
		longToken,
		shortToken,
		poolCommitter,
		_leverageAmount // todo add this back when we have converted away from ABDK math
	] = await Promise.all([
		contract.updateInterval(),
		contract.lastPriceTimestamp(),
		contract.shortBalance(),
		contract.longBalance(),
		contract.getOraclePrice(),
		contract.quoteToken(),
		contract.tokens(0),
		contract.tokens(1),
		contract.poolCommitter(),
		contract.leverageAmount()
	])

	const shortTokenInstance = new ethers.Contract(
		shortToken,
		TestToken__factory.abi,
		provider,
	) as PoolToken;
	const [shortTokenName, shortTokenSupply] = await Promise.all([
		shortTokenInstance.name(),
		shortTokenInstance.totalSupply()
	])

	const longTokenInstance = new ethers.Contract(
		longToken,
		TestToken__factory.abi,
		provider,
	) as PoolToken;
	const [longTokenName, longTokenSupply] = await Promise.all([
		longTokenInstance.name(),
		longTokenInstance.totalSupply()
	])
	console.log(longTokenSupply)

	const quoteTokenInstance = new ethers.Contract(
		quoteToken,
		TestToken__factory.abi,
		provider,
	) as TestToken;

	const quoteTokenName = await quoteTokenInstance.name();

	return (
		{
			...pool,
			updateInterval: new BigNumber(updateInterval.toString()),
			lastUpdate: new BigNumber(lastUpdate.toString()),
			lastPrice: new BigNumber(0),
			shortBalance:  new BigNumber(ethers.utils.formatEther(shortBalance)),
			longBalance: new BigNumber(ethers.utils.formatEther(longBalance)),
			oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
			committer: poolCommitter,
			// leverage: new BigNumber(leverageAmount.toString()), //TODO add this back when they change the units
			leverage: new BigNumber(2),
			longToken: {
				address: longToken,
				name: longTokenName,
				approved: false,
				balance: new BigNumber(0),
				supply: new BigNumber(ethers.utils.formatEther(longTokenSupply)),
				side: LONG 
			},
			shortToken: {
				address: shortToken,
				name: shortTokenName,
				approved: false,
				balance: new BigNumber(0),
				supply: new BigNumber(ethers.utils.formatEther(shortTokenSupply)),
				side: SHORT
			},
			quoteToken: {
				address: quoteToken,
				name: quoteTokenName,
				approved: false,
				balance: new BigNumber(0)
			}
		}
	)
}

export const fetchTokenBalances = (
	tokens: string[], 
	provider: ethers.providers.JsonRpcProvider, 
	account: string
) => {
	return Promise.all(tokens.map((token) => {
		const tokenContract = new ethers.Contract(
			token,
			ERC20__factory.abi,
			provider
		) as ERC20;
		return tokenContract.balanceOf(account)
	}))
}