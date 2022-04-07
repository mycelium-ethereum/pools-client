import React, { useMemo } from 'react';
import styled from 'styled-components';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { TWModal } from '~/components/General/TWModal';
import { Table, TableRow, TableRowCell } from '~/components/General/TWTable';
import { Theme } from '~/store/ThemeSlice/themes';

import FollowLink from '/public/img/general/follow-link.svg';
import Close from '/public/img/general/close.svg';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { constructExplorerLink } from '~/utils/blockExplorers';
import { getPriceFeedUrl } from '~/utils/converters';

type PoolProps = {
    name: string;
    leverage: string;
    keeper: string;
    committer: string;
    collateralAsset: string;
    collateralAssetAddress: string;
};

export default (({ open, onClose, poolDetails, network }) => {
    const { name, leverage, keeper, committer, collateralAsset, collateralAssetAddress } = poolDetails;

    const formatAddress = (addr: string) => `${addr?.slice(0, 4)}...${addr?.slice(40, 42)}`;

    const poolDetailsData = useMemo(
        () => [
            { name: 'Pool Ticker', value: name },
            {
                name: 'Price Feed',
                value: name?.split('-')[1],
                href: getPriceFeedUrl(name),
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
                name: 'Committer',
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

    return (
        <TWModal open={open} onClose={onClose} className="py-10 px-5 sm:p-10">
            <ModalHeader>
                <div className="title">Pool Details</div>
                <div className="close" onClick={onClose}>
                    <Close />
                </div>
            </ModalHeader>
            <br />

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
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => void;
    poolDetails: PoolProps;
    network: KnownNetwork | undefined;
}>;

const ModalHeader = styled((props: any) => <div className={props.className}>{props.children}</div>)`
    display: flex;
    justify-content: space-between;

    .title {
        font-size: 24px;
        margin-bottom: -17px;
    }

    .close {
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
                    '#fff';
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
