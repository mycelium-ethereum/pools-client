import React from 'react';
import styled from 'styled-components';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import { marketSymbolToAssetName } from '~/utils/converters';

const MarketContainer = styled.div`
    margin: auto 0;
    display: flex;
`;

const MarketLogo = styled(Logo)`
    margin: auto 0.5rem auto 0;
    display: inline;
`;

export const Market = ({ tokenSymbol, isLong }: { tokenSymbol: string; isLong: boolean }): JSX.Element => {
    const leverage = tokenSymbol.split('-')[0][0];
    const marketName = tokenSymbol.split('-')[1];

    return (
        <MarketContainer>
            <MarketLogo size="lg" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
            <div>
                <div className="flex">
                    <div>
                        {leverage}-{marketSymbolToAssetName[marketName]}
                    </div>
                    &nbsp;
                    <div className={`${isLong ? 'green' : 'red'}`}>{isLong ? 'Long' : 'Short'}</div>
                </div>
                <div className="text-cool-gray-500">{tokenSymbol}</div>
            </div>
        </MarketContainer>
    );
};
