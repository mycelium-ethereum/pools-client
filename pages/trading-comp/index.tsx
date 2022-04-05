import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import NavBar from '~/components/Nav';
import ArticleBox from '~/components/TradingComp/ArticleBox';
import CountdownBanner from '~/components/TradingComp/CountdownBanner';
import Leaderboard from '~/components/TradingComp/Leaderboard';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import { tableData } from '~/components/TradingComp/presets';
import StatisticsBox from '~/components/TradingComp/StatisticsBox';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

export default (() => {
    const [data, setData] = useState<TradingCompParticipant[]>([]);
    const [filteredData, setFilteredData] = useState<TradingCompParticipant[]>([]);
    const [user, setUser] = useState<TradingCompParticipant[]>([]);
    const [participating, setParticipating] = useState<boolean>(false);
    const router = useRouter();
    const { account } = useStore(selectWeb3Info);

    const getStats = () => {
        fetch('https://dev.api.tracer.finance/poolsv2/tradingcomp?network=421611', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data: TradingCompParticipant[]) =>
                data && data.length > 0 ? storeData(data) : storeData(tableData),
            )
            .catch((error) => {
                console.log('API request failed', error);
            });
    };

    const storeData = (data: TradingCompParticipant[]) => {
        const nonDisqualifiedEntrants = data.filter((item) => item.disqualified === false);
        const rankedEntrants: TradingCompParticipant[] = [];
        nonDisqualifiedEntrants.forEach((item, index) => {
            item.ranking = index + 1;
            rankedEntrants.push(item);
        });
        setData(rankedEntrants);
        setFilteredData(rankedEntrants);
    };

    const getCurrentUser = () => {
        // Hardcode account for testing
        // const accountAddress = '0xAEF2A30FE1b2dC3d51b4e9Bf22b0698Ec8e6Ce1f';
        // const currentUser: TradingCompParticipant[] = data.filter((item) => item.address === accountAddress);
        const currentUser: TradingCompParticipant[] = data.filter((item) => item.address === account);
        if (currentUser[0] && !!currentUser[0].username) {
            setUser(currentUser);
            setParticipating(true);
        }
    };

    useEffect(() => {
        getStats();
        router.prefetch('/trading-comp');
    }, []);

    useEffect(() => {
        if (account && data && data.length > 0) {
            getCurrentUser();
        }
    }, [account, data]);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className={`container w-full bg-white px-4 dark:bg-[#1b2436] sm:px-0 sm:pt-10`}>
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-[18px] flex flex-col lg:flex-row">
                        <CountdownBanner />
                        <div className="mt-4 flex flex-col justify-between lg:mt-0 lg:min-w-[465px]">
                            <ArticleBox />
                            <StatisticsBox {...user[0]} account={account} participating={participating} />
                        </div>
                    </div>
                    <Leaderboard filteredData={filteredData} data={data} setFilteredData={setFilteredData} />
                </div>
            </div>
            <Footer />
        </div>
    );
}) as React.FC;
