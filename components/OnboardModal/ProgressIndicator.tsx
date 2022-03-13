import { Theme } from '@context/ThemeContext/themes';
import React from 'react';
import styled from 'styled-components';
import { ProgressIndicatorProps } from './types';

const StepsContainer = styled.div`
    display: flex;
    margin 2rem 0;
    justify-content: center;
    align-items: center;
`;

const Step = styled.div`
    margin-right: 0.75rem;
    border-radius: 9999px;

    width: 0.75rem;
    height: 0.75rem;

    background-color: ${({ theme }) => (theme.theme === Theme.Light ? '#f3f4f6' : '#1f2a37')};

    &.current-step {
        width: 1.25rem;
        height: 1.25rem;
        border-width: 4px;
        border-color: #a6a6f2;
        background-color: #3535dc;
    }
`;

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalSteps, currentStep }: ProgressIndicatorProps) => {
    const OnboardSteps = Array.from(Array(totalSteps).keys());
    return (
        <StepsContainer>
            {OnboardSteps.map((i) => (
                <Step key={i} className={`${currentStep === i + 1 ? 'current-step' : ''}`} />
            ))}
        </StepsContainer>
    );
};
export default ProgressIndicator;
