import React from 'react';
import { HiddenExpand } from '~/components/General';
import TimeLeft from '~/components/TimeLeft';

interface FeeNoteProps {
    poolName: string;
    isMint: boolean;
    receiveIn: number;
}

const FeeNote: React.FC<FeeNoteProps> = ({ poolName, isMint, receiveIn }) => {
    return (
        <HiddenExpand defaultHeight={0} open={!!poolName} className="my-5 text-center text-sm">
            <b>Note</b>: A small keeper fee will be taken when you {isMint ? 'receive' : 'burn'} the token in{' '}
            <TimeLeft targetTime={receiveIn} />. To learn more, visit{' '}
            <a
                className="text-theme-primary underline"
                href="https://pools.docs.tracer.finance/advanced-topics/upkeep-and-autoclaim#payment"
                target="_blank"
                rel="noreferrer"
            >
                Tracer Documentation
            </a>
            .
        </HiddenExpand>
    );
};
export default FeeNote;
