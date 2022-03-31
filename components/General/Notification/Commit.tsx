import React from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import TimeLeft from '~/components/TimeLeft';
import { CommitProps } from '@store/TransactionSlice/types';
import { watchAsset } from '~/utils/rpcMethods';
import { Logo, tokenSymbolToLogoTicker } from '..';
import { Notification } from '.';

export const CommitPendingNotification = ({
    tokenSymbol,
    provider,
    poolAddress,
    settlementTokenDecimals,
}: CommitProps): JSX.Element => (
    <Notification title={'Submitting Order'}>
        <div
            className="flex items-center cursor-pointer"
            onClick={() =>
                watchAsset(provider as ethers.providers.JsonRpcProvider, {
                    address: poolAddress,
                    decimals: settlementTokenDecimals,
                    symbol: tokenSymbol,
                })
            }
        >
            <Logo className="mr-2" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
            <div>Add to wallet</div>
        </div>
    </Notification>
);

export const CommitSuccessNotification = ({ nextRebalance, commitType, tokenSymbol }: CommitProps): JSX.Element => {
    const router = useRouter();

    const handleClick = (focus: 'mint' | 'burn' | 'flip') =>
        router.push({
            pathname: '/portfolio/commits',
            query: {
                focus: focus,
            },
        });

    return (
        <Notification title="Order Submitted" toastProps={{ type: 'success' }}>
            <div className="whitespace-nowrap">
                {commitType === 'mint' || commitType === 'flip' ? (
                    <div className="flex items-center mb-2">
                        <Logo className="mr-2" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
                        <div>{tokenSymbol} ready to claim in</div>
                        <TimeLeft
                            className="ml-2 px-3 py-1 border rounded bg-gray-50 dark:bg-cool-gray-800"
                            targetTime={nextRebalance ?? 0}
                        />
                    </div>
                ) : (
                    <div className="flex items-center mb-2">
                        <div>USDC ready to claim in</div>
                        <TimeLeft
                            className="ml-2 px-3 py-1 border rounded bg-gray-50 dark:bg-cool-gray-800"
                            targetTime={nextRebalance ?? 0}
                        />
                    </div>
                )}
                <div
                    className="text-tracer-400 underline cursor-pointer"
                    onClick={() => handleClick(commitType ?? 'mint')}
                >
                    View order
                </div>
            </div>
        </Notification>
    );
};
