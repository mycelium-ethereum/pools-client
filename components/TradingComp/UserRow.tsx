import React from 'react';

const UserRow: React.FC<{
    name: string;
    avatar: string;
    value: string;
    entryDate: string;
    rank: number;
    shaded: boolean;
    isFirst: boolean;
}> = ({
    name,
    avatar,
    value,
    entryDate,
    rank,
    shaded,
    isFirst,
}: {
    name: string;
    avatar: string;
    value: string;
    entryDate: string;
    rank: number;
    shaded: boolean;
    isFirst: boolean;
}) => {
    const tableStyles = `text-left text-cool-gray-900 leading-[24px] dark:text-white leading-[150%] ${
        shaded ? 'bg-cool-gray-50 dark:bg-cool-gray-800' : 'bg-white dark:bg-cool-gray-900'
    }
    ${isFirst ? 'text-2xl px-4 py-[30px]' : 'p-4'}`;
    return (
        <tr>
            <td className={`${tableStyles} font-bold`}>#{rank}</td>
            <td className={`${tableStyles} font-bold`}>
                <div className="flex items-center">
                    {avatar && <img src={avatar} className={`mr-2.5 ${isFirst ? 'h-[68px] w-[68px]' : 'w-9 h-9'}`} />}
                    {name}
                </div>
            </td>
            <td className={`${tableStyles}`}>{value}</td>
            <td className={`${tableStyles}`}>{entryDate}</td>
        </tr>
    );
};

export default UserRow;
