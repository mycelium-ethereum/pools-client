import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import TimeLeft from '~/components/TimeLeft';
import { TimeLeftWrapper } from './styles';

interface ReceiveInProps {
    pendingUpkeep: boolean;
    setPendingUpkeep: React.Dispatch<React.SetStateAction<boolean>>;
    actionType: CommitActionEnum;
    expectedExecution: number;
}

export const ReceiveIn: React.FC<ReceiveInProps> = ({
    pendingUpkeep,
    setPendingUpkeep,
    actionType,
    expectedExecution,
}: ReceiveInProps) => (
    <TimeLeftWrapper>
        {pendingUpkeep ? (
            `${actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} in progress`
        ) : (
            <TimeLeft
                targetTime={expectedExecution}
                countdownEnded={() => {
                    setPendingUpkeep(true);
                }}
            />
        )}
    </TimeLeftWrapper>
);
