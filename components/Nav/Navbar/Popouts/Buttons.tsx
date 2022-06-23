import React, { useState, useRef } from 'react';
import SettingsSVG from '/public/img/general/settings.svg';
import AppLauncher from '~/components/Nav/Navbar/Popouts/AppLauncher';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { AppLaunchNavButton, Cube, CubeGrid, PopoutContainer, SettingsNavButton } from './styles';

export const PopoutButtons: React.FC = () => {
    const [showSettingsPopout, setShowSettingsPopout] = useState(false);
    const [showLauncherPopout, setShowLauncherPopout] = useState(false);

    return (
        <>
            <SettingsButton showSettingsPopout={showSettingsPopout} setShowSettingsPopout={setShowSettingsPopout} />
            <AppLaunchButton showLauncherPopout={showLauncherPopout} setShowLauncherPopout={setShowLauncherPopout} />
        </>
    );
};

export const SettingsButton: React.FC<{
    showSettingsPopout: boolean;
    setShowSettingsPopout: (value: React.SetStateAction<boolean>) => void;
}> = ({ showSettingsPopout, setShowSettingsPopout }) => {
    const handleToggle = () => {
        setShowSettingsPopout(!showSettingsPopout);
    };

    const handleClose = () => {
        setShowSettingsPopout(false);
    };

    const settingsContainerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(settingsContainerRef, handleClose);

    return (
        <PopoutContainer ref={settingsContainerRef}>
            <SettingsNavButton onClick={handleToggle} selected={showSettingsPopout}>
                <SettingsSVG alt="Settings icon" />
            </SettingsNavButton>
            <SettingsPopout isActive={showSettingsPopout} />
        </PopoutContainer>
    );
};

export const AppLaunchButton: React.FC<{
    showLauncherPopout: boolean;
    setShowLauncherPopout: (value: React.SetStateAction<boolean>) => void;
}> = ({ showLauncherPopout, setShowLauncherPopout }) => {
    const handleToggle = () => {
        setShowLauncherPopout(!showLauncherPopout);
    };

    const handleClose = () => {
        setShowLauncherPopout(false);
    };

    const launcherContainerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(launcherContainerRef, handleClose);

    return (
        <PopoutContainer ref={launcherContainerRef}>
            <AppLaunchNavButton onClick={handleToggle} selected={showLauncherPopout}>
                <CubeGrid>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Cube key={i} />
                    ))}
                </CubeGrid>
            </AppLaunchNavButton>
            <AppLauncher isActive={showLauncherPopout} />
        </PopoutContainer>
    );
};
