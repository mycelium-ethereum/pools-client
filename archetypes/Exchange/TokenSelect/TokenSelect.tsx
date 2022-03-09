import React, { useState, useRef, useEffect } from 'react';
import * as Styles from './styles';
import { TokenRow } from '@libs/hooks/usePoolTokens';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';

const TokenSelect: React.FC<{
    tokens: TokenRow[];
}> = ({ tokens }) => {
    const [show, setShow] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const searchInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.addEventListener('focus', () => {
                console.log('open');
                setShow(true);
            });
            searchInput.current.addEventListener('blur', () => {
                console.log('close');
                setShow(false);
            });
        }
    }, [searchInput.current]);

    return (
        <>
            <Styles.TokenSearch ref={searchInput} value={filter} onChange={(filter) => setFilter(filter)} />
            <Styles.TokenSelectDropdown defaultHeight={0} open={show}>
                <Styles.TokenSelectBox>
                    <Styles.TokenSelectTable>
                        <Styles.TokenSelectHead>
                            <Styles.TokenSelectRow>
                                <Styles.HeaderCell>Token</Styles.HeaderCell>
                                <Styles.HeaderCell>Escrow</Styles.HeaderCell>
                                <Styles.HeaderCell>Wallet</Styles.HeaderCell>
                            </Styles.TokenSelectRow>
                        </Styles.TokenSelectHead>
                        <Styles.TokenSelectBody>
                            {tokens.map((token) => (
                                <Styles.TokenSelectRow key={token.symbol}>
                                    <Styles.TokenSelectCell hasLogo>
                                        <Logo
                                            className="inline"
                                            size="md"
                                            ticker={tokenSymbolToLogoTicker(token.symbol)}
                                        />
                                        {token.symbol}+{token.pool.quoteTokenSymbol}-01
                                    </Styles.TokenSelectCell>
                                    <Styles.TokenSelectCell hasBalance={token.escrowBalance.toNumber() > 0}>
                                        {token.escrowBalance.toNumber() > 0 ? (
                                            <>
                                                {token.escrowBalance?.toFixed(2)}
                                                <span>Tokens</span>
                                            </>
                                        ) : (
                                            '0.00'
                                        )}
                                    </Styles.TokenSelectCell>
                                    <Styles.TokenSelectCell hasBalance={token.balance.toNumber() > 0}>
                                        {token.balance.toNumber() > 0 ? (
                                            <>
                                                {token.balance.toNumber().toFixed(2)}
                                                <span>Tokens</span>
                                            </>
                                        ) : (
                                            '0.00'
                                        )}
                                    </Styles.TokenSelectCell>
                                </Styles.TokenSelectRow>
                            ))}
                        </Styles.TokenSelectBody>
                    </Styles.TokenSelectTable>
                </Styles.TokenSelectBox>
            </Styles.TokenSelectDropdown>
        </>
    );
};

export default TokenSelect;
