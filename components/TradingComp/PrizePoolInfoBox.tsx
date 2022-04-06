import React, { useState } from 'react';

const PrizePoolInfoBox: React.FC = () => {
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
        <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
            <img
                src="/img/trading-comp/info.svg"
                className="ml-1 h-[12px] w-[12px] [transform:_translateZ(0)_perspective(999px)]"
            />
            <div
                className={`absolute bottom-[calc(100%+9px)] left-1/2 z-10 flex h-auto w-[178px] -translate-x-1/2 transform items-center rounded-lg bg-white p-[14px] shadow-lg transition-opacity duration-300 sm:w-[200px] 2xl:w-[342px] ${
                    open ? openStyles : closedStyles
                }`}
            >
                <p className="text-xs leading-[150%] text-cool-gray-900">
                    The leaderboard displays rankings based on unrealised profit and losses. Please note that the actual
                    award of prizes will be based on realised profit and loss. To realise your gains, be sure to burn
                    your existing positions before 16th April 7:00PM UTC
                </p>
                <img
                    src="/img/trading-comp/tooltip-bubble.svg"
                    className="absolute top-full left-1/2 h-[8px] w-[34px] -translate-x-1/2 transform"
                />
            </div>
        </button>
    );
};

export default PrizePoolInfoBox;
