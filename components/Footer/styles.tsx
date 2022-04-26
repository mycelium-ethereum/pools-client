import styled from 'styled-components';
import DiscordLogo from '~/public/img/socials/discord.svg';
import DiscourseLogo from '~/public/img/socials/discourse.svg';
import GitbookLogo from '~/public/img/socials/gitbook.svg';
import GitHubLogo from '~/public/img/socials/github.svg';
import TwitterLogo from '~/public/img/socials/twitter.svg';

export const Container = styled.div`
    transition: 0.3s;
    margin-top: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.background.primary};
    width: 100vw;

    @media ${({ theme }) => theme.device.md} {
        padding: 1rem 0;
        align-items: center;
    }

    @media ${({ theme }) => theme.device.xl} {
        flex-direction: row;
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    @media ${({ theme }) => theme.device.md} {
        min-width: 768px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    @media ${({ theme }) => theme.device.xl} {
        min-width: auto;
        width: 33%;
    }
`;

export const Copyright = styled.span`
    white-space: nowrap;
    text-align: center;
    margin-top: 1rem;

    @media ${({ theme }) => theme.device.md} {
        margin-top: 0;
        width: 50%;
    }
`;

export const SocialLinks = styled.a.attrs({
    target: '_blank',
    rel: 'noreferrer',
})`
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
`;

export const Discord = styled(DiscordLogo)`
    width: 1.75rem;
`;

export const Discourse = styled(DiscourseLogo)`
    width: 1.75rem;
`;

export const GitBook = styled(GitbookLogo)`
    width: 1.75rem;
`;

export const GitHub = styled(GitHubLogo)`
    width: 1.75rem;
`;

export const Twitter = styled(TwitterLogo)`
    width: 1.75rem;
`;

export const SocialWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    margin: 1.5rem 0;

    @media ${({ theme }) => theme.device.md} {
        width: 50%;
        margin: 0.5rem 0 1.5rem;
    }

    @media ${({ theme }) => theme.device.xl} {
        margin: 0;
    }
`;

export const NavWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media ${({ theme }) => theme.device.md} {
        min-width: 768px;
        flex-direction: row;
        justify-content: space-evenly;
    }

    @media ${({ theme }) => theme.device.xl} {
        min-width: auto;
        width: 66%;
    }
`;

export const NavLinks = styled.a.attrs({
    target: '_blank',
    rel: 'noreferrer',
})`
    margin-bottom: 0.5rem;
    text-align: center;

    &:hover {
        color: #3da8f5;
    }
`;
