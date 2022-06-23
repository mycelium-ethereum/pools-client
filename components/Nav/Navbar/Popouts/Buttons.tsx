import React, { useRef } from 'react';
import SettingsSVG from '/public/img/general/settings.svg';
import SettingsPopout from '~/components/Nav/Navbar/Popouts/SettingsPopout';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import * as Styles from './styles';
export const AppLaunchButton: React.FC = () => {
    const [showLauncherPopout, setShowLauncherPopout] = React.useState(false);

    const handleToggle = () => {
        setShowLauncherPopout(!showLauncherPopout);
    };

    const handleClose = () => {
        setShowLauncherPopout(false);
    };

    const launcherContainerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(launcherContainerRef, handleClose);

    return (
        <Styles.AppLaunchNavButton onClick={handleToggle} selected={showLauncherPopout}>
            <Styles.CubeGrid>
                {Array.from({ length: 9 }).map((_, i) => (
                    <Styles.Cube key={i} />
                ))}
            </Styles.CubeGrid>
        </Styles.AppLaunchNavButton>
    );
};

export const SettingsButton: React.FC = () => {
    const [showSettingsPopout, setShowSettingsPopout] = React.useState(false);

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
