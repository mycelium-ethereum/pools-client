import React from 'react';

type HBMenuProps = {
    navMenuOpen: boolean;
    onClick: () => void;
};

const HamburgerMenu: React.FC<HBMenuProps> = ({ navMenuOpen, onClick }) => {
    const barStyles = 'block h-[2px] duration-300 bg-tracer-650';
    const longWidthStyles = 'w-[17px]';
    const shortWidthStyles = `transition-[transform] ${navMenuOpen ? 'w-2.5' : 'w-[8.5px]'}`;

    return (
        <button
            className={`ml-4 flex h-[36px] w-[41px] flex-col items-center justify-center overflow-hidden rounded-[4px] border transition-colors duration-300 ${
                navMenuOpen
                    ? 'border-white bg-white'
                    : ' border-tracer-650 delay-300 [background:linear-gradient(44.71deg,rgba(28,100,242,0.5)_-529.33%,rgba(28,100,242,0)_115.83%)]'
            }`}
            onClick={onClick}
            aria-label="nav-menu"
        >
            <span
                className={`flex transition-[transform] duration-300 ${navMenuOpen ? `translate-y-1.5` : `delay-300`}`}
            >
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen ? `translate-x-[3px] translate-y-[-3px] rotate-45 delay-300` : ``
                    }`}
                />
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen ? `translate-x-[-2px] translate-y-[-3px] -rotate-45 delay-300` : ``
                    }`}
                />
            </span>
            <span
                className={`mt-[4.5px] transition-opacity duration-300 ${barStyles} ${longWidthStyles} ${
                    navMenuOpen ? `opacity-0` : `opacity-100 delay-300`
                }`}
            />
            <span
                className={`mt-[4.5px] flex transition-[transform] duration-300 ${
                    navMenuOpen ? `-translate-y-1.5` : `delay-300`
                }`}
            >
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen ? `translate-x-[3px] translate-y-0.5 -rotate-45 delay-300` : ``
                    }`}
                />
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen ? `-translate-x-0.5 translate-y-0.5 rotate-45 delay-300` : ``
                    }`}
                />
            </span>
        </button>
    );
};

export default HamburgerMenu;
