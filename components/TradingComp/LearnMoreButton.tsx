import React from 'react';

const LearnMoreButton: React.FC<{ url: string; className?: string }> = ({ url }: { url: string }) => {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            <button className="group mt-2 flex h-[39px] w-[102px] items-center justify-center rounded-xl border border-tracer-darkblue text-sm font-semibold text-black transition-colors duration-300 hover:bg-tracer-darkblue hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-tracer-darkblue">
                Learn More
            </button>
        </a>
    );
};

export default LearnMoreButton;
