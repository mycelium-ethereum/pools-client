import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserRow from '~/components/TradingComp/UserRow';

const UserTable: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
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
                {data
                    .sort((a, b) => parseInt(b.accountValue) - parseInt(a.accountValue))
                    .map((item: any, index: number) => (
                        <UserRow
                            {...item}
                            key={index}
                            rank={index + 1}
                            shaded={index % 2 !== 0}
                            isFirst={index === 0}
                        />
                    ))}
            </tbody>
        </table>
    );
};

export default UserTable;
