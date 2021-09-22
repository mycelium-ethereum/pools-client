import React, { Fragment } from 'react';
import { Logo } from '@components/General';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import { ArbiscanEnum, openArbiscan, watchAsset } from '@libs/utils/rpcMethods';
import { Popover, Transition } from '@headlessui/react';

// const Actions
export default (({ provider, token, arbiscanTarget }) => (
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
                        <Popover.Panel className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
                            <div>
                                <div
                                    className="flex cursor-pointer text-sm items-center p-2 hover:bg-tracer-50"
                                    onClick={() => watchAsset(provider, token)}
                                >
                                    <PlusOutlined className="relative inline mr-2 h-[12px]" />
                                    Add token to wallet
                                </div>
                                <div
                                    className="flex cursor-pointer text-sm items-center p-2 hover:bg-tracer-50"
                                    onClick={() => openArbiscan(arbiscanTarget.type, arbiscanTarget.target)}
                                >
                                    <Logo className="relative inline mr-2 w-[18px]" ticker={'ETHERSCAN'} />
                                    View on Etherscan
                                </div>
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
    arbiscanTarget: {
        type: ArbiscanEnum;
        target: string;
    };
}>;
