import React from 'react';
import { Pool } from '@libs/types/General';
import TimeLeft from '@components/TimeLeft';
import { HiddenExpand } from '@components/General';

interface FeeNoteProps {
    pool: Pool;
    isMint: boolean;
}
const FeeNote: React.FC<FeeNoteProps> = ({ pool, isMint }) => {
    return (
        <HiddenExpand defaultHeight={0} open={!!pool.name} className="text-cool-gray-600 my-5">
            <b>Note</b>: A small keeper fee will be taken when you {isMint ? 'receive' : 'sell'} the token in{' '}
            <TimeLeft targetTime={pool.lastUpdate.plus(pool.updateInterval).toNumber()} />. To learn more, visit{' '}
            <a
                className="text-tracer-800 underline"
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
