import React from 'react';

const TwitterShareButton: React.FC<{ url: string; className?: string }> = ({
    url,
    className,
}: {
    url: string;
    className?: string;
}) => {
    return (
        <a href={`https://twitter.com/intent/tweet?url=${url}`}>
            <button
                className={`group hover:bg-tracer-darkblue transition-colors duration-300 hover:text-white border dark:hover:bg-white dark:hover:text-tracer-darkblue border-tracer-darkblue rounded-xl w-[97px] h-[39px] text-sm font-semibold flex items-center justify-center text-black dark:border-white dark:text-white ${
                    className ?? ''
                }`}
            >
                <img
                    src="/img/trading-comp/twitter.svg"
                    alt="Twitter icon"
                    className="w-[15px] h-3 mr-2.5 dark:invert group-hover:invert transtiion-all duration-300 dark:hover:invert-0"
                />
                Share
            </button>
        </a>
    );
};

export default TwitterShareButton;
