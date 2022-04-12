import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import { Container } from '~/components/General/Container';
import NavBar from '~/components/Nav';
import ArticleBox from '~/components/TradingComp/ArticleBox';
import CountdownBanner from '~/components/TradingComp/CountdownBanner';
import Leaderboard from '~/components/TradingComp/Leaderboard';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import StatisticsBox from '~/components/TradingComp/StatisticsBox';
import { useStore } from '~/store/main';
import { selectAccount } from '~/store/Web3Slice';

export default (() => {
    const [data, setData] = useState<TradingCompParticipant[]>([]);
    const [filteredData, setFilteredData] = useState<TradingCompParticipant[]>([]);
    const [user, setUser] = useState<TradingCompParticipant[]>([]);
    const [participating, setParticipating] = useState<boolean>(false);
    const router = useRouter();
    const account = useStore(selectAccount);

    const getStats = () => {
        fetch('https://dev.api.tracer.finance/poolsv2/tradingcomp?network=421611', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data: TradingCompParticipant[]) => storeData(data))
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
            <Container className={`overflow-hidden bg-cool-gray-50 dark:bg-[#1b2436] sm:overflow-visible sm:pt-10`}>
                <div className="mx-auto max-w-[1280px]">
                    <div className="mb-[18px] flex flex-col lg:flex-row">
                        <CountdownBanner />
                        <div className="mt-4 flex h-auto flex-col justify-between lg:mt-0 lg:min-w-[465px]">
                            <ArticleBox />
                            <StatisticsBox {...user[0]} account={account} participating={participating} />
                        </div>
                    </div>
                    <Leaderboard filteredData={filteredData} data={data} setFilteredData={setFilteredData} />
                </div>
            </Container>
            <Footer />
        </div>
    );
}) as React.FC;
