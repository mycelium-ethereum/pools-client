import React, { useState } from 'react';

const PortfolioValueInfoBox: React.FC = () => {
    const [open, setOpen] = useState(false);
    const handleMouseEnter = () => {
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    const openStyles = 'pointer-events-auto opacity-100';
    const closedStyles = 'pointer-events-none opacity-0';

    return (
        <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative hidden md:inline">
            <img
                src="/img/trading-comp/info-dark.svg"
                className="mb-1 h-[12px] w-[12px] [transform:_translateZ(0)_perspective(999px)] dark:invert"
            />
            <div
                className={`absolute top-[calc(100%-2px)] left-1/2 z-10 flex h-[60px] w-[200px] -translate-x-1/2 transform items-center rounded-lg px-3.5 pb-2 pt-4 transition-opacity duration-300 ${
                    open ? openStyles : closedStyles
                }`}
            >
                <p className="relative z-10 text-xs leading-[150%] text-cool-gray-900">
                    Pending mints and burns are not included in the valuation
                </p>
                <img
                    src="/img/trading-comp/tooltip-background.svg"
                    style={{ transform: 'scale(-1)' }}
                    className="absolute top-0 left-0 z-0 h-full w-full"
                />
            </div>
        </button>
    );
};

export default PortfolioValueInfoBox;
