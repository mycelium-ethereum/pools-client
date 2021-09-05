import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { GithubOutlined, TwitterOutlined } from '@ant-design/icons';

const Footer = styled(({ className }) => {
    return (
        <div className={`${className} flex flex-col md:flex-row md:justify-between p-8 w-full`}>
            <Copyright>&copy; 2021 Tracer DAO</Copyright>
            <Socials>
                <TwitterOutlined />
                <span className="w-8" />
                <GithubOutlined />
            </Socials>
            <div className="flex flex-col md:flex-row ">
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
                    <a
                        className="cursor-pointer"
                        onClick={() => window.open('https://docs.tracer.finance', '_blank', 'noopener')}
                    >
                        Docs
                    </a>
                </Item>
                <Item>
                    <a
                        className="cursor-pointer"
                        onClick={() =>
                            window.open('https://docs.tracer.finance/perpetual-swaps-faq', '_blank', 'noopener')
                        }
                    >
                        FAQs
                    </a>
                </Item>
                <Item>
                    <a
                        className="cursor-pointer"
                        onClick={() =>
                            window.open('https://docs.tracer.finance/trader-tutorials', '_blank', 'noopener')
                        }
                    >
                        Tutorials
                    </a>
                </Item>
            </div>
        </div>
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

const Socials = styled.div`
    @media (max-width: 768px) {
        margin: 2rem 0 3.5rem;
    }
    margin: 0.25rem 1rem 0 1rem;
    display: flex;
`;

const Item = styled.div`
    @media (max-width: 1023px) {
        margin-left: 1.5rem;
    }
    @media (max-width: 768px) {
        padding-bottom: 1rem;
        margin-left: 0;
    }
    margin-left: 3.5rem;
    color: #27272a;
    display: inline;
`;

const Copyright = styled.div`
    white-space: nowrap;
    color: #27272a;
    display: inline;
`;

export default Footer;
