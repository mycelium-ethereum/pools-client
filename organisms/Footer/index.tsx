import React from 'react';
import Link from 'next/link';
import { FooterLink, FooterItem } from '@atoms/Footer'

import GitbookLogo from '@public/img/socials/gitbook.svg';
import DiscourseLogo from '@public/img/socials/discourse.svg';
import TwitterLogo from '@public/img/socials/twitter.svg';
import GitHubLogo from '@public/img/socials/github.svg';
import DiscordLogo from '@public/img/socials/discord.svg';


const Footer: React.FC = () => {
    return (
        <div className={'container mt-auto py-4'}>
            <div className="flex flex-col lg:flex-row justify-between px-4 md:px-0">
                <span className="whitespace-nowrap">&copy; 2021 Tracer DAO</span>
                <div className="flex my-6 lg:my-0 ">
                    <FooterLink link="https://docs.tracer.finance">
                        <GitbookLogo className="w-7" />
                    </FooterLink>
                    <FooterLink link="https://discourse.tracer.finance">
                        <DiscourseLogo className="w-7" />
                    </FooterLink>
                    <FooterLink link="https://twitter.com/TracerDAO">
                        <TwitterLogo className="w-7" />
                    </FooterLink>
                    <FooterLink link="https://github.com/tracer-protocol">
                        <GitHubLogo className="w-7" />
                    </FooterLink>
                    <FooterLink link="https://discord.com/invite/kddBUqDVVb">
                        <DiscordLogo className="w-7" />
                    </FooterLink>
                </div>
                <div className="flex flex-col lg:flex-row">
                    <FooterItem>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </FooterItem>
                    <FooterItem>
                        <Link href="/terms-of-use">Terms of Use</Link>
                    </FooterItem>
                    <FooterItem>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </FooterItem>
                    <FooterItem>
                        <a
                            href="https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Participation Agreement
                        </a>
                    </FooterItem>
                    <FooterItem>
                        <a
                            href="https://tracer.finance/radar/sigma-prime-audit-response/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Security Audit
                        </a>
                    </FooterItem>
                </div>
            </div>
        </div>
    );
};

export default Footer;
