import React from 'react';
import shallow from 'zustand/shallow';
import { useStore } from '~/store/main';
import { selectThemeSlice } from '~/store/ThemeSlice';
import { classNames } from '~/utils/helpers';

const img = 'absolute w-3 h-3 transition-all top-0 bottom-0 m-auto';

export default (() => {
    const { isDark, toggleTheme } = useStore(selectThemeSlice, shallow);

    return (
        <div onClick={toggleTheme} className={'relative my-auto mx-0 inline-block h-6 w-12'}>
            <span
                className={classNames(
                    'absolute inset-0 cursor-pointer rounded-3xl bg-tracer-600 transition-all dark:bg-cool-gray-700',
                    "before:absolute before:right-0 before:h-6 before:w-6 before:rounded-[50%] before:bg-white before:transition-all before:content-['']",
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
