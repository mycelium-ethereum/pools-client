import React from 'react';
import Link from 'next/link';

import DiscourseLogo from '/public/img/socials/discourse.svg';
import TwitterLogo from '/public/img/socials/twitter.svg';
import GitHubLogo from '/public/img/socials/github.svg';
import DiscordLogo from '/public/img/socials/discord.svg';

const item = 'ml-0 mb-4 lg:mb-0 lg:ml-8 last:mb-0';

const Footer: React.FC = () => {
    return (
        <div className={'flex container flex-col lg:flex-row justify-between mt-auto py-4 px-4 md:px-0 text-gray-900'}>
            <span className="whitespace-nowrap">&copy; 2021 Tracer DAO</span>
            <div className="flex my-6 lg:my-0 ">
                <a
                    className="my-auto mx-2 transition-opacity hover:opacity-80"
                    href="https://discourse.tracer.finance"
                    target="_blank"
                    rel="noreferrer"
                >
                    <DiscourseLogo />
                </a>
                <a
                    className="my-auto mx-2 transition-opacity hover:opacity-80"
                    href="https://twitter.com/TracerDAO"
                    target="_blank"
                    rel="noreferrer"
                >
                    <TwitterLogo />
                </a>
                <a
                    className="my-auto mx-2 transition-opacity hover:opacity-80"
                    href="https://github.com/tracer-protocol"
                    target="_blank"
                    rel="noreferrer"
                >
                    <GitHubLogo />
                </a>
                <a
                    className="my-auto mx-2 transition-opacity hover:opacity-80"
                    href="https://discord.com/invite/kddBUqDVVb"
                    target="_blank"
                    rel="noreferrer"
                >
                    <DiscordLogo />
                </a>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className={item}>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </div>
                <div className={item}>
                    <Link href="/terms-of-use">Terms of Use</Link>
                </div>
                <div className={item}>
                    <Link href="/disclaimer">Disclaimer</Link>
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
                    <a href="https://tracer.finance/radar/sigma-prime-audit-response/" target="_blank" rel="noreferrer">
                        Security Audit
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
