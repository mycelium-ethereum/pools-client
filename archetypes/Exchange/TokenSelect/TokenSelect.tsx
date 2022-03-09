import React, { useState, useRef, useEffect } from 'react';
import * as Styles from './styles';
import { Table, TableHeader, TableRowCell, TableRow } from '@components/General/TWTable';
import { tokenSymbolToLogoTicker } from '@components/General';
import { tickerToName } from '@libs/utils/converters';
import { TokenRow } from '@libs/hooks/usePoolTokens';

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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <Styles.HeaderCell>Token</Styles.HeaderCell>
                                <Styles.HeaderCell>Wallet</Styles.HeaderCell>
                                <Styles.HeaderCell>Escrow</Styles.HeaderCell>
                            </TableRow>
                        </TableHeader>
                        {tokens.map((token) => (
                            <>
                                <Styles.TokenSelecRow>
                                    <TableRowCell>
                                        <Styles.LogoCell>
                                            <Styles.TokenLogo ticker={tokenSymbolToLogoTicker(token.symbol)} />
                                            <Styles.TextWrapper>
                                                <Styles.LogoText className="font-bold">
                                                    {tickerToName(token.poolName)}
                                                </Styles.LogoText>
                                                <Styles.LogoSubtext className="text-xs">
                                                    {token.poolName.split('-')[1]}
                                                </Styles.LogoSubtext>
                                            </Styles.TextWrapper>
                                        </Styles.LogoCell>
                                    </TableRowCell>
                                    <TableRowCell>{token.balance.toFixed(3)}</TableRowCell>
                                    <TableRowCell>{token.escrowBalance.toFixed(3)}</TableRowCell>
                                </Styles.TokenSelecRow>
                            </>
                        ))}
                    </Table>
                </Styles.TokenSelectBox>
            </Styles.TokenSelectDropdown>
        </>
    );
};

export default TokenSelect;
// <DropdownStyled
// variant="secondary"
// placeHolder="Select Token"
// placeHolderIcon={tokenSymbolToLogoTicker(
// side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol,
// )}
// size="lg"
// options={tokens.map((token) => ({
// key: `${token.pool}-${token.side}`,
// text: token.symbol,
// ticker: tokenSymbolToLogoTicker(token.symbol),
// }))}
// value={token.symbol}
// onSelect={(option) => {
// const [pool, side] = option.split('-');
// swapDispatch({ type: 'setSelectedPool', value: pool as string });
// swapDispatch({ type: 'setSide', value: parseInt(side) as SideEnum });
// }}
// />
