import React from 'react';
import { tokenSymbolToLogoTicker } from '~/components/General';
import BVector from '~/public/img/b-vector.svg';
import * as Styles from './styles';

type Props = {
    longToken: {
        symbol: string;
        effectiveGain: number;
    };
    shortToken: {
        symbol: string;
        effectiveGain: number;
    };
};

export const SkewCard: React.FC<Props> = ({ longToken, shortToken }) => (
    <Styles.Container>
        <Styles.Background />
        <Styles.Card>
            <Styles.Vector>
                <BVector />
            </Styles.Vector>
            <Styles.Wrapper>
                <Styles.Content>
                    <Styles.Logo size="lg" ticker={tokenSymbolToLogoTicker(longToken.symbol)} />
                    <Styles.Text>
                        <div>{longToken.symbol}</div>
                        <div>Leverage on gains: {longToken.effectiveGain.toFixed(3)}</div>
                    </Styles.Text>
                </Styles.Content>
                <Styles.Content>
                    <Styles.Logo size="lg" ticker={tokenSymbolToLogoTicker(shortToken.symbol)} />
                    <Styles.Text>
                        <div>{shortToken.symbol}</div>
                        <div>Leverage on gains: {shortToken.effectiveGain.toFixed(3)}</div>
                    </Styles.Text>
                </Styles.Content>
            </Styles.Wrapper>
        </Styles.Card>
    </Styles.Container>
);
