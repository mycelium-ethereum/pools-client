import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
// import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/trading-comp');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className={`container w-full pt-10`}>
                <div className="max-w-[1240px] mx-auto">
                    <div className="flex">
                        <div className="relative flex flex-col w-full flex-grow h-[382px] bg-purple-900 rounded-lg mr-4 overflow-hidden">
                            <div className="flex-grow h-full flex flex-col justify-center px-5">
                                <span className="block font-semibold text-base text-purple-100">
                                    Perpetual Pools V2
                                </span>
                                <span className="block">
                                    <span className="text-[32px] text-purple-50">Trading</span>{' '}
                                    <span className="font-bold text-[32px] text-white">Competition</span>
                                </span>
                            </div>
                            <div>
                                <div className="px-5 mb-2">
                                    <span className="block text-sm font-semibold leading-[18px] text-purple-100">
                                        Prize Pool
                                    </span>
                                    <div className="flex text-white">
                                        <div className="mr-8">
                                            <span className="font-bold text-[32px] leading-[48px]">$20,000</span>
                                            <span className="block font-semibold text-xs leading-[18px]">
                                                Trading Compeition
                                            </span>
                                        </div>
                                        <div className="mr-8">
                                            <span className="font-bold text-[32px] leading-[48px]">$5,000</span>
                                            <span className="block font-semibold text-xs leading-[18px]">
                                                UX Feedback
                                            </span>
                                        </div>
                                        <div className="mr-8">
                                            <span className="font-bold text-[32px] leading-[48px]">$500,000</span>
                                            <span className="block font-semibold text-xs leading-[18px]">
                                                Bug Bounty
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-purple-300 min-h-[36px] h-9 px-5 bg-opacity-40 text-xs flex items-center">
                                <span className="inline-block text-purple-100 mr-4">Time Left</span>
                                <span className="font-bold text-white">12 days, 3 hours, 12 Minutes, 42 Seconds</span>
                            </div>
                        </div>
                        <div className="flex min-w-[465px] flex-col justify-between">
                            <div className="min-h-[178px] w-full bg-[#F0F0FF] rounded-lg p-6 mb-4">
                                <div className="w-[380px]">
                                    <span className="mb-2.5 flex items-center justify-center h-5 w-[67px] bg-tracer-900 rounded-[3px] text-white text-xs">
                                        ARTICLE
                                    </span>
                                    <span className="block text-lg text-cool-gray-900 mb-2 font-semibold">
                                        Perpetual Pools V2 Trading Competition
                                    </span>
                                    <p className="text-sm text-cool-gray-700">
                                        An overview of the V2 Perpetual Pools Trading Competition. Read about the $TCR
                                        prices, entry requirements, and more!
                                    </p>
                                    <a href="#" className="text-tracer-midblue text-sm underline">
                                        Read article
                                    </a>
                                </div>
                            </div>
                            <div className="h-[189px] w-full bg-[#F0F0FF] rounded-lg p-6"></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}) as React.FC;
