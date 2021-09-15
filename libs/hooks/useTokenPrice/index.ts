import { usePool } from "@context/PoolContext";
import { BigNumber } from "@ethersproject/bignumber";
import { calcTokenPrice } from "@libs/utils/calcs";
import { useMemo, useState } from "hoist-non-react-statics/node_modules/@types/react";
import usePoolTokenMap from "../usePoolTokenMap"


export default ((tokenAddress, isLong) => {
	const tokenMap = usePoolTokenMap();
	const poolAddress = useMemo(() => tokenMap[tokenAddress], [tokenMap, tokenAddress])
	const pool = usePool(poolAddress)
	const [tokenPrice, setTokenPrice] = useState(new BigNumber(1));

	const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);

    const notional = useMemo(
        () => (isLong ? pool.nextLongBalance : pool.nextShortBalance),
        [isLong, pool.nextLongBalance, pool.nextShortBalance],
    );

    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

	useMemo(() => {
		setTokenPrice(
			calcTokenPrice(notional, token.supply.plus(pendingBurns))
		)
	}, [notional, token, pendingBurns])
	return tokenPrice
}) as (token: string, isLong: boolean) => BigNumber
