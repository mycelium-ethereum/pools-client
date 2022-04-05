import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    return (
        <div className="block md:hidden">
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
        </div>
    );
};

export default UserDivs;
