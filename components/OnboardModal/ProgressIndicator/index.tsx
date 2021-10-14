import React from 'react';
import { useTheme } from '@context/ThemeContext';

interface ProgressIndicatorProps {
    totalSteps: number;
    currentStep: number;
}
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalSteps, currentStep }: ProgressIndicatorProps) => {
    const { isDark } = useTheme();
    const OnboardSteps = Array.from(Array(totalSteps).keys());
    return (
        <div className="flex my-8 justify-center items-center">
            {OnboardSteps.map((i) => (
                <div
                    key={i}
                    className={`${
                        currentStep === i + 1
                            ? 'w-5 h-5 bg-tracer-500 border-4 border-tracer-200'
                            : `w-3 h-3 ${isDark ? 'bg-cool-gray-800' : 'bg-cool-gray-100'}`
                    } rounded-full mr-3`}
                />
            ))}
        </div>
    );
};
export default ProgressIndicator;
