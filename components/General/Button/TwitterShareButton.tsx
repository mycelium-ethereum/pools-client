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
                className={`group flex h-[39px] w-[97px] items-center justify-center rounded-xl border border-tracer-darkblue text-sm font-semibold text-black transition-colors duration-300 hover:bg-tracer-darkblue hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-tracer-darkblue ${
                    className ?? ''
                }`}
            >
                <img
                    src="/img/trading-comp/twitter.svg"
                    alt="Twitter icon"
                    className="transtiion-all mr-2.5 h-3 w-[15px] duration-300 group-hover:invert dark:invert dark:hover:invert-0"
                />
                Share
            </button>
        </a>
    );
};

export default TwitterShareButton;
