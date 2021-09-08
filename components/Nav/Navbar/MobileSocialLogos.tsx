import React from 'react';
import styled from 'styled-components';

import DiscourseLogo from '/public/img/socials/discourse-white.svg';
import TwitterLogo from '/public/img/socials/twitter-white.svg';
import GitHubLogo from '/public/img/socials/github-white.svg';
import DiscordLogo from '/public/img/socials/discord-white.svg';

export default styled((props) => (
    <div {...props}>
        <SocialIcon href="https://discourse.tracer.finance/" target="_blank">
            <DiscourseLogo />
        </SocialIcon>
        <SocialIcon href="https://twitter.com/tracer_finance" target="_blank">
            <TwitterLogo />
        </SocialIcon>
        <SocialIcon href="https://github.com/tracer-protocol/" target="_blank">
            <GitHubLogo />
        </SocialIcon>
        <SocialIcon href="https://discord.gg/sS7QFWWyYa" target="_blank">
            <DiscordLogo />
        </SocialIcon>
    </div>
))`
    width: 60%;
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
`;

const SocialIcon = styled.a`
    &:hover svg path {
        transition: 0.3s;
        fill: #3da8f5;
    }
`;
