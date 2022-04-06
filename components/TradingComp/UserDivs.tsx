import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: TradingCompParticipant[];
    filteredData: TradingCompParticipant[];
}> = ({ data, filteredData }: { data: TradingCompParticipant[]; filteredData: TradingCompParticipant[] }) => {
    const placeholderArr = Array.from({ length: 7 });
    let rank = 0;
    return (
        <div className="block md:hidden">
            {filteredData && filteredData.length > 0 ? (
                <>
                    {filteredData
                        .map((item: any, index: number) => {
                            if (!item.disqualified) {
                                return <UserDiv {...item} key={index} shaded={index % 2 !== 0} />;
                            } else {
                                return null;
                            }
                        })
                        .filter((item) => item)}
                </>
            ) : (
                <>
                    {!data || data.length == 0 ? (
                        <>
                            {placeholderArr.map((item, index) => {
                                rank += 1;
                                return (
                                    <UserDiv
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
                        <h1 className="mt-4 w-full text-center font-bold text-cool-gray-900">No results found</h1>
                    )}
                </>
            )}
        </div>
    );
};

export default UserDivs;
