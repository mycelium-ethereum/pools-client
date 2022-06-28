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
    StyledLink,
    AppRow,
    ButtonRow,
    AppRowButton,
    GovernanceButton,
    GovernanceRow,
    Launcher,
    LinkRow,
    SocialIconRow,
    GradientBackground,
    AppBackgroundImage,
} from './styles';

const AppLauncher: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const isDark = useStore(selectIsDark);

    return (
        <Launcher isActive={isActive} className={isDark ? 'dark' : ''}>
            <AppRow>
                {appButtonContent.map((content, i) => (
                    <AppRowButton key={i} href={content.link}>
                        <content.LogoImage alt={content.alt} />
                        <AppBackgroundImage src={content.bgImage} />
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
                            <GradientBackground />
                        </GovernanceButton>
                    ))}
                </ButtonRow>
            </GovernanceRow>
            {linkContent.map((content, i) => (
                <StyledLink key={i} href={content.link}>
                    <LinkRow>
                        <content.LogoImage alt={content.alt} />
                        <span>{content.label}</span>
                        <GradientBackground />
                    </LinkRow>
                </StyledLink>
            ))}
            <SocialIconRow>
                {socialLinkContent.map((content, i) => (
                    <StyledLink key={i} href={content.link}>
                        <content.LogoImage key={i} alt={content.alt} />
                        <GradientBackground />
                    </StyledLink>
                ))}
            </SocialIconRow>
        </Launcher>
    );
};

export default AppLauncher;
