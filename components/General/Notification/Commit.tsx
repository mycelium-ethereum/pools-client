import React from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { OverviewPageFocus } from '~/archetypes/Portfolio/state';
import { CommitProps } from '~/store/TransactionSlice/types';
import { watchAsset } from '~/utils/rpcMethods';
import * as Styles from './styles';
import { Logo, tokenSymbolToLogoTicker } from '..';
import { Notification } from '.';

export const CommitPendingNotification = ({
    tokenSymbol,
    provider,
    poolAddress,
    settlementTokenDecimals,
}: CommitProps): JSX.Element => (
    <Notification title={'Submitting Order'}>
        <Styles.CommitPendingContent
            onClick={() =>
                watchAsset(provider as ethers.providers.JsonRpcProvider, {
                    address: poolAddress,
                    decimals: settlementTokenDecimals,
                    symbol: tokenSymbol,
                })
            }
        >
            <span>
                Add <Logo className="mx-1" size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
                {tokenSymbol} to wallet
            </span>
        </Styles.CommitPendingContent>
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
            <div className="">
                {commitType === 'mint' || commitType === 'flip' ? (
                    <Styles.CommitContent>
                        <Styles.Logo size="md" ticker={tokenSymbolToLogoTicker(tokenSymbol)} />
                        <div>{tokenSymbol} ready to claim in</div>
                        <Styles.TimeLeft
                            // className="ml-2 rounded border bg-gray-50 px-3 py-1 dark:bg-cool-gray-800"
                            targetTime={expectedExecution}
                        />
                    </Styles.CommitContent>
                ) : (
                    <Styles.CommitContent>
                        <div>USDC ready to claim in</div>
                        <Styles.TimeLeft
                            // className="ml-2 rounded border bg-gray-50 px-3 py-1 dark:bg-cool-gray-800"
                            targetTime={expectedExecution}
                        />
                    </Styles.CommitContent>
                )}
                <Styles.ViewOrder onClick={() => handleClick()}>View order</Styles.ViewOrder>
            </div>
        </Notification>
    );
};
