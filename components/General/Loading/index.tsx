import React from 'react';
import { classNames } from '@libs/utils/functions';

export default (({ className }) => {
    return <img className={classNames(className ?? '')} src="/img/general/loading.gif" />;
}) as React.FC<{
    className?: string;
}>;
