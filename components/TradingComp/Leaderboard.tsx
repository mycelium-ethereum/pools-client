import React from 'react';
import UserRow from './UserRow';

const Leaderboard: React.FC<{
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: undefined;
    }[];
}> = ({
    data,
}: {
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: undefined;
    }[];
}) => {
    const tableHeadStyles =
        'text-left text-cool-gray-900 font-bold bg-cool-gray-100 p-4 border-b border-cool-gray-200 dark:bg-cool-gray-700 dark:text-white';

    return (
        <div className="py-5 px-7 shadow-sm bg-white rounded-[10px] dark:bg-cool-gray-900">
            <div className="flex items-center justify-between mb-4 text-cool-gray-900 dark:text-white">
                <span className="text-lg block font-bold">Leaderboard</span>
                <div className="flex items-center justify-between max-w-[281px] w-full">
                    <span className="block mb-4 font-semibold">Total Competitors</span>
                    <span className="block mb-4 font-bold">{data.length}</span>
                </div>
            </div>
            <div className="max-h-[550px] overflow-auto">
                <table className="w-full">
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
                            .sort((a, b) => parseInt(b.value) - parseInt(a.value))
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
            </div>
        </div>
    );
};

export default Leaderboard;
