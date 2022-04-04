import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import NavBar from '~/components/Nav';
import ArticleBox from '~/components/TradingComp/ArticleBox';
import CountdownBanner from '~/components/TradingComp/CountdownBanner';
import Leaderboard from '~/components/TradingComp/Leaderboard';
import { tableData } from '~/components/TradingComp/presets';
import StatisticsBox from '~/components/TradingComp/StatisticsBox';
import UpdateProfileModal from '~/components/TradingComp/UpdateProfileModal';

export default (() => {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const statisticData = {
        name: 'Raymogg#3230',
        avatar: '/img/trading-comp/placeholder.png',
        rank: '452',
        value: '12,200',
        entryDate: '12 Apr',
    };

    useEffect(() => {
        router.prefetch('/trading-comp');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className={`container w-full bg-white px-4 dark:bg-[#1b2436] sm:px-0 sm:pt-10`}>
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-[18px] flex flex-col lg:flex-row">
                        <CountdownBanner />
                        <div className="mt-4 flex flex-col justify-between lg:mt-0 lg:min-w-[465px]">
                            <ArticleBox />
                            <StatisticsBox {...statisticData} handleOpen={handleOpen} />
                        </div>
                    </div>
                    <Leaderboard data={tableData} />
                </div>
            </div>
            <UpdateProfileModal isOpen={isOpen} handleClose={handleClose} />
            <Footer />
        </div>
    );
}) as React.FC;
