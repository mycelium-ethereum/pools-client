import React from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '~/components/General';
import { toApproxCurrency } from '~/utils/converters';
import { getMarketInfoFromSymbol, getSimplifiedTokenName, marketSymbolToAssetName } from '~/utils/poolNames';
import { InnerCellSubText } from './styles';

const MarketContainer = styled.div`
    margin: auto 0;
    display: flex;
    align-items: center;
`;

const MarketLogo = styled(Logo)`
    margin: auto 0.5rem auto 0;
    display: inline;
`;

const MarketText = styled.div`
    display: flex;
`;

export const Market = ({ tokenSymbol, isLong }: { tokenSymbol: string; isLong: boolean }): JSX.Element => {
    const { leverage, marketSymbol } = getMarketInfoFromSymbol(tokenSymbol);

    return (
        <MarketContainer>
            <MarketLogo size="lg" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
            <div>
                <MarketText>
                    <div>
                        {leverage}-{marketSymbolToAssetName[marketSymbol]}
                    </div>
                    &nbsp;
                    <div className={`${isLong ? 'green' : 'red'}`}>{isLong ? 'Long' : 'Short'}</div>
                </MarketText>
                <InnerCellSubText>{tokenSymbol}</InnerCellSubText>
            </div>
        </MarketContainer>
    );
};

export const SettlementToken = ({ tokenSymbol }: { tokenSymbol: string }): JSX.Element => (
    <MarketContainer>
        <MarketLogo size="lg" ticker={tokenSymbol as LogoTicker} />
        <div>{tokenSymbol}</div>
    </MarketContainer>
);

export const MarketPrice = ({
    tokenSymbol,
    tokenPrice,
}: {
    tokenSymbol: string;
    tokenPrice: BigNumber | number;
}): JSX.Element => (
    <div className="my-auto flex">
        <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenSymbol)} className="my-auto mr-2 inline" />
        <div>
            <div>{tokenSymbol}</div>
            <div className="text-cool-gray-500">{toApproxCurrency(tokenPrice)}</div>
        </div>
    </div>
);

export const TokenPrice = ({
    tokenInSymbol,
    tokenOutSymbol,
    price,
}: {
    tokenOutSymbol: string;
    tokenInSymbol: string;
    price: BigNumber;
}): JSX.Element => {
    const simplifiedIn = getSimplifiedTokenName(tokenInSymbol);
    const simplifiedOut = getSimplifiedTokenName(tokenOutSymbol);
    return <div>{`${price.toFixed(3)} ${simplifiedIn}/${simplifiedOut}`}</div>;
};

export const Amount = ({ tokenSymbol, amount }: { tokenSymbol: string; amount: BigNumber }): JSX.Element => (
    <MarketContainer>
        <MarketLogo size="lg" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
        <div>{amount.toFixed(3)}</div>
    </MarketContainer>
);

export const TokenSymbol = ({ tokenSymbol, isLong }: { tokenSymbol: string; isLong?: boolean }): JSX.Element =>
    isLong !== undefined ? (
        <div>
            <div>{tokenSymbol}</div>
            <div className={`${isLong ? 'green' : 'red'}`}>{isLong ? 'Long' : 'Short'}</div>
        </div>
    ) : (
        <>{tokenSymbol}</>
    );
