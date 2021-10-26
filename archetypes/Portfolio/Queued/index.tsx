import React from 'react';
import { CommitsFocusEnum } from '@libs/constants';

// const Queued
export default (({ focus }) => {
    return <>{focus === CommitsFocusEnum.mints ? 'Mints' : 'Burns'}</>;
}) as React.FC<{
    focus: CommitsFocusEnum;
}>;
