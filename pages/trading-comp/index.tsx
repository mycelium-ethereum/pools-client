import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import NavBar from '~/components/Nav';
import ArticleBox from '~/components/TradingComp/ArticleBox';
import CountdownBanner from '~/components/TradingComp/CountdownBanner';
import Leaderboard from '~/components/TradingComp/Leaderboard';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import StatisticsBox from '~/components/TradingComp/StatisticsBox';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

export default (() => {
    const [data, setData] = useState<TradingCompParticipant[]>([]);
    const [user, setUser] = useState<TradingCompParticipant[]>([]);
    const router = useRouter();
    const { account } = useStore(selectWeb3Info);

    const getStats = () => {
        fetch('https://dev.api.tracer.finance/poolsv2/tradingcomp?network=421611', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => {
                console.log('API request failed', error);
            });
    };

    const getCurrentUser = () => {
        // Hardcode account for testing
        const hardcodedAccount = '0xAEF2A30FE1b2dC3d51b4e9Bf22b0698Ec8e6Ce1f';
        // const currentUser: any = data.filter((item) => item.address === account);
        const currentUser: any = data.filter((item) => item.address === hardcodedAccount);
        currentUser[0].rank = data.indexOf(currentUser[0]) + 1;
        setUser(currentUser);
    };

    useEffect(() => {
        getStats();
        router.prefetch('/trading-comp');
    }, []);

    useEffect(() => {
        if (account) {
            getCurrentUser();
        }
    }, [account]);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <div className={`container w-full bg-white px-4 dark:bg-[#1b2436] sm:px-0 sm:pt-10`}>
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-[18px] flex flex-col lg:flex-row">
                        <CountdownBanner />
                        <div className="mt-4 flex flex-col justify-between lg:mt-0 lg:min-w-[465px]">
                            <ArticleBox />
                            {user && <StatisticsBox {...user[0]} />}
                        </div>
                    </div>
                    {data && <Leaderboard data={data} />}
                </div>
            </div>
            <Footer />
        </div>
    );
}) as React.FC;
