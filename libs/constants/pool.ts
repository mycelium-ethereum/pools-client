import { Pool } from "@libs/types/General";
import { BigNumber } from "bignumber.js";
import { LONG, SHORT } from ".";

export const DEFAULT_POOLSTATE: Pool = {
    address: '',
    name: '',
	lastPrice: new BigNumber(0),
    updateInterval: new BigNumber(0),
    lastUpdate: new BigNumber(0),
    shortBalance: new BigNumber(0),
	leverage: new BigNumber(0),
    longBalance: new BigNumber(0),
    oraclePrice: new BigNumber(0),
    quoteToken: {
		address: '',
		name: '',
		balance: new BigNumber(0),
		approved: false,
	},
    shortToken: {
		address: '',
		name: '',
		balance: new BigNumber(0),
		supply: new BigNumber(0),
		approved: false,
		side: SHORT
	},
    longToken: {
		address: '',
		name: '',
		balance: new BigNumber(0),
		supply: new BigNumber(0),
		approved: false,
		side: LONG
	},
    committer: '',
}