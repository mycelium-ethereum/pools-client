import BigNumber from "bignumber.js";
import {toApproxCurrency} from "~/utils/converters";

export const TokensAt = ({ amount, price, tokenSymbol }: { amount: BigNumber, price: BigNumber, tokenSymbol: string }) => (
    <>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(price)} {tokenSymbol}/token
                </div>
    </>
)

export const TokensNotional = ({ amount, price, tokenSymbol }: { amount: BigNumber, price: BigNumber, tokenSymbol: string }) => (

    <>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(price.times(amount))} {tokenSymbol}
                </div>
                </>
)

export default {
    TokensNotional,
    TokensAt
}
