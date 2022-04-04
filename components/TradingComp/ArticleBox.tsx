import React from 'react';

const ArticleBox: React.FC = () => {
    return (
        <div className="mb-4 min-h-[178px] w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-tracer-800 dark:bg-opacity-[15%]">
            <div className="sm:w-[380px]">
                <span className="mb-2.5 flex h-5 w-[67px] items-center justify-center rounded-[3px] bg-tracer-900 text-xs text-white">
                    ARTICLE
                </span>
                <span className="mb-2 block text-lg font-semibold text-cool-gray-900 dark:text-white">
                    Perpetual Pools V2
                    <br className="block sm:hidden" /> Trading Competition
                </span>
                <p className="text-sm text-cool-gray-700 dark:text-[#71717A]">
                    An overview of the V2 Perpetual Pools Trading Competition. Read about the $TCR prices, entry
                    requirements, and more!
                </p>
                <a href="#" className="text-sm text-tracer-midblue underline">
                    Read article
                </a>
            </div>
        </div>
    );
};

export default ArticleBox;
