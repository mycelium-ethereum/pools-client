import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserRow from '~/components/TradingComp/UserRow';

const UserTable: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    const placeholderArr = Array.from({ length: 7 });
    const tableHeadStyles =
        'text-left text-cool-gray-900 font-semibold bg-cool-gray-100 p-4 border-b border-cool-gray-200 dark:bg-cool-gray-700 dark:text-white';

    return (
        <table className="hidden w-full md:table">
            <thead>
                <tr>
                    <th className={`${tableHeadStyles} max-w-[105px]`}>Rank</th>
                    <th className={`${tableHeadStyles} `}>User</th>
                    <th className={`${tableHeadStyles} max-w-[300px]`}>Portfolio Value</th>
                    <th className={`${tableHeadStyles} max-w-[300px]`}>Entry Date</th>
                </tr>
            </thead>
            <tbody>
                {data && data.length > 0 ? (
                    <>
                        {data
                            .sort((a, b) => parseInt(b.accountValue) - parseInt(a.accountValue))
                            .map((item: any, index: number) => {
                                if (!item.disqualified) {
                                    return (
                                        <UserRow
                                            {...item}
                                            key={index}
                                            rank={index + 1}
                                            shaded={index % 2 !== 0}
                                            isFirst={index === 0}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            })
                            .filter((item) => item)}
                    </>
                ) : (
                    <>
                        {placeholderArr.map((item, index) => (
                            <UserRow
                                {...item}
                                username={''}
                                accountValue={''}
                                entryDate={0}
                                key={index}
                                rank={index + 1}
                                shaded={index % 2 !== 0}
                                isFirst={index === 0}
                                placeholder
                            />
                        ))}
                    </>
                )}
            </tbody>
        </table>
    );
};

export default UserTable;
