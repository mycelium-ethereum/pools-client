import Web3 from 'web3';
import { ERC20 as ERC20Token } from '@tracer-protocol/contracts/types/ERC20';

/**
 * Checks the allowance of a contract to spend a given from address's funds
 * @param token token that is being deposited
 * @param from address (generally the users address)
 * @param contractAddress insurance contract or individual tracer contract
 * @returns 0 if not approved 1 if approved and -1 if something went wrong
 */
export const checkAllowance: (
    token: ERC20Token | undefined,
    from: string | undefined,
    contractAddress: string | undefined,
) => Promise<0 | 1 | -1> = async (token, from, contractAddress) => {
    const ARBITRARY_AMOUNT = 420;
    if (!from || !contractAddress || !token) {
        console.error('Failed to check balance Arguments invalid');
        return -1;
    }
    try {
        const currentAllowed = await token.methods.allowance(from, contractAddress).call();
        if (parseInt(Web3.utils.fromWei(currentAllowed)) < ARBITRARY_AMOUNT) {
            return 0;
        } // else
        return 1;
    } catch (e) {
        console.error(e);
        return -1;
    }
};
