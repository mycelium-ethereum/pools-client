import React from 'react';

const Placeholder: React.FC<{
    className?: string;
}> = ({ className }: { className?: string }) => {
    return (
        <div
            className={`h-full w-full overflow-hidden rounded-md bg-white dark:bg-cool-gray-800 ${
                className ? className : ''
            }`}
        >
            <div className="animated-background" />
        </div>
    );
};

export default Placeholder;
