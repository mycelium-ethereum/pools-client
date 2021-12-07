import { classNames } from '@libs/utils/functions';
import React from 'react';

const icon = 'absolute top-0 bottom-0 transition-all text-cool-gray-800';

export default (({ toggleValue, value }) => {
    return (
        <div onClick={toggleValue} className={'relative inline-block w-12 h-6 my-auto mx-0'}>
            <span
                className={classNames(
                    'absolute inset-0 rounded-3xl transition-all bg-tracer-600 dark:bg-cool-gray-700 cursor-pointer text-cool-gray-800 text-sm',
                    "before:absolute before:content-[''] before:h-6 before:w-6 before:right-0 before:bg-white before:transition-all before:rounded-[50%]",
                    value ? 'before:-translate-x-6' : 'before:translate-x-0',
                )}
            />

            <div className={classNames(icon, value ? 'opacity-100' : 'opacity-0', 'left-[0.35rem] cursor-pointer')}>
                <svg viewBox="0 0 20 20" className="h-4">
                    <text x="0" y="20">
                        %
                    </text>
                </svg>
            </div>
            <div className={classNames(icon, value ? 'opacity-0' : 'opacity-100', 'right-[0.4rem] cursor-pointer')}>
                <svg viewBox="0 0 20 20" className="h-4">
                    <text x="7" y="20">
                        #
                    </text>
                </svg>
            </div>
        </div>
    );
}) as React.FC<{
    toggleValue: () => any;
    value: boolean;
}>;
