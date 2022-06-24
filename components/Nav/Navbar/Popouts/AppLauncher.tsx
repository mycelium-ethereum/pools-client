import React from 'react';
import {
    appButtonContent,
    governanceContent,
    linkContent,
    socialLinkContent,
} from '~/components/Nav/Navbar/Popouts/launcherContent';
import { useStore } from '~/store/main';
import { selectIsDark } from '~/store/ThemeSlice';
import {
    Link,
    AppRow,
    ButtonRow,
    AppRowButton,
    GovernanceButton,
    GovernanceRow,
    Launcher,
    LinkRow,
    SocialIconRow,
} from './styles';

const AppLauncher: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const isDark = useStore(selectIsDark);

    return (
        <Launcher isActive={isActive} className={isDark ? 'dark' : ''}>
            <AppRow>
                {appButtonContent.map((content, i) => (
                    <AppRowButton key={i} href={content.link}>
                        <content.LogoImage alt={content.alt} />
                    </AppRowButton>
                ))}
            </AppRow>
            <GovernanceRow>
                <span>Governance</span>
                <ButtonRow>
                    {governanceContent.map((content, i) => (
                        <GovernanceButton key={i} href={content.link}>
                            <content.LogoImage alt={content.alt} />
                            <span>{content.label}</span>
                        </GovernanceButton>
                    ))}
                </ButtonRow>
            </GovernanceRow>
            {linkContent.map((content, i) => (
                <Link key={i} href={content.link}>
                    <LinkRow>
                        <content.LogoImage alt={content.alt} />
                        <span>{content.label}</span>
                    </LinkRow>
                </Link>
            ))}
            <SocialIconRow>
                {socialLinkContent.map((content, i) => (
                    <Link key={i} href={content.link}>
                        <content.LogoImage key={i} alt={content.alt} />
                    </Link>
                ))}
            </SocialIconRow>
        </Launcher>
    );
};

export default AppLauncher;
