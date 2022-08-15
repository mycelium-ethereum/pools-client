import React from 'react';
import LoadingImg from '~/public/img/loading-large.svg';
import { classNames } from '~/utils/helpers';

export default (({ className }) => {
    return <LoadingImg className={classNames(className ?? '')} />;
}) as React.FC<{
    className?: string;
}>;
