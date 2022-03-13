import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as Styles from './styles';
import { TokenRow } from '@libs/hooks/usePoolTokens';
import { tokenSymbolToLogoTicker } from '@components/General';
import { Pool } from '@tracer-protocol/pools-js';

const TokenSelect: React.FC<{
    tokens: TokenRow[];
    selectedToken: Pool['longToken'] | Pool['shortToken'];
    setToken: (pool: string, side: number) => void;
}> = ({ tokens, selectedToken, setToken }) => {
    const [show, setShow] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const searchInput = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (show) {
            setShow(false);
        } else {
            // open
            setShow(true);
        }
    };

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.addEventListener('blur', () => {
                // close
                setShow(false);
            });
        }
    }, [searchInput.current]);

    useEffect(() => {
        if (show) {
            // if open then set the focus of the input
            searchInput.current?.focus();
        }
    }, [show]);

    const searchFilter = (token: TokenRow): boolean => {
        const searchString = filter.toLowerCase();
        const extendedTokenName = `${token.symbol}+${token.pool.quoteTokenSymbol}`.toLowerCase();
        return Boolean(extendedTokenName.match(searchString));
    };

    const filteredTokens = useMemo(() => tokens.filter(searchFilter), [filter, tokens]);

    return (
        <>
            <Styles.SearchWrap onClick={() => handleClick()}>
                <Styles.IconWrap>{show ? <Styles.SearchIcon /> : <Styles.DownArrow />}</Styles.IconWrap>
                <Styles.SelectedToken show={!show}>
                    <Styles.TokenLogo ticker={tokenSymbolToLogoTicker(selectedToken.symbol)} />
                    {selectedToken.symbol}
                </Styles.SelectedToken>
                <Styles.TokenSearch
                    ref={searchInput}
                    show={show}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </Styles.SearchWrap>
            <Styles.TokenSelectDropdown defaultHeight={0} open={show}>
                <Styles.TokenSelectBox>
                    <Styles.TokenSelectTable>
                        <Styles.TokenSelectHead>
                            <Styles.TokenSelectRow header>
                                <Styles.HeaderCell>Token</Styles.HeaderCell>
                                <Styles.HeaderCell>Escrow</Styles.HeaderCell>
                                <Styles.HeaderCell>Wallet</Styles.HeaderCell>
                            </Styles.TokenSelectRow>
                        </Styles.TokenSelectHead>
                        <Styles.TokenSelectBody>
                            {filteredTokens.map((token) => (
                                <Styles.TokenSelectRow
                                    key={token.symbol}
                                    onClick={() => setToken(token.pool.address, token.side)}
                                >
                                    <Styles.TokenSelectCell hasLogo>
                                        <Styles.TokenLogo size="md" ticker={tokenSymbolToLogoTicker(token.symbol)} />
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
