import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    const placeholderArr = Array.from({ length: 7 });
    return (
        <div className="block md:hidden">
            {data && data.length > 0 ? (
                <>
                    {data
                        .map((item: any, index: number) => {
                            if (!item.disqualified) {
                                return (
                                    <UserDiv
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
                        <UserDiv
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
        </div>
    );
};

export default UserDivs;
