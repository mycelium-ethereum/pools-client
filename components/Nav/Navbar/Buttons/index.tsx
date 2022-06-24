import React from 'react';
import SettingsSVG from '/public/img/general/settings.svg';
import { AppLaunchNavButton, Cube, CubeGrid, SettingsNavButton } from '~/components/Nav/Navbar/Popouts/styles';

type ToggleButtonProps = {
    isSelected: boolean;
    navMenuOpen?: boolean;
    onClick: () => void;
};
export const SettingsToggle: React.FC<ToggleButtonProps> = ({ onClick, isSelected, navMenuOpen }) => {
    return (
        <SettingsNavButton onClick={onClick} selected={isSelected} navMenuOpen={navMenuOpen}>
            <SettingsSVG alt="Settings icon" />
        </SettingsNavButton>
    );
};

export const LauncherToggle: React.FC<ToggleButtonProps> = ({ onClick, isSelected, navMenuOpen }) => {
    return (
        <AppLaunchNavButton onClick={onClick} selected={isSelected} navMenuOpen={navMenuOpen}>
            <CubeGrid>
                {Array.from({ length: 9 }).map((_, i) => (
                    <Cube key={i} />
                ))}
            </CubeGrid>
        </AppLaunchNavButton>
    );
};
