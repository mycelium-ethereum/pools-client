import React, { useCallback, useState } from 'react';
// import { useRouter } from 'next/router';
// import shallow from 'zustand/shallow';
// import { useStore } from '~/store/main';
// import { selectThemeSlice } from '~/store/ThemeSlice';
import * as Styles from './styles';
import TracerLogo from '/public/img/logos/tracer/tracer_logo.svg';
import PoolsLogo from '/public/img/logos/tracer/tracer_perpetual_pools_stacked.svg';
import DiscourseLogo from '/public/img/logos/launcher/discourse.svg';
import SnapshotLogo from '/public/img/logos/launcher/snapshot.svg';
import GitbookLogo from '/public/img/logos/launcher/gitbook.svg';
import GithubLogo from '/public/img/logos/launcher/github.svg';
import TwitterLogo from '/public/img/logos/launcher/twitter.svg';
import DiscordLogo from '/public/img/logos/launcher/discord.svg';
import MediumLogo from '/public/img/logos/launcher/medium.svg';

const AppLauncher: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    return (
        <Styles.Launcher isActive={isActive}>
            <Styles.AppRow>
                <Styles.TracerButton>
                    <TracerLogo />
                </Styles.TracerButton>
                <Styles.PoolsButton>
                    <PoolsLogo />
                </Styles.PoolsButton>
            </Styles.AppRow>
            <Styles.GovernanceRow>
                <span>Governance</span>
                <Styles.ButtonRow>
                    <Styles.GovernanceButton>
                        <DiscourseLogo />
                        <span>Forum</span>
                    </Styles.GovernanceButton>
                    <Styles.GovernanceButton>
                        <SnapshotLogo />
                        <span>Voting</span>
                    </Styles.GovernanceButton>
                </Styles.ButtonRow>
            </Styles.GovernanceRow>
            <Styles.LinkRow>
                <GitbookLogo />
                <span>Documentation</span>
            </Styles.LinkRow>
            <Styles.LinkRow>
                <GithubLogo />
                <span>Github</span>
            </Styles.LinkRow>
            <Styles.SocialIconRow>
                <TwitterLogo />
                <DiscordLogo />
                <MediumLogo />
            </Styles.SocialIconRow>
        </Styles.Launcher>
    );
};

export default AppLauncher;
