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
        <div className={`p-3 ${shaded ? 'bg-cool-gray-50 dark:bg-cool-gray-900' : 'bg-white dark:bg-cool-gray-800'}`}>
            <div className="flex items-center justify-between md:hidden">
                <div className="flex items-center">
                    <span
                        className={`inline-flex items-center justify-center rounded-full bg-cool-gray-400 font-semibold text-white dark:bg-cool-gray-700 ${
                            isFirst ? 'mr-4 h-10 w-10 text-base' : 'mr-2 h-[32px] w-[32px] text-[10px]'
                        }`}
                    >
                        {getOrdinal(rank)}
                    </span>
                    <span className={`font-bold text-cool-gray-900 dark:text-white ${isFirst ? 'text-2xl' : ''}`}>
                        {name}
                    </span>
                </div>
                {avatar && <img src={avatar} className={`ml-5 ${isFirst ? 'h-10 w-10' : 'h-[26px] w-[26px]'}`} />}
            </div>
            <div className="mt-2 flex">
                <div className="flex w-1/2 flex-col">
                    <span className="font-semibold leading-[150%] text-cool-gray-500">Portfolio Value</span>
                    <span className="font-inter font-bold leading-[150%] text-cool-gray-900 dark:text-white">
                        {value}
                    </span>
                </div>
                <div className="flex w-1/2 flex-col">
                    <span className="font-semibold leading-[150%] text-cool-gray-500">Entry Date</span>
                    <span className="font-inter font-bold leading-[150%] text-cool-gray-900 dark:text-white">
                        {entryDate}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserRow;
