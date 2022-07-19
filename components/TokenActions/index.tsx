import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Popover } from 'react-tiny-popover';
import shallow from 'zustand/shallow';
import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import CloseIcon from '~/public/img/general/close.svg';
import More from '~/public/img/general/more.svg';
import { useStore } from '~/store/main';
import { selectRemovePool } from '~/store/PoolsSlice';
import { selectProvider } from '~/store/Web3Slice';
import { selectWeb3Info } from '~/store/Web3Slice';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { constructBalancerLink } from '~/utils/balancer';
import { openBlockExplorer } from '~/utils/blockExplorers';
import { removeImportedPool } from '~/utils/pools';
import { watchAsset } from '~/utils/rpcMethods';

export const TokenActions = ({
    poolAddress,
    token,
    arbiscanTarget,
    otherActions,
    isImported,
}: {
    poolAddress?: string;
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
    isImported?: boolean;
}): JSX.Element => {
    const removePool = useStore(selectRemovePool);
    const { network } = useStore(selectWeb3Info, shallow);
    const provider = useStore(selectProvider);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const buttonStyles = 'flex cursor-pointer items-center p-2 text-sm hover:bg-theme-button-bg-hover w-full';

    return (
        <Popover
            isOpen={isOpen}
            align="end"
            positions={['bottom']}
            onClickOutside={() => setIsOpen(false)}
            content={
                <div onClick={() => setIsOpen(!isOpen)}>
                    <div className="focus:outline-none z-10 mt-2 w-[180px] origin-top-right divide-y divide-theme-border overflow-hidden rounded-lg bg-theme-background shadow-lg ring-1 ring-black ring-opacity-5">
                        <button className={buttonStyles} onClick={() => watchAsset(provider, token)}>
                            <PlusOutlined className="relative ml-1 mr-[11px] inline h-[12px]" />
                            Add token to wallet
                        </button>
                        {network === NETWORKS.ARBITRUM && (
                            <button
                                className={buttonStyles}
                                onClick={() =>
                                    open(constructBalancerLink(token.address, NETWORKS.ARBITRUM, true), 'blank')
                                }
                            >
                                <Logo className="relative mr-2 inline" ticker={'BALANCER'} />
                                Trade on Balancer
                            </button>
                        )}
                        {arbiscanTarget ? (
                            <button
                                className={buttonStyles}
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
                            </button>
                        ) : null}
                        {otherActions
                            ? otherActions.map((action) => (
                                  <button
                                      key={action.text}
                                      className={buttonStyles}
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
                                  </button>
                              ))
                            : null}
                        {isImported && poolAddress ? (
                            <button
                                className={buttonStyles}
                                onClick={() => removeImportedPool(network as KnownNetwork, poolAddress, removePool)}
                            >
                                <CloseIcon className="ml-[1px] mr-2 h-4 w-4" />
                                Remove Pool from view
                            </button>
                        ) : null}
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
