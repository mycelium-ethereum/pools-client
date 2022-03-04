import React, { useState } from 'react'
import Button from '@components/General/Button';
import * as Styles from './styles';
import { Table, TableHeaderCell, TableHeader, TableRowCell } from '@components/General/TWTable';
import {TokenLocation} from './types';


const TokenSelect: React.FC<{
    tokens: any[]
}> = ({ tokens }) => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => setShow(!show)}>
                Select Token
            </Button>
            <Styles.TokenSelectDropdown defaultHeight={0} open={show}>
                <Styles.TokenSelectBox>
                    <Table>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Holding</TableHeaderCell>
                            <TableHeaderCell>Expected Token Price</TableHeaderCell>
                            <TableHeaderCell>Token Valuation</TableHeaderCell>
                            <TableHeaderCell>Location</TableHeaderCell>
                        </TableHeader>
                        {tokens.map((token) => (
                            <Styles.TokenSelecRow>
                                <TableRowCell>{token.name}</TableRowCell>
                                <TableRowCell>450</TableRowCell>
                                <TableRowCell>$0.23</TableRowCell>
                                <TableRowCell>$104</TableRowCell>
                                <TableRowCell>{TokenLocation.Wallet}</TableRowCell>
                            </Styles.TokenSelecRow>
                        ))}
                    </Table>
                </Styles.TokenSelectBox>
            </Styles.TokenSelectDropdown>
        </>
    )
}

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
