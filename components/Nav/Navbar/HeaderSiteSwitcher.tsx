import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@ant-design/icons';
import { Transition } from '@headlessui/react';
import styled from 'styled-components';

import ArrowDown from '~/public/img/general/caret-down-white.svg';
import Folder from '~/public/img/general/folder.svg';
import TracerBox from '~/public/img/logos/tracer/tracer_icon_box.svg';
import DiscordLogo from '~/public/img/socials/discord.svg';
import DiscourseLogo from '~/public/img/socials/discourse.svg';
import GitHubLogo from '~/public/img/socials/github.svg';
import TwitterLogo from '~/public/img/socials/twitter.svg';
import { classNames } from '~/utils/helpers';

// Images

const icon = 'w-5 mr-2 opacity-70 text-white';
const Icons = [
    {
        text: 'Website',
        href: 'https://tracer.finance',
        logo: <Folder className={icon} />,
    },
    {
        text: 'Twitter',
        href: 'https://twitter.com/TracerDAO',
        logo: <TwitterLogo className={icon} />,
    },
    {
        text: 'Discourse',
        href: 'https://discourse.tracer.finance/',
        logo: <DiscourseLogo className={icon} />,
    },
    {
        text: 'Github',
        href: 'https://github.com/tracer-protocol/perpetual-pools-contracts',
        logo: <GitHubLogo className={icon} />,
    },
    {
        text: 'Discord',
        href: 'https://discord.gg/7rhrmYkAJs',
        logo: <DiscordLogo className={icon} />,
    },
];

const DropdownMenu: React.FC = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            const dropdown = document.getElementById('site-switcher');
            if (dropdown) {
                console.debug('Closing site-switcher');
                if (!dropdown.contains(event.target)) {
                    setOpen(false);
                }
            }
        };
        if (!open) {
            document.removeEventListener('mousedown', handleClickOutside);
        } else {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);
    return (
        <div id="site-switcher" className="relative flex">
            <Link href="/">
                <div className="my-auto">
                    <img
                        className="w-22 hidden h-auto cursor-pointer sm:w-24 md:block"
                        alt="tracer-logo"
                        src={'/img/logos/tracer/tracer_logo.svg'}
                    />
                    <img
                        className="block h-auto w-12 cursor-pointer md:hidden"
                        src={'/img/logos/tracer/tracer_no_text.svg'}
                        alt="Tracer Logo"
                    />
                </div>
            </Link>
            <button
                id="toggle"
                className="w-22 h-22 outline-none left-0 top-0 z-0 flex cursor-pointer items-center justify-center border-none pl-3"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
            >
                <ArrowDown
                    className={classNames(
                        'h-auto w-4 transform text-white transition-all duration-500',
                        open ? 'rotate-180' : '',
                    )}
                    alt="Dropdown toggle"
                />
            </button>
            <div
                className={classNames(
                    open ? 'scale-100' : 'scale-0',
                    'fixed top-16 left-0 z-20 box-border block w-[350px] origin-top-left transform-gpu px-4 transition-all duration-700 sm:px-8 md:absolute md:top-[4.5rem]',
                )}
            >
                <div
                    className={
                        'absolute top-0 left-0 h-full w-full rounded-lg bg-tracer-800 bg-opacity-80 backdrop-blur backdrop-filter'
                    }
                />
                <Transition
                    show={open}
                    enter="transition-all duration-300 delay-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-all duration-75"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="relative my-4 sm:mt-8"
                >
                    <DropdownOption
                        href={'https://pools.tracer.finance'}
                        label={'Perpetual Pools'}
                        boxColor={'#7912fc'}
                    />
                    <DropdownOption href={'https://vote.tracer.finance/#/'} label={'Governance'} boxColor={'#1AAA8D'} />
                    <DropdownOption
                        href={'https://pools.docs.tracer.finance/'}
                        label={'Documentation'}
                        boxColor={'#1e5cf5'}
                    />
                    <div className="mt-12">
                        {Icons.map((icon, i) => (
                            <a
                                className="w-fit mt-5 flex items-center rounded-lg transition-all duration-300 hover:opacity-50 sm:px-2"
                                href={icon.href}
                                rel="noreferrer"
                                target="_blank"
                                key={i}
                            >
                                <span>{icon.logo}</span>
                                <span className="my-auto block font-normal text-white">{icon.text}</span>
                            </a>
                        ))}
                    </div>
                </Transition>
            </div>
        </div>
    );
};

const TBox = styled(Icon)`
    svg {
        width: 100%;
        height: 100%;
    }
`;

const DropdownOption: React.FC<{
    href: string;
    label: string;
    boxColor: string;
}> = ({ href, label, boxColor }) => (
    <a
        className={'w-fit mb-6 flex rounded-lg bg-opacity-50 pr-2 transition-all duration-300 hover:bg-tracer-900'}
        href={href}
        rel="noreferrer"
        target="_blank"
    >
        <TBox
            component={TracerBox}
            className="box mr-3 h-[48px] w-[48px]"
            style={{ color: boxColor }}
            alt="Tracer Box"
        />
        <span className="my-auto block font-normal text-white">
            <p>Tracer</p>
            <p>
                <b>{label}</b>
            </p>
        </span>
    </a>
);

export default DropdownMenu;
