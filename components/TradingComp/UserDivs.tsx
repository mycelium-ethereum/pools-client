import React from 'react';
import UserDiv from '~/components/TradingComp/UserDiv';

const UserDivs: React.FC<{
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: string;
    }[];
}> = ({
    data,
}: {
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: string;
    }[];
}) => {
    return (
        <>
            {data.map((item: any, index: number) => (
                <UserDiv {...item} key={index} rank={index + 1} shaded={index % 2 !== 0} isFirst={index === 0} />
            ))}
        </>
    );
};

export default UserDivs;
