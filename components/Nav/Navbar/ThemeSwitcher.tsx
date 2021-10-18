import { useTheme } from '@context/ThemeContext';
import { classNames } from '@libs/utils/functions';
import React from 'react';

const img = 'absolute w-3 h-3 transition-all top-0 bottom-0 m-auto';

export default (() => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div onClick={toggleTheme} className={'relative inline-block w-12 h-6 my-auto mx-0'}>
            <span
                className={classNames(
                    'absolute inset-0 rounded-3xl transition-all bg-tracer-600 dark:bg-cool-gray-700 cursor-pointer',
                    "before:absolute before:content-[''] before:h-6 before:w-6 before:right-0 before:bg-white before:transition-all before:rounded-[50%]",
                    isDark ? 'before:-translate-x-6' : 'before:translate-x-0',
                )}
            />
            <img
                className={classNames(img, isDark ? 'opacity-100' : 'opacity-0', 'left-[0.4rem] cursor-pointer')}
                src="/img/general/dark_theme.svg"
                alt="Dark Theme"
            />
            <img
                className={classNames(img, isDark ? 'opacity-0' : 'opacity-100', 'right-[0.4rem] cursor-pointer')}
                src="/img/general/light_theme.svg"
                alt="Light Theme"
            />
        </div>
    );
}) as React.FC;
