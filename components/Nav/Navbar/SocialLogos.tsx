import React from 'react';
import styled from 'styled-components';

import DiscourseLogo from '/public/img/socials/discourse-white.svg';
import TwitterLogo from '/public/img/socials/twitter-white.svg';
import GitHubLogo from '/public/img/socials/github-white.svg';
import DiscordLogo from '/public/img/socials/discord-white.svg';
import Folder from '/public/img/general/folder.svg';
import Icon from '@ant-design/icons';

const Icons: {
    text: string;
    href: string;
    logo: any;
}[] = [
    {
        text: 'Website',
        href: 'https://tracer.finance',
        logo: Folder,
    },
    {
        text: 'Twitter',
        href: 'https://twitter.com/TracerDAO',
        logo: TwitterLogo,
    },
    {
        text: 'Discourse',
        href: 'https://discourse.tracer.finance/',
        logo: DiscourseLogo,
    },
    {
        text: 'Github',
        href: 'https://github.com/tracer-protocol/',
        logo: GitHubLogo,
    },
    {
        text: 'Discord',
        href: 'https://discord.gg/7rhrmYkAJs',
        logo: DiscordLogo,
    },
];

export default (() => (
    <div className="pt-3 pl-8">
        {Icons.map((icon) => (
            <IconRow key={`${icon.text}-icon`} className="pb-2">
                <a href={icon.href} target="_blank" rel="noreferrer">
                    <span>
                        <StyledIcon component={icon.logo} />
                    </span>
                    <span>{icon.text}</span>
                </a>
            </IconRow>
        ))}
    </div>
)) as React.FC;

const StyledIcon = styled(Icon)`
    opacity: 0.8;
    transition: 0.3s;
    vertical-align: 0.125rem;
    margin-right: 0.5rem;
`;

const IconRow = styled.div`
    &:hover {
        ${StyledIcon} {
            opacity: 1;
        }
    }
`;
