import React from 'react';

const ArticleBox: React.FC = () => {
    return (
        <div className="min-h-[178px] w-full bg-[#F0F0FF] rounded-lg p-6 mb-4 dark:bg-tracer-800 dark:bg-opacity-[15%]">
            <div className="w-[380px]">
                <span className="mb-2.5 flex items-center justify-center h-5 w-[67px] bg-tracer-900 rounded-[3px] text-white text-xs">
                    ARTICLE
                </span>
                <span className="block text-lg text-cool-gray-900 mb-2 font-semibold dark:text-white">
                    Perpetual Pools V2 Trading Competition
                </span>
                <p className="text-sm text-cool-gray-700 dark:text-[#71717A]">
                    An overview of the V2 Perpetual Pools Trading Competition. Read about the $TCR prices, entry
                    requirements, and more!
                </p>
                <a href="#" className="text-tracer-midblue text-sm underline">
                    Read article
                </a>
            </div>
        </div>
    );
};

export default ArticleBox;
