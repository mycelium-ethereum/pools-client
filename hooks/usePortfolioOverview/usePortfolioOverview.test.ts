import BigNumber from 'bignumber.js';
import { renderHook } from '@testing-library/react-hooks';
import { DEFAULT_POOLSTATE } from '~/constants/pools';
import { selectUserPendingCommitAmounts } from '~/store/PendingCommitSlice';
import { selectAccount } from '~/store/Web3Slice';
import useFarmBalances from '../useFarmBalances';
import usePools from '../usePools';
import usePortfolioOverview from './';

jest.mock('~/store/PendingCommitSlice');

jest.mock('~/store/Web3Slice');
jest.mock('../usePools');
jest.mock('../useFarmBalances');

beforeEach(() => {
    (selectAccount as jest.Mock).mockReturnValue(MOCK_ACCOUNT);
    (usePools as jest.Mock).mockReturnValue({
        pools: [
            {
                ...DEFAULT_POOLSTATE,
                poolInstance: TEST_POOL_INSTANCE,
            },
        ],
    });
    (useFarmBalances as jest.Mock).mockReturnValue({
        [MOCK_LONG_TOKEN]: new BigNumber(0),
        [MOCK_SHORT_TOKEN]: new BigNumber(0),
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

const MOCK_ACCOUNT = '0x9332e38f1a9BA964e166DE3eb5c637bc36cD4D27';
const MOCK_POOL = 'MOCK_420';
const MOCK_LONG_TOKEN = 'LONG';
const MOCK_SHORT_TOKEN = 'SHORT';

const TEST_POOL_INSTANCE = {
    ...DEFAULT_POOLSTATE.poolInstance,
    address: MOCK_POOL,
    longToken: {
        ...DEFAULT_POOLSTATE.poolInstance.longToken,
        address: MOCK_LONG_TOKEN,
    },
    shortToken: {
        ...DEFAULT_POOLSTATE.poolInstance.shortToken,
        address: MOCK_SHORT_TOKEN,
    },
};

// base set filled state
// used to test varying token prices or addition mint amounts
const FIXED_BALANCES = {
    userBalances: {
        ...DEFAULT_POOLSTATE.userBalances,
        tradeStats: {
            ...DEFAULT_POOLSTATE.userBalances.tradeStats,
            totalShortBurnReceived: new BigNumber(10),
            totalLongBurnReceived: new BigNumber(15),
            // adds pendingBurns since this (was) tokens in the users wallets
            totalLongMintSpend: new BigNumber(15 + 0 + 100), // wallet tokens * price + pendingBurns + aggregateBalances.shortTokens * price
            totalShortMintSpend: new BigNumber(10 + 0 + 100), // wallet tokens * price + pendingBurns + aggregateBalances.shortTokens * price
        },
        aggregateBalances: {
            longTokens: new BigNumber(100),
            shortTokens: new BigNumber(100),
            settlementTokens: new BigNumber(0),
        },
        shortToken: {
            balance: new BigNumber(10),
        },
        longToken: {
            balance: new BigNumber(15),
        },
        settlementToken: {
            balance: new BigNumber(20), // should ignore settlementToken
        },
    },
};

const FILLED_INITIAL_STATE = {
    pools: [
        {
            ...DEFAULT_POOLSTATE,
            poolInstance: TEST_POOL_INSTANCE,
            ...FIXED_BALANCES,
        },
    ],
};

// long token 10% increase
const LONG_TOKEN_PRICE_INCREASE = {
    pools: [
        {
            ...DEFAULT_POOLSTATE,
            poolInstance: {
                ...TEST_POOL_INSTANCE,
                getLongTokenPrice: () => new BigNumber(1.1),
            },
            ...FIXED_BALANCES,
        },
    ],
};

describe('usePortfolioOverview hook', () => {
    it('usePortfolioOverview runs correctly', () => {
        const { result } = renderHook(() => usePortfolioOverview());
        expect(result.current.totalPortfolioValue.toNumber()).toBe(0);
        expect(result.current.unrealisedProfit.toNumber()).toBe(0);
        expect(result.current.realisedProfit.toNumber()).toBe(0);
        expect(result.current.portfolioDelta).toBe(0);
    });

    it('caclulates filled state', () => {
        (usePools as jest.Mock).mockReturnValue(FILLED_INITIAL_STATE);

        const { result, rerender } = renderHook(() => usePortfolioOverview());

        // token prices are $1 for the first case
        // totalPortfolioValue summation of aggregateBalances (200), walletBalances (25), and pendingCommits (50)
        expect(result.current.totalPortfolioValue.toNumber()).toBe(225);
        expect(result.current.unrealisedProfit.toNumber()).toBe(0);
        expect(result.current.realisedProfit.toNumber()).toBe(25);
        expect(result.current.portfolioDelta).toBe(0);

        // long token increase
        (usePools as jest.Mock).mockReturnValue(LONG_TOKEN_PRICE_INCREASE);
        rerender();

        // all long tokens value increase by 10%
        expect(result.current.totalPortfolioValue.toNumber()).toBe(236.5);
        expect(result.current.unrealisedProfit.toNumber()).toBe(11.5);
        expect(result.current.realisedProfit.toNumber()).toBe(25);
        expect(result.current.portfolioDelta).toBe(5.111111111111112);

        expect(selectAccount as jest.Mock).toHaveBeenCalledTimes(1);
    }),
        it('handles partially staked', () => {
            const stakedLongTokens = 5;
            const stakedShortTokens = 0;
            (usePools as jest.Mock).mockReturnValue({
                pools: [
                    {
                        ...DEFAULT_POOLSTATE,
                        poolInstance: TEST_POOL_INSTANCE,
                        userBalances: {
                            ...FIXED_BALANCES.userBalances,
                            longToken: {
                                balance: FIXED_BALANCES.userBalances.longToken.balance.minus(stakedLongTokens),
                            },
                            shortToken: {
                                balance: FIXED_BALANCES.userBalances.shortToken.balance.minus(stakedShortTokens),
                            },
                        },
                    },
                ],
            });
            (useFarmBalances as jest.Mock).mockReturnValue({
                [MOCK_LONG_TOKEN]: new BigNumber(stakedLongTokens),
                [MOCK_SHORT_TOKEN]: new BigNumber(stakedShortTokens),
            });

            const { result } = renderHook(() => usePortfolioOverview());

            expect(result.current.totalPortfolioValue.toNumber()).toBe(225);
            expect(result.current.unrealisedProfit.toNumber()).toBe(0);
            expect(result.current.realisedProfit.toNumber()).toBe(25);
            expect(result.current.portfolioDelta).toBe(0);
        });
    it('handles fully staked', () => {
        const stakedLongTokens = 10;
        const stakedShortTokens = 15;
        (usePools as jest.Mock).mockReturnValue({
            pools: [
                {
                    ...DEFAULT_POOLSTATE,
                    poolInstance: TEST_POOL_INSTANCE,
                    ...FIXED_BALANCES,
                    userBalances: {
                        ...FIXED_BALANCES.userBalances,
                        longToken: {
                            balance: FIXED_BALANCES.userBalances.longToken.balance.minus(stakedLongTokens),
                        },
                        shortToken: {
                            balance: FIXED_BALANCES.userBalances.shortToken.balance.minus(stakedShortTokens),
                        },
                    },
                },
            ],
        });
        (useFarmBalances as jest.Mock).mockReturnValue({
            [MOCK_LONG_TOKEN]: new BigNumber(stakedLongTokens),
            [MOCK_SHORT_TOKEN]: new BigNumber(stakedShortTokens),
        });

        const { result } = renderHook(() => usePortfolioOverview());

        expect(result.current.totalPortfolioValue.toNumber()).toBe(225);
        expect(result.current.unrealisedProfit.toNumber()).toBe(0);
        expect(result.current.realisedProfit.toNumber()).toBe(25);
        expect(result.current.portfolioDelta).toBe(0);
    });
    it('handles over staked with 0 balances', () => {
        // staking more tokens than have minted (have received from another wallet);
        // (usePools as jest.Mock).mockReturnValue();
        (useFarmBalances as jest.Mock).mockReturnValue({
            [MOCK_LONG_TOKEN]: new BigNumber(200),
            [MOCK_SHORT_TOKEN]: new BigNumber(100),
        });

        const { result } = renderHook(() => usePortfolioOverview());

        expect(result.current.totalPortfolioValue.toNumber()).toBe(300);
        expect(result.current.unrealisedProfit.toNumber()).toBe(300);
        expect(result.current.realisedProfit.toNumber()).toBe(0);
        expect(result.current.portfolioDelta).toBe(0);
    });
    it('handles mints', () => {
        const mintAmounts = {
            longBurn: new BigNumber(0),
            shortBurn: new BigNumber(0),
            longMint: new BigNumber(15),
            shortMint: new BigNumber(20),
            longBurnShortMint: new BigNumber(25), // should ignore flip amounts for total portfolio value
            shortBurnLongMint: new BigNumber(30), // should ignore flip amounts for total portfolio value
        };
        (selectUserPendingCommitAmounts as jest.Mock).mockReturnValue({
            [MOCK_POOL.toLowerCase()]: {
                [MOCK_ACCOUNT]: mintAmounts,
            },
        });
        (usePools as jest.Mock).mockReturnValue(LONG_TOKEN_PRICE_INCREASE);

        const { result } = renderHook(() => usePortfolioOverview());

        // should only increase totalPortfolioValue
        // price delta will decrease slightly since the portfolio increase and dilution of profit/loss
        expect(result.current.totalPortfolioValue.toNumber()).toBe(271.5);
        expect(result.current.unrealisedProfit.toNumber()).toBe(11.5);
        expect(result.current.realisedProfit.toNumber()).toBe(25);
        expect(result.current.portfolioDelta).toBe(4.423076923076923);
    }),
        it('handles burns', () => {
            // with burns we also have to reduce from either wallet balance or aggregate balances other wise we are
            // burning from thin air. RIP when people buy on secondary market;
            // this is burning all tokens in the wallet
            (selectUserPendingCommitAmounts as jest.Mock).mockReturnValue({
                [MOCK_POOL.toLowerCase()]: {
                    [MOCK_ACCOUNT]: {
                        longBurn: new BigNumber(15),
                        shortBurn: new BigNumber(10),
                        longMint: new BigNumber(0),
                        shortMint: new BigNumber(0),
                        longBurnShortMint: new BigNumber(25), // should ignore flip amounts for total portfolio value
                        shortBurnLongMint: new BigNumber(30), // should ignore flip amounts for total portfolio value
                    },
                },
            });
            (usePools as jest.Mock).mockReturnValue({
                pools: [
                    {
                        ...DEFAULT_POOLSTATE,
                        poolInstance: {
                            ...TEST_POOL_INSTANCE,
                            getLongTokenPrice: () => new BigNumber(1.1),
                            getNextLongTokenPrice: () => new BigNumber(1.1),
                        },
                        ...FIXED_BALANCES,
                        userBalances: {
                            ...FIXED_BALANCES.userBalances,
                            longToken: {
                                balance: new BigNumber(0),
                            },
                            shortToken: {
                                balance: new BigNumber(0),
                            },
                        },
                    },
                ],
            });

            const { result } = renderHook(() => usePortfolioOverview());

            // portfolio value should remain the same
            expect(result.current.totalPortfolioValue.toNumber()).toBe(236.5);
            expect(result.current.unrealisedProfit.toNumber()).toBe(11.5);
            expect(result.current.realisedProfit.toNumber()).toBe(25);
            expect(result.current.portfolioDelta).toBe(5.111111111111112);
        });
    it('handles disconnected account', () => {
        (selectAccount as jest.Mock).mockReturnValue(undefined);
        const { result } = renderHook(() => usePortfolioOverview());

        // portfolio value should remain the same
        expect(result.current.totalPortfolioValue.toNumber()).toBe(0);
        expect(result.current.unrealisedProfit.toNumber()).toBe(0);
        expect(result.current.realisedProfit.toNumber()).toBe(0);
        expect(result.current.portfolioDelta).toBe(0);
    });
});
