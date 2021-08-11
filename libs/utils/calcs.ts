import { BigNumber } from "ethers"

export const calcTokenPrice: (tokenSupply: BigNumber, totalPoolValue: BigNumber) => BigNumber = (tokenSupply, totalPoolValue) => {
	return (totalPoolValue.div(tokenSupply))
}

/**
 * 
 * @param priceRatio ratio between old and new price
 * @param direction direction of price movement (base on ratio)
 * @param leverage pool leverage
 * @returns 
 */
export const calcLossMultiplier: (
	priceRatio: BigNumber, leverage: BigNumber
) => BigNumber = (priceRatio, leverage) => {
	const direction = calcDirection(priceRatio);
	console.log(priceRatio)
	
	return (
		leverage.mul(
			((direction.lt(0) ? BigNumber.from(1) : BigNumber.from(0)).mul(priceRatio)).add(
				(direction.gte(0) ? BigNumber.from(1) : BigNumber.from(0)).div(priceRatio)
			)
		)
	)
}

export const calcRatio: (newPrice: BigNumber, oldPrice: BigNumber) => BigNumber = (newPrice, oldPrice) => {
	if (!oldPrice.eq(0)) return BigNumber.from(0);
	return (
		newPrice.div(oldPrice)
	)
}

/**
 * compares ratio to 1
 * @param priceRatio between oldPrice and new
 * @return -1 if x < y, 0 if x = y, or 1 if x > y
 */
export const calcDirection: (priceRatio: BigNumber) => BigNumber = (priceRatio) => {
	if (priceRatio.lt(1)) {
		return BigNumber.from(-1)
	} else if (priceRatio.eq(0)) {
		return BigNumber.from(0)
	} else {
		return BigNumber.from(1)
	}
}

