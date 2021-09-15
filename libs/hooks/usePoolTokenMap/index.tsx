import { useMemo, useState } from "react"
import {  usePools } from "@context/PoolContext"
import { useWeb3 } from "@context/Web3Context/Web3Context"
import { LeveragedPool, LeveragedPool__factory } from "@tracer-protocol/perpetual-pools-contracts/types"
import { ethers } from "ethers"

// const usePoolTokenMap
export default (() => {
	const { provider } = useWeb3()
	const { pools } = usePools()
	const [tokenMap, setTokenMap] = useState<Record<string, string>>({})

	useMemo(() => {
		if (pools && provider) {
			console.log("Fetching tokens")
			Promise.all(Object.keys(pools).map((pool) => {
    			const poolContract = new ethers.Contract(pool, LeveragedPool__factory.abi, provider) as LeveragedPool;
				return Promise.all([poolContract.tokens(0), poolContract.tokens(1), pool])
			})).then((tokens) => {
				const tokenMap: Record<string, string> = {}
				tokens.forEach((token) => {
					const [longToken, shortToken, pool] = token;
					tokenMap[longToken] = pool;
					tokenMap[shortToken] = pool;
				})
				setTokenMap(tokenMap)
			})

		}
	}, [pools, provider])

	return tokenMap	;
})