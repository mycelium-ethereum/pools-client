import React from 'react';
import { tokenSymbolToLogoTicker } from '~/components/General';
import BVector from '~/public/img/b-vector.svg';
import * as Styles from './styles';
import { BrowseTableRowData } from '../../../Pools/state';

type Props = {
    maxSkew: BrowseTableRowData;
};

export const SkewCard: React.FC<Props> = ({ maxSkew }) => (
    <Styles.Container>
        <Styles.Background />
        <Styles.Card>
            <Styles.Vector>
                <BVector />
            </Styles.Vector>
            <Styles.Wrapper>
                <Styles.Content>
                    <Styles.Logo size="lg" ticker={tokenSymbolToLogoTicker(maxSkew?.longToken?.symbol)} />
                    <Styles.Text>
                        <div>{maxSkew?.longToken?.symbol}</div>
                        <div>Leverage on gains: {maxSkew?.longToken?.effectiveGain.toFixed(3)}</div>
                    </Styles.Text>
                </Styles.Content>
                <Styles.Content>
                    <Styles.Logo size="lg" ticker={tokenSymbolToLogoTicker(maxSkew?.shortToken?.symbol)} />
                    <Styles.Text>
                        <div>{maxSkew?.shortToken?.symbol}</div>
                        <div>Leverage on gains: {maxSkew?.shortToken?.effectiveGain.toFixed(3)}</div>
                    </Styles.Text>
                </Styles.Content>
            </Styles.Wrapper>
        </Styles.Card>
    </Styles.Container>
);
