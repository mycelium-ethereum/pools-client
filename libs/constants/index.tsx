import { PoolToken, SideType } from "@libs/types/General";
import BigNumber from "bignumber.js";

// side types
export const LONG = 0;
export const SHORT = 1;
export const SIDE_MAP: Record<SideType, string> = {
	[LONG]: 'Long',
	[SHORT]: 'Short'
}

// token types
export const MINT = 0;
export const BURN = 1;

// token type constants
export const SHORT_MINT = 0;
export const SHORT_BURN = 1;
export const LONG_MINT = 2;
export const LONG_BURN = 3;

export const EMPTY_TOKEN: PoolToken = {
	name: '',
	address: '',
	balance: new BigNumber(0),
	supply: new BigNumber(0),
	approved: false,
	side: SHORT
}