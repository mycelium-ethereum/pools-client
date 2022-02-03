import React, { Fragment } from 'react';
import { Logo, LogoTicker } from '@components/General';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { ArbiscanEnum, openArbiscan, watchAsset } from '@libs/utils/rpcMethods';
import { Popover, Transition } from '@headlessui/react';
import { ARBITRUM } from '@libs/constants';
import { KnownNetwork } from '@tracer-protocol/pools-js';

// const Actions
export default (({ provider, token, arbiscanTarget, otherActions }) => (
    <>
        <Popover as="div" className="inline relative ml-2 my-auto">
            {({ open }) => (
                <>
                    {/* Button */}
                    <Popover.Button className={'focus:border-none focus:outline-none mb-3'}>
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
                        <Popover.Panel className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-theme-background ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-theme-border">
                            <div>
                                <div
                                    className="flex cursor-pointer text-sm items-center p-2 hover:bg-theme-button-bg-hover"
                                    onClick={() => watchAsset(provider, token)}
                                >
                                    <PlusOutlined className="relative inline mr-2 h-[12px]" />
                                    Add token to wallet
                                </div>
                                {arbiscanTarget ? (
                                    <div
                                        className="flex cursor-pointer text-sm items-center p-2 hover:bg-theme-button-bg-hover"
                                        onClick={() =>
                                            openArbiscan(
                                                arbiscanTarget.type,
                                                arbiscanTarget.target,
                                                provider?.network?.chainId?.toString() as KnownNetwork,
                                            )
                                        }
                                    >
                                        <Logo className="relative inline mr-2" ticker={ARBITRUM} />
                                        View on Arbiscan
                                    </div>
                                ) : null}
                                {otherActions
                                    ? otherActions.map((action) => (
                                          <div
                                              key={action.text}
                                              className="flex cursor-pointer text-sm items-center p-2 hover:bg-theme-button-bg-hover"
                                              onClick={() =>
                                                  openArbiscan(
                                                      action.type,
                                                      action.target,
                                                      provider?.network?.chainId?.toString() as KnownNetwork,
                                                  )
                                              }
                                          >
                                              <Logo className="relative inline mr-2" ticker={action.logo} />
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
