import React, { useEffect, useRef } from 'react';

import DiscordLogo from '~/public/img/socials/discord.svg';
import DiscourseLogo from '~/public/img/socials/discourse.svg';
import GitbookLogo from '~/public/img/socials/gitbook.svg';
import GitHubLogo from '~/public/img/socials/github.svg';
import TwitterLogo from '~/public/img/socials/twitter.svg';
import { Container } from '../General/Container';

const item = 'ml-0 mb-4 lg:mb-0 ml-0 lg:ml-4 last:mb-0';

const Footer: React.FC = () => {
    const yearRef = useRef<HTMLSpanElement>(null);
    const setCopyrightYear = () => {
        (yearRef.current as HTMLSpanElement).innerText = new Date().getFullYear().toString();
    };

    useEffect(() => {
        setCopyrightYear();
    }, []);

    return (
        <Container className={'mt-auto py-4'}>
            <div className="flex flex-col justify-between px-4 md:px-0 lg:flex-row">
                <span className="whitespace-nowrap">
                    &copy; <span ref={yearRef} /> Tracer DAO
                </span>
                <div className="my-6 flex lg:my-0 ">
                    <a
                        className="my-auto mr-4 transition-opacity hover:opacity-80"
                        href="https://pools.docs.tracer.finance"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GitbookLogo className="w-7" />
                    </a>
                    <a
                        className="my-auto mr-4 transition-opacity hover:opacity-80"
                        href="https://discourse.tracer.finance"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <DiscourseLogo className="w-7" />
                    </a>
                    <a
                        className="my-auto mr-4 transition-opacity hover:opacity-80"
                        href="https://twitter.com/TracerDAO"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <TwitterLogo className="w-7" />
                    </a>
                    <a
                        className="my-auto mr-4 transition-opacity hover:opacity-80"
                        href="https://github.com/tracer-protocol/perpetual-pools-contracts"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <GitHubLogo className="w-7" />
                    </a>
                    <a
                        className="my-auto transition-opacity hover:opacity-80"
                        href="https://discord.com/invite/kddBUqDVVb"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <DiscordLogo className="w-7" />
                    </a>
                </div>
                <div className="flex flex-col lg:flex-row">
                    <div className={item}>
                        <a href="https://tracer.finance/privacy-policy" target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://tracer.finance/privacy-policy#terms-of-use"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms of Use
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://tracer.finance/privacy-policy#interfaces-disclaimer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Disclaimer
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Participation Agreement
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://docs.tracer.finance/security/audits-and-security"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Security Audits
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://feedback.tracer.finance/feature-requests"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Request a Feature
                        </a>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Footer;
