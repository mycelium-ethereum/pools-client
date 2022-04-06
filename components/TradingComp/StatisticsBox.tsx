import React from 'react';
import TwitterShareButton from '~/components/General/Button/TwitterShareButton';
import { useStore } from '~/store/main';
import { selectOnboardActions } from '~/store/Web3Slice';
import { convertCurrency, convertShortDate } from '~/utils/converters';
import ConnectWalletButton from './ConnectWalletButton';
import LearnMoreButton from './LearnMoreButton';
import TracerDiscordButton from './TracerDiscordButton';

const StatisticsBox: React.FC<{
    account: string | undefined;
    username: string;
    ranking: number;
    accountValue: string;
    entryDate: number;
    disqualified: boolean;
    participating: boolean;
}> = ({
    account,
    username,
    ranking,
    accountValue,
    entryDate,
    disqualified,
    participating,
}: {
    account: string | undefined;
    username: string;
    ranking: number;
    accountValue: string;
    entryDate: number;
    disqualified: boolean;
    participating: boolean;
}) => {
    const { handleConnect } = useStore(selectOnboardActions);

    const text = `I%27m%20currently%20ranked%20%23${ranking}%20in%20the%20%23TracerTradingComp%0A%0AYou%20can%20join%20too%20👉%20`;

    return (
        <div
            className={`w-full rounded-lg p-6 dark:bg-opacity-10 sm:h-full sm:min-h-[189px] ${
                disqualified ? 'bg-tracer-50 dark:bg-tracer-red dark:bg-opacity-10' : 'bg-[#F0F0FF] dark:bg-purple-300'
            }`}
        >
            <div className="flex h-full flex-col justify-evenly">
                <div className="mb-2.5 flex w-full justify-between sm:items-center">
                    <span
                        className={`flex h-5 w-[113px] items-center justify-center rounded-[3px] text-xs text-white ${
                            disqualified ? 'bg-tracer-red' : 'bg-purple-300'
                        }`}
                    >
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
                {!disqualified && (
                    <>
                        {account ? (
                            <>
                                {/* If logged in and participating */}
                                {participating ? (
                                    <div className="flex items-end sm:flex-col sm:items-start">
                                        <div className="flex flex-wrap font-inter text-cool-gray-800 dark:text-white">
                                            <div className="mr-6 mb-2 sm:mb-0">
                                                <div className="flex items-end font-bold">
                                                    <span className="mr-0.5 inline-block text-base">#</span>
                                                    <span className="text-[32px] leading-[1]">{ranking}</span>
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
                                                <span className="ml-2 block text-sm font-semibold">
                                                    Portfolio Value
                                                </span>
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
                                        <TwitterShareButton
                                            className="mt-2.5 ml-6 sm:ml-0"
                                            url="https://v2beta.tracer.finance/trading-comp"
                                            text={text}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* If logged in but not signed up to participate yet */}
                                        <div className="mx-auto w-full max-w-[318px] text-center">
                                            <p className="text-xs font-semibold">
                                                To participate in the competition, start by joining the Tracer Discord.
                                                Navigate to the “start-here” channel under ‘V2 TESTNET &amp; TRADING
                                                COMP’ for step-by-step instructions on how to claim testnet tokens
                                                (PPUSD) and testnet ETH
                                            </p>
                                            <TracerDiscordButton url="https://discord.gg/Ye7z5pesyh" />
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
                    </>
                )}
                {account && disqualified && (
                    <>
                        <div className="mb-8">
                            <span className="text-[32px] font-bold leading-[150%]">Disqualified</span>
                        </div>
                        <LearnMoreButton url="https://tracer.finance/radar/trading-competition" />
                    </>
                )}
            </div>
        </div>
    );
};

export default StatisticsBox;
