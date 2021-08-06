import React from 'react';

interface LProps {
    size?: 'sm' | 'md' | 'lg';
}

const TracerLoading: React.FC<LProps> = ({ size }: LProps) => {
    const getHeight = () => {
        switch (size) {
            case 'lg':
                return 'h-12';
            case 'md':
                return 'h-8';
            case 'sm':
            default:
                return 'h-5';
        }
    };
    return <img alt="Tracer Loading..." className={getHeight() + ' m-auto'} src="/img/tracer-loading.svg" />;
};

export default TracerLoading;
