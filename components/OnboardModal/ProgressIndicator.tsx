import React from 'react';
import styled from 'styled-components';
import { ProgressIndicatorProps } from './types';

const StepsContainer = styled.div`
    display: flex;
    margin-top: 2rem;
    justify-content: center;
    align-items: center;
`;

const Step = styled.div`
    margin-right: 0.75rem;
    border-radius: 9999px;

    width: 12px;
    height: 12px;
    border-radius: 50%;
    border-color: ${({ theme }) => theme.colors.primary};
    border-width: 2px;
    background-color: inherit;

    &.current-step {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0px 0px 10px rgba(28, 100, 242, 0.8);
        background-color: ${({ theme }) => theme.colors.primary};
        border: 2px solid ${({ theme }) => theme.colors.primary};
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
