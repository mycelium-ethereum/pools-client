import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    const placeholderArr = Array.from({ length: 7 });
    let rank = 0;
    return (
        <div className="block md:hidden">
            {data && data.length > 0 ? (
                <>
                    {data
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
            )}
        </div>
    );
};

export default UserDivs;
