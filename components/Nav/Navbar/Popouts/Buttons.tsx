import React, { useEffect, useState, useRef } from 'react';
import SettingsSVG from '/public/img/general/settings.svg';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import * as Styles from './styles';
import AppLauncher from '~/components/Nav/Navbar/Popouts/AppLauncher';

export const PopoutButtons: React.FC = () => {
    const [showSettingsPopout, setShowSettingsPopout] = useState(false);
    const [showLauncherPopout, setShowLauncherPopout] = useState(false);

    // Close popout that is not currently open
    useEffect(() => {
        if (showLauncherPopout) {
            setShowSettingsPopout(false);
        }
        if (showSettingsPopout) {
            setShowLauncherPopout(false);
        }
    }, [showLauncherPopout, showSettingsPopout]);

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
        <Styles.PopoutContainer ref={settingsContainerRef}>
            <Styles.SettingsNavButton onClick={handleToggle} selected={showSettingsPopout}>
                <SettingsSVG alt="Settings icon" />
            </Styles.SettingsNavButton>
            <SettingsPopout isActive={showSettingsPopout} />
        </Styles.PopoutContainer>
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
        <Styles.PopoutContainer ref={launcherContainerRef}>
            <Styles.AppLaunchNavButton onClick={handleToggle} selected={showLauncherPopout}>
                <Styles.CubeGrid>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <Styles.Cube key={i} />
                    ))}
                </Styles.CubeGrid>
            </Styles.AppLaunchNavButton>
            <AppLauncher isActive={showLauncherPopout} />
        </Styles.PopoutContainer>
    );
};
