import React, { useState } from 'react';
import shallow from 'zustand/shallow';
import {
    Slider,
    VersionSelector,
    ToggleSwitch,
    SwitchOption,
    DarkModeSelector,
    StyledSettingsPopout,
    ANIMATION_DURATION,
} from '~/components/Nav/Navbar/Popouts/styles';
import { useStore } from '~/store/main';
import { selectThemeSlice } from '~/store/ThemeSlice';

const SettingsPopout: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const [v2selected, setV2Selected] = useState(true);
    const { isDark, toggleTheme } = useStore(selectThemeSlice, shallow);
    const v1url = 'https://poolsv1.tracer.finance';

    const handleVersionSwitch = () => {
        setV2Selected(!v2selected);
        // Wait for toggle animation to complete before navigating to v1
        setTimeout(() => {
            open(v1url, '_self');
        }, ANIMATION_DURATION * 1000 * 2);
    };

    return (
        <StyledSettingsPopout isActive={isActive}>
            <VersionSelector borderBottom>
                <span>Version Selector</span>
                <ToggleSwitch onClick={handleVersionSwitch}>
                    <SwitchOption selected={!v2selected}>V1</SwitchOption>
                    <SwitchOption selected={v2selected}>V2</SwitchOption>
                    <Slider isSwitchedOn={v2selected} />
                </ToggleSwitch>
            </VersionSelector>
            <DarkModeSelector>
                <span>Dark Mode</span>
                <ToggleSwitch onClick={toggleTheme}>
                    <SwitchOption selected={!isDark}>Off</SwitchOption>
                    <SwitchOption selected={isDark}>On</SwitchOption>
                    <Slider isSwitchedOn={isDark} />
                </ToggleSwitch>
            </DarkModeSelector>
        </StyledSettingsPopout>
    );
};

export default SettingsPopout;
