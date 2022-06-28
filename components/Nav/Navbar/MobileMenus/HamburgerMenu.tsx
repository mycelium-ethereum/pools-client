import React from 'react';

type HBMenuProps = {
    navMenuOpen: boolean;
    onClick: () => void;
    isSelected: boolean;
};

const HamburgerMenu: React.FC<HBMenuProps> = ({ navMenuOpen, isSelected, onClick }) => {
    const barStyles = `block h-[2px] duration-300 ${
        navMenuOpen ? (isSelected ? 'bg-tracer-650' : 'bg-white') : 'bg-tracer-650'
    }`;
    const longWidthStyles = 'min-w-[17px]';
    const shortWidthStyles = `transition-all ${navMenuOpen && isSelected ? 'min-w-[10px] delay-300' : 'min-w-[8.5px]'}`;
    const inactiveOpenStyles =
        'border-white text-white [background:linear-gradient(44.71deg,rgba(28,100,242,0.5)_-529.33%,rgba(28,100,242,0)_115.83%)]';
    const inactiveClosedStyles =
        'border-tracer-650 delay-300 [background:linear-gradient(44.71deg,rgba(28,100,242,0.5)_-529.33%,rgba(28,100,242,0)_115.83%)]';

    return (
        <button
            className={`ml-4 flex h-[36px] w-[41px] flex-col items-center justify-center overflow-hidden rounded-[4px] border transition-colors duration-300 ${
                navMenuOpen ? (isSelected ? 'border-white bg-white' : inactiveOpenStyles) : inactiveClosedStyles
            }`}
            onClick={onClick}
            aria-label="nav-menu"
        >
            <span
                className={`flex transition-[transform] duration-300 ${
                    navMenuOpen && isSelected ? `translate-y-[6.5px]` : `delay-300`
                }`}
            >
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen
                            ? isSelected
                                ? `translate-x-[3px] translate-y-[-3px] rotate-45 delay-300`
                                : ``
                            : ``
                    }`}
                />
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen && isSelected ? `translate-x-[-2px] translate-y-[-3px] -rotate-45 delay-300` : ``
                    }`}
                />
            </span>
            <span
                className={`mt-[4.5px] transition-all duration-300 ${barStyles} ${longWidthStyles} ${
                    navMenuOpen ? (isSelected ? `opacity-0` : `opacity-100`) : `opacity-100 delay-300`
                }`}
            />
            <span
                className={`mt-[4.5px] flex transition-[transform] duration-300 ${
                    navMenuOpen ? (isSelected ? `translate-y-[-5.5px]` : ``) : `delay-300`
                }`}
            >
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen && isSelected ? `translate-x-[3px] translate-y-0.5 -rotate-45 delay-300` : ``
                    }`}
                />
                <span
                    className={`${barStyles} ${shortWidthStyles} ${
                        navMenuOpen && isSelected ? `-translate-x-0.5 translate-y-0.5 rotate-45 delay-300` : ``
                    }`}
                />
            </span>
        </button>
    );
};

export default HamburgerMenu;
