import React, { useEffect } from 'react';
import TwitterShareButton from '~/components/General/Button/TwitterShareButton';
import { useStore } from '~/store/main';
import { selectOnboardActions } from '~/store/Web3Slice';
import { convertCurrency, convertShortDate } from '~/utils/converters';
import ConnectWalletButton from './ConnectWalletButton';
import TracerDiscordButton from './TracerDiscordButton';

const StatisticsBox: React.FC<{
    account: string | undefined;
    username: string;
    rank?: string;
    accountValue: string;
    entryDate: number;
    participating: boolean;
}> = ({
    account,
    username,
    rank,
    accountValue,
    entryDate,
    participating,
}: {
    account: string | undefined;
    username: string;
    rank?: string;
    accountValue: string;
    entryDate: number;
    participating: boolean;
}) => {
    const [url, setUrl] = React.useState('');
    const { handleConnect } = useStore(selectOnboardActions);

    useEffect(() => {
        setUrl(window.location.href);
        console.log(account);
    }, []);

    return (
        <div className="w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-purple-300 dark:bg-opacity-10 sm:h-full sm:min-h-[189px]">
            <div className="flex h-full flex-col justify-evenly">
                <div className="mb-2.5 flex w-full justify-between sm:items-center">
                    <span className="flex h-5 w-[113px] items-center justify-center rounded-[3px] bg-purple-300 text-xs text-white">
                        YOUR STATISTICS
                    </span>
                    {account && (
                        <div className="flex flex-col items-end sm:flex-row sm:items-center">
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-cool-gray-900 dark:text-white">{username}</span>
                            </div>
                        </div>
                    )}
                </div>
                {account ? (
                    <>
                        {/* If logged in and participating */}
                        {participating ? (
                            <div className="flex items-end sm:flex-col sm:items-start">
                                <div className="flex flex-wrap font-inter text-cool-gray-800 dark:text-white">
                                    <div className="mr-6 mb-2 sm:mb-0">
                                        <div className="flex items-end font-bold">
                                            <span className="mr-0.5 inline-block text-base">#</span>
                                            <span className="text-[32px] leading-[1]">{rank}</span>
                                        </div>
                                        <span className="ml-2 block text-sm font-semibold">Rank</span>
                                    </div>
                                    <div className="mr-6 mb-2 sm:mb-0">
                                        <div className="flex items-end font-bold">
                                            <span className="mr-0.5 inline-block text-base">$</span>
                                            <span className="text-[32px] leading-[1]">
                                                {convertCurrency(accountValue)}
                                            </span>
                                        </div>
                                        <span className="ml-2 block text-sm font-semibold">Portfolio Value</span>
                                    </div>
                                    <div>
                                        <div className="flex items-end font-bold">
                                            <span className="text-[32px] leading-[1]">
                                                {convertShortDate(entryDate)}
                                            </span>
                                        </div>
                                        <span className="block text-sm font-semibold">Entry Date</span>
                                    </div>
                                </div>
                                <TwitterShareButton className="mt-2.5 ml-6 sm:ml-0" url={url} />
                            </div>
                        ) : (
                            <>
                                {/* If logged in but not signed up to participate yet */}
                                <div className="mx-auto w-full max-w-[318px] text-center">
                                    <p className="text-xs font-semibold">
                                        To participate in the competition, start by joining the Tracer Discord. Navigate
                                        to the “start-here” channel under ‘V2 TESTNET &amp; TRADING COMP’ for
                                        step-by-step instructions on how to claim testnet tokens (PPUSD) and testnet ETH
                                    </p>
                                    <TracerDiscordButton url="https://discord.gg/nNEj4ueX" />
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {/* If not logged in yet */}
                        <div className="mx-auto w-full text-center">
                            <p className="font-semibold">To view your Statistics please</p>
                            <ConnectWalletButton handleConnect={handleConnect} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StatisticsBox;
