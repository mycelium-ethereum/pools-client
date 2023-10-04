import React from 'react';
import { ethers } from 'ethers';
import { SideEnum } from '@tracer-protocol/pools-js';
import SlimButton from '~/components/General/Button/SlimButton';
import { TableRow } from '~/components/General/TWTable';
import { PoolStatusBadge, PoolStatusBadgeContainer } from '~/components/PoolStatusBadge';
import { PoolsV1TokenRowActions, PoolsV1TokenRowProps } from '~/types/poolsV1Tokens';
import { Market } from '../Market';
import { ActionsCell } from '../OverviewTable/styles';
import { OverviewTableRowCell } from '../OverviewTable/styles';
import { TokensNotional } from '../Tokens';
import { PoolStatus } from '~/types/pools';

export const PoolsV1TokenRow: React.FC<PoolsV1TokenRowProps & PoolsV1TokenRowActions> = ({
    symbol,
    settlementTokenSymbol,
    side,
    balance,
    decimals,
    currentTokenPrice,
    onClickV1BurnAll,
    poolCommitterAddress,
    commitType,
    tokenName,
    address,
    settlementTokenName,
}) => {
    return (
        <TableRow lined>
            <OverviewTableRowCell>
                <PoolStatusBadgeContainer>
                    <Market tokenSymbol={symbol} isLong={side === SideEnum.long} />
                    <div className="ml-2">
                        <PoolStatusBadge status={PoolStatus.Live} text='V1' />
                    </div>
                </PoolStatusBadgeContainer>
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokensNotional
                    approximate
                    amount={balance}
                    price={currentTokenPrice}
                    settlementTokenSymbol={settlementTokenSymbol}
                />
            </OverviewTableRowCell>
            <ActionsCell>
                <SlimButton
                    disabled={!balance.toNumber()}
                    onClick={() => onClickV1BurnAll(
                        poolCommitterAddress, 
                        commitType, 
                        ethers.utils.parseUnits(balance.toString(), decimals).toString(),
                        tokenName,
                        address,
                        settlementTokenName
                    )}
                    content={<>BURN ALL</>}
                />
            </ActionsCell>
        </TableRow>
    );
};

export default PoolsV1TokenRow;
