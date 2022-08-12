import React from 'react';
import styled from 'styled-components';
import Button from '~/components/General/Button';

type ToggleButtonProps = {
    isSelected: boolean;
    content: React.ReactNode;
    onClick: () => void;
    navMenuOpen: boolean;
};

const SlimButtonStyled = styled(Button)`
    border-radius: 0.25rem;
    border-width: 1px;
    border-color: ${({ theme }) => theme.border.primary};
`;

const SlimButton: React.FC<ToggleButtonProps> = ({ content, onClick }) => {
    return (
        <div className="dark:bg-theme-button-gradient-bg relative my-auto ml-4 inline-block text-left dark:border-theme-border ">
            <SlimButtonStyled
                className="bg-dropdown-gradient gradient-button focus:outline-none mb-4
                flex h-[36px] w-full items-center whitespace-nowrap rounded-[4px] text-sm font-medium
                shadow-sm transition-colors duration-300 hover:bg-tracer-650 hover:text-white
                focus:border-solid dark:text-white
                dark:hover:bg-theme-background-secondary md:mb-0 md:justify-center md:px-4"
            >
                {content}
            </SlimButtonStyled>
        </div>
    );
};

export default SlimButton;
