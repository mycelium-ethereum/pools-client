import React, { useState, useRef, useContext } from 'react';
import { LauncherToggle, SettingsToggle } from '~/components/Nav/Navbar/Buttons';
import AppLauncher from '~/components/Nav/Navbar/Popouts/AppLauncher';
import { NavContext } from '~/context/NavContext';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { PopoutContainer } from './styles';

export const PopoutButtons: React.FC = () => {
    const [showSettingsPopout, setShowSettingsPopout] = useState(false);
    const [showLauncherPopout, setShowLauncherPopout] = useState(false);
    const { navMenuOpen, setNavMenuOpen } = useContext(NavContext);

    return (
        <>
            <SettingsButton
                showSettingsPopout={showSettingsPopout}
                setShowSettingsPopout={setShowSettingsPopout}
                navMenuOpen={navMenuOpen}
                setNavMenuOpen={setNavMenuOpen}
            />
            <AppLaunchButton
                showLauncherPopout={showLauncherPopout}
                setShowLauncherPopout={setShowLauncherPopout}
                navMenuOpen={navMenuOpen}
                setNavMenuOpen={setNavMenuOpen}
            />
        </>
    );
};

export const SettingsButton: React.FC<{
    showSettingsPopout: boolean;
    setShowSettingsPopout: (value: React.SetStateAction<boolean>) => void;
    navMenuOpen: boolean;
    setNavMenuOpen: (value: React.SetStateAction<boolean>) => void;
}> = ({ showSettingsPopout, setShowSettingsPopout, navMenuOpen, setNavMenuOpen }) => {
    const handleToggle = () => {
        setShowSettingsPopout(!showSettingsPopout);
        setNavMenuOpen(false);
    };

    const handleClose = () => {
        setShowSettingsPopout(false);
    };

    const settingsContainerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(settingsContainerRef, handleClose);

    return (
        <PopoutContainer ref={settingsContainerRef}>
            <SettingsToggle onClick={handleToggle} isSelected={showSettingsPopout} navMenuOpen={navMenuOpen} />
        </PopoutContainer>
    );
};

export const AppLaunchButton: React.FC<{
    showLauncherPopout: boolean;
    setShowLauncherPopout: (value: React.SetStateAction<boolean>) => void;
    navMenuOpen: boolean;
    setNavMenuOpen: (value: React.SetStateAction<boolean>) => void;
}> = ({ showLauncherPopout, setShowLauncherPopout, navMenuOpen, setNavMenuOpen }) => {
    const handleToggle = () => {
        setShowLauncherPopout(!showLauncherPopout);
        setNavMenuOpen(false);
    };

    const handleClose = () => {
        setShowLauncherPopout(false);
    };

    const launcherContainerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(launcherContainerRef, handleClose);

    return (
        <PopoutContainer ref={launcherContainerRef}>
            <LauncherToggle onClick={handleToggle} isSelected={showLauncherPopout} navMenuOpen={navMenuOpen} />
            <AppLauncher isActive={showLauncherPopout} />
        </PopoutContainer>
    );
};
