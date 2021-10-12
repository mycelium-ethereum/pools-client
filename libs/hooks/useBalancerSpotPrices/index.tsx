import { useEffect, useState } from "react";
import { getBalancerPrices } from "@libs/utils/rpcMethods";
import BigNumber from "bignumber.js";

export default (() => {
	const [tokenPrices, setTokenPrices] = useState<Record<string, BigNumber>>({});

	useEffect(() => {
		let mounted = true;
		getBalancerPrices().then((tokenPrices) => {
			if (mounted) {
				setTokenPrices(tokenPrices)
			}
		})
		return () => {
			mounted = false;
		}
	}, [])

	return tokenPrices;

}) as () => Record<string, BigNumber>