import React, { useState } from 'react';
import { ethers } from 'ethers';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { openBlockExplorer } from '~/utils/blockExplorers';
import { watchAsset } from '~/utils/rpcMethods';

import { Popover } from 'react-tiny-popover';

export default (({ provider, token, arbiscanTarget, otherActions }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Popover
            isOpen={isOpen}
            align="end"
            positions={['bottom']}
            onClickOutside={() => setIsOpen(false)}
            content={
                <div onClick={() => setIsOpen(!isOpen)}>
                    <div className="focus:outline-none z-10 mt-2 w-56 origin-top-right divide-y divide-theme-border rounded-lg bg-theme-background shadow-lg ring-1 ring-black ring-opacity-5">
                        <div
                            className="flex cursor-pointer items-center p-2 text-sm hover:bg-theme-button-bg-hover"
                            onClick={() => watchAsset(provider, token)}
                        >
                            <PlusOutlined className="relative mr-2 inline h-[12px]" />
                            Add token to wallet
                        </div>
                        {arbiscanTarget ? (
                            <div
                                className="flex cursor-pointer items-center p-2 text-sm hover:bg-theme-button-bg-hover"
                                onClick={() =>
                                    openBlockExplorer(
                                        arbiscanTarget.type,
                                        arbiscanTarget.target,
                                        provider?.network?.chainId?.toString() as KnownNetwork,
                                    )
                                }
                            >
                                <Logo className="relative mr-2 inline" ticker={NETWORKS.ARBITRUM} />
                                View on Arbiscan
                            </div>
                        ) : null}
                        {otherActions
                            ? otherActions.map((action) => (
                                  <div
                                      key={action.text}
                                      className="flex cursor-pointer items-center p-2 text-sm hover:bg-theme-button-bg-hover"
                                      onClick={() =>
                                          openBlockExplorer(
                                              action.type,
                                              action.target,
                                              provider?.network?.chainId?.toString() as KnownNetwork,
                                          )
                                      }
                                  >
                                      <Logo className="relative mr-2 inline" ticker={action.logo} />
                                      {action.text}
                                  </div>
                              ))
                            : null}
                    </div>
                </div>
            }
        >
            <div className={'focus:outline-none mb-3 focus:border-none'} onClick={() => setIsOpen(!isOpen)}>
                <MoreOutlined
                    className="transition"
                    style={{
                        transform: isOpen ? 'rotate(-90deg)' : '',
                    }}
                />
            </div>
        </Popover>
    );
}) as React.FC<{
    provider: ethers.providers.JsonRpcProvider | null;
    token: {
        address: string;
        symbol: string;
        decimals: number;
    };
    arbiscanTarget?: {
        type: BlockExplorerAddressType;
        target: string;
    };
    otherActions?: {
        type: BlockExplorerAddressType;
        target: string;
        logo: LogoTicker;
        text: string;
    }[];
}>;
