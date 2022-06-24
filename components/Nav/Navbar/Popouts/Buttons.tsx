import React, { useState, useRef } from 'react';
import { LauncherToggle, SettingsToggle } from '~/components/Nav/Navbar/Buttons';
import AppLauncher from '~/components/Nav/Navbar/Popouts/AppLauncher';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { PopoutContainer } from './styles';

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
            <SettingsToggle onClick={handleToggle} isSelected={showSettingsPopout} />
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
            <LauncherToggle onClick={handleToggle} isSelected={showLauncherPopout} />
            <AppLauncher isActive={showLauncherPopout} />
        </PopoutContainer>
    );
};
