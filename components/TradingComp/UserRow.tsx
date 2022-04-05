import React from 'react';
import Placeholder from '~/components/TradingComp/Placeholder';
import { convertCurrency, convertDate } from '~/utils/converters';

const UserRow: React.FC<{
    username: string;
    accountValue: string;
    entryDate: number;
    rank: number;
    shaded: boolean;
    isFirst: boolean;
    placeholder?: boolean;
}> = ({
    username,
    accountValue,
    entryDate,
    rank,
    shaded,
    isFirst,
    placeholder,
}: {
    username: string;
    accountValue: string;
    entryDate: number;
    rank: number;
    shaded: boolean;
    isFirst: boolean;
    placeholder?: boolean;
}) => {
    const tableStyles = `text-left text-cool-gray-900 leading-[24px] dark:text-white leading-[150%] ${
        shaded ? 'bg-cool-gray-50 dark:bg-cool-gray-800' : 'bg-white dark:bg-cool-gray-900'
    } ${isFirst ? 'text-2xl px-4 py-[30px] font-bold' : 'p-4'}`;

    return (
        <>
            {placeholder ? (
                <tr>
                    <td className={`${tableStyles} font-bold`}>#{rank}</td>
                    <td className={`${tableStyles} font-bold`}>
                        {isFirst ? (
                            <Placeholder className="max-h-[67px] max-w-[245px]" />
                        ) : (
                            <Placeholder className="max-h-[40px] max-w-[245px]" />
                        )}
                    </td>
                    <td className={`${tableStyles}`}>
                        {isFirst ? (
                            <Placeholder className="max-h-[67px] max-w-[131px]" />
                        ) : (
                            <Placeholder className="max-h-[40px] max-w-[131px]" />
                        )}
                    </td>
                    <td className={`${tableStyles}`}>
                        {isFirst ? (
                            <Placeholder className="max-h-[67px] max-w-[131px]" />
                        ) : (
                            <Placeholder className="max-h-[40px] max-w-[131px]" />
                        )}
                    </td>
                </tr>
            ) : (
                <tr>
                    <td className={`${tableStyles} font-bold`}>#{rank}</td>
                    <td className={`${tableStyles} font-bold`}>
                        <div className="flex items-center">{username}</div>
                    </td>
                    <td className={`${tableStyles}`}>${convertCurrency(accountValue)}</td>
                    <td className={`${tableStyles}`}>{convertDate(entryDate)}</td>
                </tr>
            )}
        </>
    );
};

export default UserRow;
