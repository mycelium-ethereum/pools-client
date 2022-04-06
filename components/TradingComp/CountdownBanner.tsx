import React from 'react';
import CountdownBar from '~/components/TradingComp/CountdownBar';
import PrizePoolInfoBox from '~/components/TradingComp/PrizePoolInfoBox';

const CountdownBanner: React.FC = () => {
    const moneyStyles = 'font-bold text-xl leading-[150%] sm:text-[32px] sm:leading-[48px]';
    const statStyles = 'block font-semibold text-xs leading-[18px]';

    return (
        <div className="transition-border relative mr-4 w-[calc(100%+32px)] -translate-x-4 transform font-aileron duration-300 sm:w-full sm:translate-x-0 sm:rounded-lg">
            <img
                src="/img/trading-comp/trading-comp-banner.png"
                className="absolute z-0 h-full w-full object-cover sm:rounded-lg"
            />
            <div className="relative z-10 flex h-[304px] flex-grow flex-col sm:h-full sm:min-h-[382px]">
                <div className="flex h-full flex-grow flex-col justify-center px-5">
                    <span className="block text-base font-semibold text-purple-100">Perpetual Pools V2</span>
                    <span className="block">
                        <span className="text-[32px] text-purple-50">Trading</span>{' '}
                        <span className="text-[32px] font-bold text-white">Competition</span>
                    </span>
                </div>
                <div>
                    <div className="mb-2 px-5">
                        <div className="flex items-center">
                            <span className="block text-sm font-semibold leading-[18px] text-purple-100">
                                Prize Pool
                            </span>
                            <PrizePoolInfoBox />
                        </div>
                        <div className="flex text-white">
                            <div className="mr-8">
                                <span className={moneyStyles}>$20,000</span>
                                <span className={statStyles}>Trading Compeition</span>
                            </div>
                            <div className="mr-8">
                                <span className={moneyStyles}>$5,000</span>
                                <span className={statStyles}>UX Feedback</span>
                            </div>
                            <div className="mr-8">
                                <span className={moneyStyles}>$1,000,000</span>
                                <span className={statStyles}>Bug Bounty</span>
                            </div>
                        </div>
                    </div>
                </div>
                <CountdownBar />
            </div>
        </div>
    );
};

export default CountdownBanner;
