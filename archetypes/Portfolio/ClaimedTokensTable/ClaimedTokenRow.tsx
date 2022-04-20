import React from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import UpOrDown from '~/components/UpOrDown';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { toApproxCurrency } from '~/utils/converters';
import { ActionsCell } from '../OverviewTable/styles';
import { DenotedInEnum, TokenRowProps } from '../state';

export const ClaimedTokenRow: React.FC<
    TokenRowProps & {
        onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
        provider: ethers.providers.JsonRpcProvider | null;
        denotedIn: DenotedInEnum;
    }
> = ({
    symbol,
    name,
    address,
    poolAddress,
    decimals,
    side,
    holdings,
    provider,
    onClickCommitAction,
    oraclePrice,
    denotedIn,
    notionalValue,
    acquisitionCost,
    pnl,
}) => {
    const BaseNumDenote = (notionalValue: BigNumber, oraclePrice: BigNumber, name: string, leverage?: number) => {
        if (notionalValue.eq(0)) {
            return notionalValue.toFixed(2);
        } else if (name.split('-')[1].split('/')[0] === 'BTC') {
            return leverage
                ? ((notionalValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(8)
                : (notionalValue.toNumber() / oraclePrice.toNumber()).toFixed(8);
        } else if (name.split('-')[1].split('/')[0] === 'ETH') {
            return leverage
                ? ((notionalValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(6)
                : (notionalValue.toNumber() / oraclePrice.toNumber()).toFixed(6);
        }
    };

    const NotionalDenote = (notionalValue: BigNumber, leverage?: number) => {
        return leverage ? toApproxCurrency(notionalValue.toNumber() * leverage) : toApproxCurrency(notionalValue);
    };

    return (
        <TableRow lined>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(symbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div className="flex">
                            <div>
                                {symbol.split('-')[0][0]}-
                                {symbol.split('-')[1].split('/')[0] === 'BTC' ? 'Bitcoin' : 'Ethereum'}
                            </div>
                            &nbsp;
                            <div className={`${side === SideEnum.long ? 'green' : 'red'}`}>
                                {side === SideEnum.long ? 'Long' : 'Short'}
                            </div>
                        </div>
                        <div className="text-cool-gray-500">{name} </div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>
                    {
                        denotedIn === DenotedInEnum.BASE ? (
                            <>
                                {BaseNumDenote(notionalValue, oraclePrice, name)} {name.split('-')[1].split('/')[0]}
                            </>
                        ) : (
                            `${toApproxCurrency(notionalValue)} USD`
                        )
                        // TODO the above notionalValue is fine for stable coins but needs a conversion
                        //  rate for anything that is not 1/1 with USD
                    }
                </div>
                <div className="opacity-80">{holdings.toFixed(2)} tokens</div>
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(acquisitionCost)}</TableRowCell>
            <TableRowCell>
                <UpOrDown
                    oldValue={0}
                    newValue={pnl}
                    deltaDenotation={DeltaEnum.Numeric}
                    currency={'USD'}
                    showCurrencyTicker={true}
                />
            </TableRowCell>
            <TableRowCell>
                {denotedIn === DenotedInEnum.BASE ? (
                    <>
                        {BaseNumDenote(notionalValue, oraclePrice, name, parseInt(name.split('-')[0][0]))}{' '}
                        {name.split('-')[1].split('/')[0]}
                    </>
                ) : (
                    `${NotionalDenote(notionalValue, parseInt(name.split('-')[0][0]))} USD`
                )}
            </TableRowCell>
            <ActionsCell>
                <Button
                    className="mx-1 my-auto w-[70px] border-0 py-2 uppercase"
                    size="xs"
                    variant="primary-light"
                    disabled={!notionalValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                >
                    Burn
                </Button>
                <Button
                    className="mx-1 my-auto w-[70px] border-0 py-2 uppercase"
                    size="xs"
                    variant="primary-light"
                    disabled={!notionalValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip)}
                >
                    Flip
                </Button>
                <Actions
                    token={{
                        address,
                        symbol,
                        decimals,
                    }}
                    provider={provider}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.token,
                        target: address,
                    }}
                />
            </ActionsCell>
        </TableRow>
    );
};

export default ClaimedTokenRow;
