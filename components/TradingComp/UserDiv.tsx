import React from 'react';
import Placeholder from '~/components/TradingComp/Placeholder';
import { convertCurrency, convertDate } from '~/utils/converters';

const UserRow: React.FC<{
    username: string;
    accountValue: string;
    entryDate: number;
    ranking: number;
    shaded: boolean;
    placeholder?: boolean;
}> = ({
    username,
    accountValue,
    entryDate,
    ranking,
    shaded,
    placeholder,
}: {
    username: string;
    accountValue: string;
    entryDate: number;
    ranking: number;
    shaded: boolean;
    placeholder?: boolean;
}) => {
    const isFirst = ranking === 1;
    const isFifth = ranking === 5;
    const getOrdinal = (number: number) => {
        const ordinalRules = new Intl.PluralRules('en', {
            type: 'ordinal',
        });
        const suffixes = {
            many: '',
            zero: '',
            one: 'st',
            two: 'nd',
            few: 'rd',
            other: 'th',
        };
        const suffix = suffixes[ordinalRules.select(number)];
        return number + suffix;
    };

    return (
        <div
            className={`p-3 ${shaded ? 'bg-cool-gray-50 dark:bg-cool-gray-900' : 'bg-white dark:bg-cool-gray-800'} ${
                isFifth ? 'border-b-2 border-black' : ''
            }`}
        >
            <div className="flex items-center justify-between md:hidden">
                <div className="flex min-w-[100px] items-center">
                    <span
                        className={`inline-flex items-center justify-center rounded-full bg-cool-gray-400 font-semibold text-white dark:bg-cool-gray-700 ${
                            isFirst
                                ? 'mr-4 h-10 min-h-[40px] w-10 min-w-[40px] text-base'
                                : 'mr-2 h-8 min-h-[32px] w-8 min-w-[32px] text-[10px]'
                        }`}
                    >
                        {getOrdinal(ranking)}
                    </span>
                    {placeholder ? (
                        <Placeholder className="max-h-[30px] min-w-[100px] max-w-[100px]" />
                    ) : (
                        <span className={`font-bold text-cool-gray-900 dark:text-white ${isFirst ? 'text-2xl' : ''}`}>
                            {username}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-2 flex">
                <div className="flex w-1/2 flex-col">
                    <span className="font-semibold leading-[150%] text-cool-gray-500">Portfolio Value</span>
                    <span className="font-bold leading-[150%] text-cool-gray-900 dark:text-white">
                        {placeholder ? (
                            <Placeholder className="max-h-[30px] max-w-[100px]" />
                        ) : (
                            convertCurrency(accountValue)
                        )}
                    </span>
                </div>
                <div className="flex w-1/2 flex-col">
                    <span className="font-semibold leading-[150%] text-cool-gray-500">Entry Date</span>
                    <span className="font-bold leading-[150%] text-cool-gray-900 dark:text-white">
                        {placeholder ? <Placeholder className="max-h-[30px] max-w-[100px]" /> : convertDate(entryDate)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserRow;
