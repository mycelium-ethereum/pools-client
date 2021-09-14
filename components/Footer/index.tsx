import React from 'react';
import styled from 'styled-components';

import DiscourseLogo from '/public/img/socials/discourse.svg';
import TwitterLogo from '/public/img/socials/twitter.svg';
import GitHubLogo from '/public/img/socials/github.svg';
import DiscordLogo from '/public/img/socials/discord.svg';

const Footer = styled(({ className }) => {
    return (
        <div className={className}>
            <Copyright>&copy; 2021 Tracer DAO</Copyright>
            <Socials>
                <SocialIcon href="https://discourse.tracer.finance" target="_blank">
                    <DiscourseLogo />
                </SocialIcon>
                <SocialIcon href="https://twitter.com/TracerDAO" target="_blank">
                    <TwitterLogo />
                </SocialIcon>
                <SocialIcon href="https://github.com/tracer-protocol" target="_blank">
                    <GitHubLogo />
                </SocialIcon>
                <SocialIcon href="https://discord.com/invite/kddBUqDVVb" target="_blank">
                    <DiscordLogo />
                </SocialIcon>
            </Socials>
            <Items>
                <Item>
                    <a href="/privacy-policy" target="_blank">
                        Privacy Policy
                    </a>
                </Item>
                <Item>
                    <a href="/terms-of-use" target="_blank">
                        Terms of Use
                    </a>
                </Item>
                <Item>
                    <a href="/disclaimer" target="_blank">
                        Disclaimer
                    </a>
                </Item>
                <Item>
                    <a
                        href="https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Participation Agreement
                    </a>
                </Item>
                <Item>
                    <a href="/security-audit.pdf" target="_blank">
                        Security Audit
                    </a>
                </Item>
                {/*<Item>*/}
                {/*    <a href="https://docs.tracer.finance" target="_blank" rel="noreferrer">*/}
                {/*        Docs*/}
                {/*    </a>*/}
                {/*</Item>*/}
                {/*<Item>*/}
                {/*    <a href="https://docs.tracer.finance/faqs/perpetual-swaps-faq" target="_blank" rel="noreferrer">*/}
                {/*        FAQs*/}
                {/*    </a>*/}
                {/*</Item>*/}
                {/*<Item>*/}
                {/*    <a href="https://docs.tracer.finance/tutorials/trader-tutorials" target="_blank" rel="noreferrer">*/}
                {/*        Tutorials*/}
                {/*    </a>*/}
                {/*</Item>*/}
            </Items>
        </div>
    );
})`
    display: flex;
    justify-content: space-between;
    color: #27272a;
    margin-top: auto;
    padding: 1rem 2rem;

    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

const Socials = styled.div`
    display: flex;

    @media (max-width: 1024px) {
        margin: 2rem 0 3rem;
    }
`;
const SocialIcon = styled.a`
    margin: auto 0.5rem;

    &:hover svg path {
        transition: 0.3s;
        fill: #3da8f5;
    }
`;

const Items = styled.div`
    display: flex;

    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;
const Item = styled.div`
    margin-left: 2rem;

    @media (max-width: 1024px) {
        margin-left: 0;
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const Copyright = styled.div`
    white-space: nowrap;
    display: inline;
`;

export default Footer;
