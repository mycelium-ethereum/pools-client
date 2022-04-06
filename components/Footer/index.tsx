import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

import DiscordLogo from '~/public/img/socials/discord.svg';
import DiscourseLogo from '~/public/img/socials/discourse.svg';
import GitbookLogo from '~/public/img/socials/gitbook.svg';
import GitHubLogo from '~/public/img/socials/github.svg';
import TwitterLogo from '~/public/img/socials/twitter.svg';

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
        <div className={'container mt-auto py-4'}>
            <div className="flex flex-col justify-between px-4 md:px-0 lg:flex-row">
                <span className="whitespace-nowrap">
                    &copy; <span ref={yearRef} /> Tracer DAO
                </span>
                <div className="my-6 flex lg:my-0 ">
                    <a
                        className="my-auto mr-4 transition-opacity hover:opacity-80"
                        href="https://docs.tracer.finance"
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
                        href="https://github.com/tracer-protocol"
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
                        <a href="https://tracer.finance/privacy-policy">Privacy Policy</a>
                    </div>
                    <div className={item}>
                        <a href="https://tracer.finance/privacy-policy#terms-of-use">Terms of Use</a>
                    </div>
                    <div className={item}>
                        <a href="https://tracer.finance/privacy-policy#interfaces-disclaimer">Disclaimer</a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Participation Agreement
                        </a>
                    </div>
                    <div className={item}>
                        <a
                            href="https://tracer.finance/radar/sigma-prime-audit-response/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Security Audit
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
