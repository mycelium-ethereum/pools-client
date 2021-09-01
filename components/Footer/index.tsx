import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { GithubOutlined, TwitterOutlined } from '@ant-design/icons';

const Footer = styled(({ className }) => {
    return (
        <FooterContent className={`${className} container`}>
            <Copyright>&copy; 2021 Tracer DAO</Copyright>
            <Socials>
                <TwitterOutlined />
                <GithubOutlined />
            </Socials>
            <Section>
                <Item>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </Item>
                <Item>
                    <Link href="/terms-of-use">Terms of Use</Link>
                </Item>
                <Item>
                    <Link href="/disclaimer">Disclaimer</Link>
                </Item>
                <Item>
                    <a onClick={() => window.open('https://docs.tracer.finance', '_blank', 'noopener')}>Docs</a>
                </Item>
                <Item>
                    <a
                        onClick={() =>
                            window.open('https://docs.tracer.finance/perpetual-swaps-faq', '_blank', 'noopener')
                        }
                    >
                        FAQs
                    </a>
                </Item>
                <Item>
                    <a
                        onClick={() =>
                            window.open('https://docs.tracer.finance/trader-tutorials', '_blank', 'noopener')
                        }
                    >
                        Tutorials
                    </a>
                </Item>
            </Section>
        </FooterContent>
    );
})`
    display: flex;
    color: #27272a;
    margin-top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 1rem;

    @media (max-width: 768px) {
        padding: 0 0.5rem 1rem 0.5rem;
`;

const FooterContent = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Section = styled.div`
    display: flex;
    @media (max-width: 1127px) {
        display: none;
    }
`;
const Socials = styled.div`
    margin-right: auto;
    margin-left: auto;
    @media (max-width: 1127px) {
        margin-right: 0;
    }
    & svg {
        display: inline;
        height: 18px;
        width: 18px;
        margin: 0 1rem;
        color: #27272a;
    }
`;

const Item = styled.div`
    margin-left: 2rem;
    color: #27272a;
    display: inline;
`;

const Copyright = styled.div`
    white-space: nowrap;
    color: #27272a;
    display: inline;
`;

export default Footer;
