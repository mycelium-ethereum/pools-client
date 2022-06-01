// TODO these should be the base
// ideally the filters should dynamically change depending on the pools being used

export enum MarketFilterEnum {
    All = 'All',
    ETH = 'Ethereum',
    BTC = 'Bitcoin',
    TOKE = 'Tokemak',
    LINK = 'Chainlink',
    EUR = 'Euro',
    AAVE = 'Aave',
    WTI = 'WTI Oil',
}

export enum CollateralFilterEnum {
    All = 'All',
    USDC = 'USDC',
    PPUSD = 'PPUSD',
}

export enum LeverageFilterEnum {
    All = 'All',
    One = '1',
    Three = '3',
    Five = '5',
    Seven = '7',
}

export enum SideFilterEnum {
    Short = 'Short',
    Long = 'Long',
    All = 'All',
}

export enum SortByEnum {
    Name = 'Token',
    Price = 'Price',
    EffectiveGain = 'Effective Gain',
    TotalValueLocked = 'TVL',
    MyHoldings = 'My Holdings',
}

export enum StakeSortByEnum {
    Name = 'Token',
    TotalValueLocked = 'TVL',
    // Rewards = 'APR',
    MyStaked = 'My Staked',
    MyRewards = 'My Rewards',
}
