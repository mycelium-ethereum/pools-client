import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserRow from '~/components/TradingComp/UserRow';
import PortfolioValueInfoBox from './PortfolioValueInfoBox';

const UserTable: React.FC<{
    data: TradingCompParticipant[];
    filteredData: TradingCompParticipant[];
}> = ({ data, filteredData }: { data: TradingCompParticipant[]; filteredData: TradingCompParticipant[] }) => {
    let rank = 0;
    const placeholderArr = Array.from({ length: 7 });
    const tableHeadStyles =
        'text-left text-cool-gray-900 font-semibold bg-cool-gray-100 p-4 border-b border-cool-gray-200 dark:bg-cool-gray-700 dark:text-white sticky top-0';

    return (
        <table className="hidden w-full md:table">
            <thead>
                <tr>
                    <th className={`${tableHeadStyles} max-w-[105px]`}>Rank</th>
                    <th className={`${tableHeadStyles} `}>User</th>
                    <th className={`${tableHeadStyles} relative z-10 max-w-[300px]`}>
                        Portfolio Value <PortfolioValueInfoBox />
                    </th>
                    <th className={`${tableHeadStyles} max-w-[300px]`}>Entry Date</th>
                </tr>
            </thead>
            <tbody className="relative min-h-[64px]">
                {filteredData && filteredData.length > 0 ? (
                    <>
                        {filteredData
                            .sort((a, b) => parseInt(b.accountValue) - parseInt(a.accountValue))
                            .map((item: any, index: number) => {
                                if (!item.disqualified) {
                                    rank += 1;
                                    return <UserRow {...item} key={index} shaded={index % 2 !== 0} />;
                                } else {
                                    return null;
                                }
                            })
                            .filter((item) => item)}
                    </>
                ) : (
                    <>
                        {!data || data.length === 0 ? (
                            <>
                                {placeholderArr.map((item, index) => {
                                    rank += 1;
                                    return (
                                        <UserRow
                                            {...item}
                                            username={''}
                                            accountValue={''}
                                            entryDate={0}
                                            key={index}
                                            ranking={rank}
                                            shaded={index % 2 !== 0}
                                            placeholder
                                        />
                                    );
                                })}
                            </>
                        ) : (
                            <div className="h-16">
                                <h1 className="absolute top-1/2 left-1/2 mt-4 w-full -translate-x-1/2 -translate-y-1/2 transform text-center font-bold text-cool-gray-900">
                                    No results found
                                </h1>
                            </div>
                        )}
                    </>
                )}
            </tbody>
        </table>
    );
};

export default UserTable;
