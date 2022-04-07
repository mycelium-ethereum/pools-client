import React from 'react';

const ArticleBox: React.FC = () => {
    return (
        <div className="mb-4 grid h-full grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 sm:gap-y-0">
            <div className="w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-tracer-800 dark:bg-opacity-[15%]">
                <span className="mb-2.5 flex h-5 w-[67px] items-center justify-center rounded-[3px] bg-tracer-900 text-xs text-white">
                    ARTICLE
                </span>
                <span className="mb-2 block text-lg font-semibold text-cool-gray-900 dark:text-white">
                    Perpetual Pools V2
                    <br className="block sm:hidden" /> Trading Competition
                </span>
                <p className="text-xs text-cool-gray-700 dark:text-cool-gray-500">
                    An overview of the V2 Perpetual Pools Trading Competition. Read about the $TCR prizes, entry
                    requirements, and more!
                </p>
                <a
                    href="https://tracer.finance/radar/trading-competition/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-tracer-midblue underline"
                >
                    Read article
                </a>
            </div>
            <div className="w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-tracer-800 dark:bg-opacity-[15%]">
                <span className="mb-2.5 flex h-5 w-[67px] items-center justify-center rounded-[3px] bg-tracer-900 text-xs text-white">
                    TUTORIAL
                </span>
                <span className="mb-2 block text-lg font-semibold text-cool-gray-900 dark:text-white">
                    Looking to get started?
                </span>
                <p className="text-xs text-cool-gray-700 dark:text-cool-gray-500">
                    Watch the video below for a crash course on how to mint and burn
                </p>
                <a
                    href="https://www.loom.com/share/cdf6f2375ee44771bb017df3d4f5425c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-tracer-midblue underline"
                >
                    Watch video
                </a>
            </div>
        </div>
    );
};

export default ArticleBox;
