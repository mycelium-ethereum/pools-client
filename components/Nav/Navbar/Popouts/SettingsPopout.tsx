import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import shallow from 'zustand/shallow';
import { useStore } from '~/store/main';
import { selectThemeSlice } from '~/store/ThemeSlice';
import * as Styles from './styles';

const SettingsPopout: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const router = useRouter();
    const [v2selected, setV2Selected] = useState(true);
    const { isDark, toggleTheme } = useStore(selectThemeSlice, shallow);
    const basePath = 'https://poolsv1.tracer.finance';

    const getRoute = useCallback(() => {
        if (router.route === '/') {
            return `${basePath}/pools`;
        } else {
            // assumes that the destination base path appropriately handles redirects
            return `${basePath}${router.route}`;
        }
    }, [router.route]);

    const handleVersionSwitch = () => {
        setV2Selected(!v2selected);
        // Wait for toggle animation to complete before navigating to v1
        setTimeout(() => {
            open(getRoute(), '_self');
        }, 600);
    };

    return (
        <Styles.Popout isActive={isActive}>
            <Styles.VersionSelector borderBottom>
                <Styles.PopoutText>Version Selector</Styles.PopoutText>
                <Styles.ToggleSwitch onClick={handleVersionSwitch}>
                    <Styles.SwitchOption selected={!v2selected}>V1</Styles.SwitchOption>
                    <Styles.SwitchOption selected={v2selected}>V2</Styles.SwitchOption>
                    <Styles.Slider isSwitchedOn={v2selected} />
                </Styles.ToggleSwitch>
            </Styles.VersionSelector>
            <Styles.DarkModeSelector>
                <Styles.PopoutText>Dark Mode</Styles.PopoutText>
                <Styles.ToggleSwitch onClick={toggleTheme}>
                    <Styles.SwitchOption selected={!isDark}>Off</Styles.SwitchOption>
                    <Styles.SwitchOption selected={isDark}>On</Styles.SwitchOption>
                    <Styles.Slider isSwitchedOn={isDark} />
                </Styles.ToggleSwitch>
            </Styles.DarkModeSelector>
        </Styles.Popout>
    );
};

export default SettingsPopout;
