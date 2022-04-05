import React from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: TradingCompParticipant[];
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    return (
        <div className="block md:hidden">
            {data.map((item: any, index: number) => (
                <UserDiv {...item} key={index} rank={index + 1} shaded={index % 2 !== 0} isFirst={index === 0} />
            ))}
        </div>
    );
};

export default UserDivs;
