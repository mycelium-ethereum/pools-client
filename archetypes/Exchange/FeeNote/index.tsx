import React from 'react';
import TimeLeft from '@components/TimeLeft';
import { HiddenExpand } from '@components/General';

interface FeeNoteProps {
    poolName: string;
    isMint: boolean;
    receiveIn: number;
}

const FeeNote: React.FC<FeeNoteProps> = ({ poolName, isMint, receiveIn }) => {
    return (
        <HiddenExpand defaultHeight={0} open={!!poolName} className="my-5 text-sm text-center">
            <b>Note</b>: A small keeper fee will be taken when you {isMint ? 'receive' : 'burn'} the token in{' '}
            <TimeLeft targetTime={receiveIn} />. To learn more, visit{' '}
            <a
                className="text-theme-primary underline"
                href="https://docs.tracer.finance/market-types/perpetual-pools/mechanism-design/fees#keeper-fees"
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
