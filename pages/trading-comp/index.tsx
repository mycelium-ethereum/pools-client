import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import NavBar from '~/components/Nav';
import ArticleBox from '~/components/TradingComp/ArticleBox';
import CountdownBanner from '~/components/TradingComp/CountdownBanner';
import Leaderboard from '~/components/TradingComp/Leaderboard';
import StatisticsBox from '~/components/TradingComp/StatisticsBox';
import UpdateProfileModal from './UpdateProfileModal';

export default (() => {
    const [isOpen, setIsOpen] = React.useState(false);
    const router = useRouter();

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        router.prefetch('/trading-comp');
    }, []);

    const statisticData = {
        name: 'Raymogg#3230',
        avatar: '/img/trading-comp/placeholder.png',
        rank: '452',
        value: '12,200',
        entryDate: '12 Apr',
    };

    const tableData = [
        { name: 'kit#4321', avatar: '/img/trading-comp/placeholder.png', value: '1300', entryDate: '6 April, 2022' },
        { name: '0x3423..2343', avatar: '', value: '1200', entryDate: '6 April, 2022' },
        { name: 'kit#4321', avatar: '/img/trading-comp/placeholder.png', value: '1200', entryDate: '12 April, 2022' },
        {
            name: 'raymogg#3230',
            avatar: '/img/trading-comp/placeholder.png',
            value: '1200',
            entryDate: '12 April, 2022',
        },
        { name: '0x3423..2343', avatar: '', value: '1200', entryDate: '12 April, 2022' },
        {
            name: '0x3423..2343',
            avatar: '/img/trading-comp/placeholder.png',
            value: '1200',
            entryDate: '12 April, 2022',
        },
        {
            name: 'raymogg#3230',
            avatar: '/img/trading-comp/placeholder.png',
            value: '1200',
            entryDate: '12 April, 2022',
        },
        { name: '0x3423..2343', avatar: '', value: '1200', entryDate: '6 April, 2022' },
        { name: 'kit#4321', avatar: '/img/trading-comp/placeholder.png', value: '1200', entryDate: '12 April, 2022' },
        {
            name: 'raymogg#3230',
            avatar: '/img/trading-comp/placeholder.png',
            value: '1200',
            entryDate: '12 April, 2022',
        },
        { name: '0x3423..2343', avatar: '', value: '1200', entryDate: '12 April, 2022' },
        { name: '0x3423..2343', avatar: '', value: '1200', entryDate: '12 April, 2022' },
        { name: 'raymogg#3230', avatar: '', value: '1200', entryDate: '12 April, 2022' },
    ];

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className={`container w-full pt-10`}>
                <div className="max-w-[1280px] mx-auto">
                    <div className="flex mb-[18px]">
                        <CountdownBanner />
                        <div className="flex min-w-[465px] flex-col justify-between">
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
