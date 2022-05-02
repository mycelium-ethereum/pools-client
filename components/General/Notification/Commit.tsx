import React from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { OverviewPageFocus } from '~/archetypes/Portfolio/state';
import TimeLeft from '~/components/TimeLeft';
import { CommitProps } from '~/store/TransactionSlice/types';
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
            className="flex cursor-pointer items-center"
            onClick={() =>
                watchAsset(provider as ethers.providers.JsonRpcProvider, {
                    address: poolAddress,
                    decimals: settlementTokenDecimals,
                    symbol: tokenSymbol,
                })
            }
        >
            <span className="flex">
                Add <Logo className="mx-1" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
                {tokenSymbol} to wallet
            </span>
        </div>
    </Notification>
);

export const CommitSuccessNotification = ({ expectedExecution, commitType, tokenSymbol }: CommitProps): JSX.Element => {
    const router = useRouter();

    const handleClick = () =>
        router.push({
            pathname: '/portfolio',
            query: {
                focus: OverviewPageFocus.Queued,
            },
        });

    return (
        <Notification title="Order Submitted" toastProps={{ type: 'success' }}>
            <div className="whitespace-nowrap">
                {commitType === 'mint' || commitType === 'flip' ? (
                    <div className="mb-2 flex items-center">
                        <Logo className="mr-2" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
                        <div>{tokenSymbol} ready to claim in</div>
                        <TimeLeft
                            className="ml-2 rounded border bg-gray-50 px-3 py-1 dark:bg-cool-gray-800"
                            targetTime={expectedExecution}
                        />
                    </div>
                ) : (
                    <div className="mb-2 flex items-center">
                        <div>USDC ready to claim in</div>
                        <TimeLeft
                            className="ml-2 rounded border bg-gray-50 px-3 py-1 dark:bg-cool-gray-800"
                            targetTime={expectedExecution}
                        />
                    </div>
                )}
                <div className="cursor-pointer text-tracer-400 underline" onClick={() => handleClick()}>
                    View order
                </div>
            </div>
        </Notification>
    );
};
