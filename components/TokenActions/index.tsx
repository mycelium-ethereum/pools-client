import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'react-tiny-popover';
import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import More from '~/public/img/general/more.svg';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { openBlockExplorer } from '~/utils/blockExplorers';
import { watchAsset } from '~/utils/rpcMethods';

export const TokenActions = ({
    token,
    arbiscanTarget,
    otherActions,
}: {
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
}): JSX.Element => {
    const provider = useStore(selectProvider);
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
            <div className={'cursor-pointer p-2'} onClick={() => setIsOpen(!isOpen)}>
                <More
                    className="transition"
                    style={{
                        transform: isOpen ? 'rotate(-90deg)' : '',
                    }}
                />
            </div>
        </Popover>
    );
};
export default TokenActions;
