import React, { useMemo } from 'react';
import styled from 'styled-components';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { TWModal } from '~/components/General/TWModal';
import { Table, TableRow, TableRowCell } from '~/components/General/TWTable';
import { usePool } from '~/hooks/usePool';
import { Theme } from '~/store/ThemeSlice/themes';

import FollowLink from '/public/img/general/follow-link.svg';
import Close from '/public/img/general/close.svg';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { OracleDetails } from '~/types/pools';
import { constructExplorerLink } from '~/utils/blockExplorers';
import { formatAddress, formatSeconds } from '~/utils/converters';
import { getPriceFeedUrl } from '~/utils/poolNames';
import { formatFees } from '~/utils/converters';
import { generateOracleTypeSummary } from '~/utils/pools';

type Details = {
    name: string;
    address: string;
    marketSymbol: string;
    leverage: string;
    keeper: string;
    committer: string;
    collateralAsset: string;
    collateralAssetAddress: string;
    oracleDetails: OracleDetails;
};

export const PoolDetails = ({
    open,
    onClose,
    poolDetails,
    network,
}: {
    open: boolean;
    onClose: () => void;
    poolDetails: Details;
    network: KnownNetwork | undefined;
}): JSX.Element => {
    const {
        name,
        address,
        marketSymbol,
        leverage,
        keeper,
        committer,
        collateralAsset,
        collateralAssetAddress,
        oracleDetails,
    } = poolDetails;

    const poolInfo = usePool(address);
    const { poolInstance: pool } = poolInfo;

    const poolDetailsData = useMemo(
        () => [
            { name: 'Pool Ticker', value: name },
            {
                name: 'Pool Address',
                value: formatAddress(address),
                href: constructExplorerLink(BlockExplorerAddressType.address, address, network),
            },
            {
                name: 'Price Feed',
                value: marketSymbol,
                href: getPriceFeedUrl(marketSymbol),
            },
            {
                name: 'Power Leverage',
                value: leverage,
            },
            {
                name: 'Collateral Asset',
                value: collateralAsset,
                href: constructExplorerLink(BlockExplorerAddressType.token, collateralAssetAddress, network),
            },
            {
                name: 'Pool Committer',
                value: formatAddress(committer),
                href: constructExplorerLink(BlockExplorerAddressType.address, committer, network),
            },
            {
                name: 'Keeper Contract',
                value: formatAddress(keeper),
                href: constructExplorerLink(BlockExplorerAddressType.address, keeper, network),
            },
        ],
        [network, keeper, committer, leverage, name, collateralAsset],
    );

    const poolParametersData = useMemo(
        () => [
            { name: 'Oracle type', value: generateOracleTypeSummary(poolInfo) },
            ...(oracleDetails?.type === 'SMA'
                ? [
                      { name: 'SMA Periods', value: oracleDetails?.numPeriods ? oracleDetails?.numPeriods : 0 },
                      {
                          name: 'SMA Total Length',
                          value:
                              oracleDetails?.updateInterval && oracleDetails?.numPeriods
                                  ? formatSeconds(oracleDetails?.updateInterval * oracleDetails?.numPeriods)
                                  : 0,
                      },
                  ]
                : []),
            ,
            {
                name: 'Rebalance Frequency',
                value: pool?.oracle.updateInterval ? formatSeconds(pool?.oracle.updateInterval) : 0,
            },
            {
                name: 'Front-Running Interval',
                value: pool?.frontRunningInterval ? formatSeconds(pool?.frontRunningInterval.toNumber()) : 0,
            },
            { name: 'Mint Fee', value: pool.committer.mintingFee ? formatFees(pool.committer.mintingFee) : '0%' },
            { name: 'Burn Fee', value: pool.committer.burningFee ? formatFees(pool.committer.burningFee) : '0%' },
        ],
        [pool, oracleDetails],
    );

    return (
        <TWModal open={open} onClose={onClose} className="py-10 px-5 sm:p-10">
            <ModalHeaderContainer>
                <ModalHeader>Pool Details</ModalHeader>
                <button aria-label="close-button" onClick={onClose}>
                    <Close />
                </button>
            </ModalHeaderContainer>

            <Table showDivider={false}>
                <tbody>
                    {poolDetailsData.map((v, i) => (
                        <TableRow key={`${v.name}-${i}`} lined>
                            <TableRowCell className="px-2">
                                <CellContent>
                                    <div className="name">{v.name}</div>
                                    <div className="info">
                                        {v.value}
                                        {v.href ? (
                                            <a href={v.href} target="_blank" rel="noopener noreferrer">
                                                <FollowLinkIcon />
                                            </a>
                                        ) : null}
                                    </div>
                                </CellContent>
                            </TableRowCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            <br />
            <ModalHeader>Parameters</ModalHeader>
            <Table showDivider={false}>
                <tbody>
                    {poolParametersData.map((v, i) => (
                        <TableRow key={`${v.name}-${i}`} lined>
                            <TableRowCell className="px-2">
                                <CellContent>
                                    <div className="name">{v.name}</div>
                                    <div className="info">{v.value}</div>
                                </CellContent>
                            </TableRowCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TWModal>
    );
};

const ModalHeader = styled.h1`
    font-size: 24px;
    margin-bottom: 10px;
    font-weight: 600;
    color: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return '#374151';
            default:
                return '#fff';
        }
    }};
`;

const ModalHeaderContainer = styled((props: any) => <div className={props.className}>{props.children}</div>)`
    display: flex;
    justify-content: space-between;

    button[aria-label='close-button'] {
        width: 12px;
        height: 12px;

        :hover {
            cursor: pointer;
        }
    }
`;

const FollowLinkIcon = styled(FollowLink)`
    margin-left: 15px;

    path {
        stroke: ${({ theme }) => {
            switch (theme.theme) {
                case Theme.Light:
                    return '#374151';
                default:
                    return '#fff';
            }
        }};
    }
`;

const CellContent = styled((props: any) => <div className={props.className}>{props.children}</div>)`
    display: flex;

    .name {
        width: 150px;
        @media (min-width: 768px) {
            width: 195px;
        }
    }

    .info {
        display: flex;
        align-items: center;
    }
`;

export default PoolDetails;
