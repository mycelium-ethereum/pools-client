import React from 'react';
import styled from 'styled-components';
import Button from '~/components/General/Button';

type ToggleButtonProps = {
    content: React.ReactNode;
    gradient?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

const SlimButtonStyled = styled(Button)`
    border-radius: 0.25rem;
    border-width: 1px;
    border-color: ${({ theme }) => theme.colors.primary};
`;

const SlimButton: React.FC<ToggleButtonProps> = ({ content, gradient, onClick, disabled }) => {
    return (
        <div className="relative my-auto ml-4 inline-block text-left dark:border-theme-border">
            <SlimButtonStyled
                disabled={disabled}
                onClick={onClick}
                className={` ${gradient ? 'gradient-button' : ''} bg-dropdown-gradient focus:outline-none mb-4
                flex h-[36px] w-full items-center whitespace-nowrap rounded-[4px] text-sm font-medium
                shadow-sm transition-colors duration-300 hover:bg-tracer-650 hover:text-white
                focus:border-solid dark:text-white
                dark:hover:bg-theme-background-secondary md:mb-0 md:justify-center md:px-4`}
            >
                {content}
            </SlimButtonStyled>
        </div>
    );
};

export default SlimButton;
