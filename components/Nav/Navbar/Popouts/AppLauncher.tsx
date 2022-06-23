import React from 'react';
import { useStore } from '~/store/main';
import { selectIsDark } from '~/store/ThemeSlice';
import TracerLogo from '/public/img/logos/tracer/tracer_logo.svg';
import PoolsLogo from '/public/img/logos/tracer/tracer_perpetual_pools_stacked.svg';
import DiscourseLogo from '/public/img/logos/launcher/discourse.svg';
import SnapshotLogo from '/public/img/logos/launcher/snapshot.svg';
import GitbookLogo from '/public/img/logos/launcher/gitbook.svg';
import GithubLogo from '/public/img/logos/launcher/github.svg';
import TwitterLogo from '/public/img/logos/launcher/twitter.svg';
import DiscordLogo from '/public/img/logos/launcher/discord.svg';
import MediumLogo from '/public/img/logos/launcher/medium.svg';
import {
    AppRow,
    ButtonRow,
    GovernanceButton,
    GovernanceRow,
    Launcher,
    LinkRow,
    PoolsButton,
    SocialIconRow,
    TracerButton,
} from './styles';

const AppLauncher: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const isDark = useStore(selectIsDark);

    return (
        <Launcher isActive={isActive} className={isDark ? 'dark' : ''}>
            <AppRow>
                <TracerButton>
                    <TracerLogo />
                </TracerButton>
                <PoolsButton>
                    <PoolsLogo />
                </PoolsButton>
            </AppRow>
            <GovernanceRow>
                <span>Governance</span>
                <ButtonRow>
                    <GovernanceButton>
                        <DiscourseLogo />
                        <span>Forum</span>
                    </GovernanceButton>
                    <GovernanceButton>
                        <SnapshotLogo />
                        <span>Voting</span>
                    </GovernanceButton>
                </ButtonRow>
            </GovernanceRow>
            <LinkRow>
                <GitbookLogo />
                <span>Documentation</span>
            </LinkRow>
            <LinkRow>
                <GithubLogo />
                <span>Github</span>
            </LinkRow>
            <SocialIconRow>
                <TwitterLogo />
                <DiscordLogo />
                <MediumLogo />
            </SocialIconRow>
        </Launcher>
    );
};

export default AppLauncher;
