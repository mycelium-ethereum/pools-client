import React, { useEffect, useRef } from 'react';
import { footerLinkContent, footerSocialContent } from '~/components/Footer/footerContent';
import { Container } from '../General/Container';
import HelpIconSVG from '/public/img/general/help.svg';

const Footer: React.FC<{
    setShowOnboardModal?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    const yearRef = useRef<HTMLSpanElement>(null);
    const setCopyrightYear = () => {
        (yearRef.current as HTMLSpanElement).innerText = new Date().getFullYear().toString();
    };

    useEffect(() => {
        setCopyrightYear();
    }, []);

    const transitionStyles = `transition-colors duration-300`;
    const linkStyles = `dark:hover:opacity-80 ml-0 lg:mb-0 xl:ml-10 last:mb-0 text-sm leading-[21px] whitespace-nowrap ${transitionStyles}`;

    return (
        <footer>
            <Container className="mt-auto">
                <hr className="border-t-[0.5px] border-tracer-650 dark:border-white" />
                <div className="flex flex-col-reverse justify-between py-6 font-aileron text-tracer-650 dark:text-white md:px-0 xl:flex-row">
                    <div className="flex flex-col-reverse items-center justify-between xl:justify-start xs:flex-row">
                        <span className="whitespace-nowrap text-sm leading-[21px]">
                            &copy; <span ref={yearRef} /> Tracer DAO
                        </span>
                        <div className="mb-4 flex items-center xs:ml-10 xs:mb-0">
                            {footerSocialContent.map((item) => (
                                <a
                                    key={item.alt}
                                    className="mr-4 last:mr-0"
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${item.alt} link`}
                                >
                                    <item.logo
                                        alt={`${item.alt} icon`}
                                        className={`${item.className} ${transitionStyles}`}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mb-8 flex flex-col items-center justify-between md:mb-10 xl:mb-0 xl:items-center xl:justify-start xs:flex-row xs:items-start">
                        <div className="mb-4 grid min-w-[290px] grid-cols-2 items-center gap-y-4 gap-x-12 md:grid-cols-3 xl:flex xl:gap-0 xs:mb-0 xs:w-max">
                            {footerLinkContent.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-color-inherit"
                                >
                                    <div className={linkStyles}>{item.label}</div>
                                </a>
                            ))}
                        </div>
                        {setShowOnboardModal && <HelpIcon setShowOnboardModal={setShowOnboardModal} />}
                    </div>
                </div>
            </Container>
        </footer>
    );
};

const HelpIcon: React.FC<{
    setShowOnboardModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowOnboardModal }) => {
    return (
        <button
            className="xs:ml-10"
            // className="fixed bottom-5 right-5 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded bg-tracer-500 lg:right-8 lg:bottom-8"
            onClick={() => {
                setShowOnboardModal(true);
            }}
        >
            <HelpIconSVG />
        </button>
    );
};

export default Footer;
