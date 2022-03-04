import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Icon from '@ant-design/icons';

import { classNames } from '@libs/utils/functions';
import { Transition } from '@headlessui/react';
import TracerBox from '@public/img/logos/tracer/tracer_icon_box.svg';

// Images
import DiscourseLogo from '@public/img/socials/discourse.svg';
import TwitterLogo from '@public/img/socials/twitter.svg';
import GitHubLogo from '@public/img/socials/github.svg';
import DiscordLogo from '@public/img/socials/discord.svg';
import Folder from '@public/img/general/folder.svg';

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
        href: 'https://github.com/tracer-protocol/',
        logo: <GitHubLogo className={icon} />,
    },
    {
        text: 'Discord',
        href: 'https://discord.gg/7rhrmYkAJs',
        logo: <DiscordLogo className={icon} />,
    },
];

const ArrowDown = '/img/general/caret-down-white.svg';

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
                        className="sm:w-24 w-22 h-auto hidden md:block cursor-pointer"
                        alt="tracer-logo"
                        src={'/img/logos/tracer/tracer_logo.svg'}
                    />
                    <img
                        className="w-12 h-auto block md:hidden cursor-pointer"
                        src={'/img/logos/tracer/tracer_no_text.svg'}
                        alt="Tracer Logo"
                    />
                </div>
            </Link>
            <button
                id="toggle"
                className="flex pl-3 w-22 h-22 left-0 top-0 z-0 justify-center items-center cursor-pointer outline-none border-none"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
            >
                <img
                    className={classNames('w-4 h-auto transition-all duration-500 transform', open ? 'rotate-180' : '')}
                    src={ArrowDown}
                    alt="Dropdown toggle"
                />
            </button>
            <div
                className={classNames(
                    open ? 'scale-100' : 'scale-0',
                    'block fixed md:absolute transform-gpu origin-top-left z-20 box-border transition-all w-[350px] sm:px-8 px-4 top-16 md:top-[4.5rem] left-0 duration-700',
                )}
            >
                <div
                    className={
                        'backdrop-filter backdrop-blur bg-tracer-800 bg-opacity-80 absolute top-0 left-0 h-full w-full rounded-lg'
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
                    className="relative sm:mt-8 my-4"
                >
                    <DropdownOption
                        href={'https://pools.tracer.finance'}
                        label={'Perpetual Pools'}
                        boxColor={'#7912fc'}
                    />
                    <DropdownOption href={'https://vote.tracer.finance/#/'} label={'Governance'} boxColor={'#1AAA8D'} />
                    <DropdownOption
                        href={'https://docs.tracer.finance/'}
                        label={'Documentation'}
                        boxColor={'#1e5cf5'}
                    />
                    <div className="mt-12">
                        {Icons.map((icon, i) => (
                            <a
                                className="w-fit sm:px-2 transition-all duration-300 flex items-center mt-5 rounded-lg hover:opacity-50"
                                href={icon.href}
                                rel="noreferrer"
                                target="_blank"
                                key={i}
                            >
                                <span>{icon.logo}</span>
                                <span className="block text-white font-normal my-auto">{icon.text}</span>
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
        className={'flex w-fit pr-2 mb-6 transition-all duration-300 rounded-lg hover:bg-tracer-900 bg-opacity-50'}
        href={href}
        rel="noreferrer"
        target="_blank"
    >
        <TBox
            component={TracerBox}
            className="box h-[48px] w-[48px] mr-3"
            style={{ color: boxColor }}
            alt="Tracer Box"
        />
        <span className="block text-white font-normal my-auto">
            <p>Tracer</p>
            <p>
                <b>{label}</b>
            </p>
        </span>
    </a>
);

export default DropdownMenu;
