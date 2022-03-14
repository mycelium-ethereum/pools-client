import React from 'react';
import { TWModal } from '@components/General/TWModal';
import { Table, TableRow, TableRowCell } from '@components/General/TWTable';
import styled from 'styled-components';
import { getPriceFeedUrl } from '@libs/utils/converters';

import FollowLink from '/public/img/general/follow-link.svg';
import Close from '/public/img/general/close.svg';

type PoolProps = {
    name: string;
    leverage: string;
    keeper: string;
    committer: string;
    collateralAsset: string;
    collateralAssetAddress: string;
};

export default (({ open, onClose, poolDetails, previewUrl, isDark }) => {
    const { name, leverage, keeper, committer, collateralAsset, collateralAssetAddress } = poolDetails || {};

    const formatAddress = (addr: string) => `${addr?.slice(0, 4)}...${addr?.slice(40, 42)}`;

    const getContractDetailsUrl = (v: string) => {
        const BASE_URL = `${previewUrl}address/${v}` || 'https://arbiscan.io/address/';
        return v ? BASE_URL : 'https://arbiscan.io';
    };

    const poolDetailsData = [
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
            href: getContractDetailsUrl(collateralAssetAddress),
        },
        {
            name: 'Deployer',
            value: formatAddress(committer),
            href: getContractDetailsUrl(committer),
        },
        {
            name: 'Keeper Contract',
            value: formatAddress(keeper),
            href: getContractDetailsUrl(keeper),
        },
    ];

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
                {poolDetailsData.map((v, i) => (
                    <TableRow key={`${v.name}-${i}`} lined>
                        <TableRowCell className="px-2">
                            <CellContent>
                                <div className="name">{v.name}</div>
                                <div className="info">
                                    {v.value}
                                    {v.href ? (
                                        <a href={v.href} target="_blank" rel="noopener noreferrer">
                                            <FollowLinkIcon isDark={isDark} />
                                        </a>
                                    ) : null}
                                </div>
                            </CellContent>
                        </TableRowCell>
                    </TableRow>
                ))}
            </Table>
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => void;
    poolDetails: PoolProps;
    previewUrl: string;
    isDark: boolean;
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
        stroke: ${(props) => (props.isDark ? '#ffffff' : '#374151')};
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
