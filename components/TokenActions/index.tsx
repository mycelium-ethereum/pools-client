import React, { Fragment } from 'react';
import { ethers } from 'ethers';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Popover, Transition } from '@headlessui/react';
import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker } from '~/components/General';
import { ArbiscanEnum, openArbiscan, watchAsset } from '~/utils/rpcMethods';

// const Actions
export default (({ provider, token, arbiscanTarget, otherActions }) => (
    <>
        <Popover as="div" className="relative my-auto ml-2 inline">
            {({ open }) => (
                <>
                    {/* Button */}
                    <Popover.Button className={'focus:outline-none mb-3 focus:border-none'}>
                        <MoreOutlined
                            className="transition"
                            style={{
                                transform: open ? 'rotate(-90deg)' : '',
                            }}
                        />
                    </Popover.Button>

                    {/* Menu */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel className="focus:outline-none absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-theme-border rounded-lg bg-theme-background shadow-lg ring-1 ring-black ring-opacity-5">
                            <div>
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
                                            openArbiscan(
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
                                                  openArbiscan(
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
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    </>
)) as React.FC<{
    provider: ethers.providers.JsonRpcProvider | null;
    token: {
        address: string;
        symbol: string;
        decimals: number;
    };
    arbiscanTarget?: {
        type: ArbiscanEnum;
        target: string;
    };
    otherActions?: {
        type: ArbiscanEnum;
        target: string;
        logo: LogoTicker;
        text: string;
    }[];
}>;
