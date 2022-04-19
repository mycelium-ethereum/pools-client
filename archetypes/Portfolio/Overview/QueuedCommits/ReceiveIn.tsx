import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import TimeLeft from '~/components/TimeLeft';

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
}: ReceiveInProps) => {
    if (pendingUpkeep) {
        return <>{`${actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} in progress`}</>;
    } else {
        return (
            <TimeLeft
                targetTime={expectedExecution}
                countdownEnded={() => {
                    setPendingUpkeep(true);
                }}
            />
        );
    }
};
