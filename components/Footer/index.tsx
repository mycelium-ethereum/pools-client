import React, { useEffect, useRef } from 'react';

import * as Styles from './styles';

const Footer: React.FC = () => {
    const yearRef = useRef<HTMLSpanElement>(null);
    const setCopyrightYear = () => {
        (yearRef.current as HTMLSpanElement).innerText = new Date().getFullYear().toString();
    };

    useEffect(() => {
        setCopyrightYear();
    }, []);

    return (
        <Styles.Container>
            <Styles.Wrapper>
                <Styles.Copyright>
                    &copy; <span ref={yearRef} /> Tracer DAO
                </Styles.Copyright>
                <Styles.SocialWrapper>
                    <Styles.SocialLinks href="https://docs.tracer.finance">
                        <Styles.GitBook />
                    </Styles.SocialLinks>
                    <Styles.SocialLinks href="https://discourse.tracer.finance">
                        <Styles.Discourse />
                    </Styles.SocialLinks>
                    <Styles.SocialLinks href="https://twitter.com/TracerDAO">
                        <Styles.Twitter />
                    </Styles.SocialLinks>
                    <Styles.SocialLinks href="https://github.com/tracer-protocol/perpetual-pools-contracts">
                        <Styles.GitHub />
                    </Styles.SocialLinks>
                    <Styles.SocialLinks href="https://discord.com/invite/kddBUqDVVb">
                        <Styles.Discord />
                    </Styles.SocialLinks>
                </Styles.SocialWrapper>
            </Styles.Wrapper>

            <Styles.NavWrapper>
                <Styles.NavLinks href="https://tracer.finance/privacy-policy">Privacy Policy</Styles.NavLinks>
                <Styles.NavLinks href="https://tracer.finance/privacy-policy#terms-of-use">
                    Terms of Use
                </Styles.NavLinks>
                <Styles.NavLinks href="https://tracer.finance/privacy-policy#interfaces-disclaimer">
                    Disclaimer
                </Styles.NavLinks>
                <Styles.NavLinks href="https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og">
                    Participation Agreement
                </Styles.NavLinks>
                <Styles.NavLinks href="https://docs.tracer.finance/audits-and-security/perpetual-pools">
                    Security Audits
                </Styles.NavLinks>
                <Styles.NavLinks href="/terms_and_conditions_tracer_competitions.pdf">
                    {'Competition T&Cs'}
                </Styles.NavLinks>
            </Styles.NavWrapper>
        </Styles.Container>
    );
};

export default Footer;
