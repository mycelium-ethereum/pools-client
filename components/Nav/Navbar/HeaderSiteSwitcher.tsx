import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// @ts-ignore
import ArrowDown from '@public/img/general/caret_down.svg';
import Icon from '@ant-design/icons';

// @ts-ignore
import TracerBox from '@public/img/logos/tracer/tracer_icon_box.svg';
import SocialLogos from './SocialLogos';

export default (() => {
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
        <SiteSwitcher id="site-switcher" className={open ? 'open' : ''}>
            <MainLink onClick={() => setOpen(!open)}>
                <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_logo.svg" />
            </MainLink>

            <Arrow component={ArrowDown} />

            <HiddenBoxMenu>
                <MenuItem>
                    <a href="https://tracer.finance" target="_blank" rel="noreferrer noopener">
                        <StyledIcon component={TracerBox} style={{ color: '#7912FC' }} />
                        <span>
                            <div>Tracer</div>
                            <div className="font-bold">Perpetual Pools</div>
                        </span>
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://gov.tracer.finance" target="_blank" rel="noreferrer noopener">
                        <StyledIcon component={TracerBox} style={{ color: '#1AAA8D' }} />
                        <span>
                            <div>Tracer</div>
                            <div className="font-bold">Governance</div>
                        </span>
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://tracer.finance/radar" target="_blank" rel="noreferrer noopener">
                        <StyledIcon component={TracerBox} style={{ color: '#1E5CF5' }} />
                        <span>
                            <div>Tracer</div>
                            <div className="font-bold">Documentation</div>
                        </span>
                    </a>
                </MenuItem>
                <MenuItem>
                    <SocialLogos />
                </MenuItem>
            </HiddenBoxMenu>
        </SiteSwitcher>
    );
}) as React.FC;

const MainLink = styled.div`
    z-index: 11;
    cursor: pointer;
`;

const Arrow = styled(Icon)`
    height: 8px;
    width: 15px;
    transition: all 400ms ease-in-out;
    z-index: 11;
    vertical-align: 0;
`;

const StyledIcon = styled(Icon)`
    height: 41x;
    width: 41px;
    margin-right: 1rem;
    svg {
        width: 100%;
        height: 100%;
    }
`;

const StyledTracerLogo = styled.img`
    display: block;
    height: 1.7rem;
    margin-right: 2rem;
`;

const HiddenBoxMenu = styled.div`
    position: absolute;
    width: 353px;
    height: 425px;

    background: #0000b0;
    border-radius: 7px;
    left: 0;
    top: calc(100% + 1rem);
    right: -3.5rem;
    padding: 1.5rem 0;
    opacity: 0;
    transform-origin: top left;
    transform: scale(0.7, 0);
    transition: all 500ms ease-in-out;
    z-index: 10;
`;

const MenuItem = styled.div`
    color: #fff;
    transition: all 400ms ease;
    margin-bottom: 1rem;
    cursor: pointer;

    // initailly hide itself
    opacity: 0;
    padding-left: 2rem;

    > a {
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 2rem;
        transition: all 300ms ease;
    }

    > a:hover {
        background: #3da8f5;
    }
`;

const SiteSwitcher = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    &.open {
        ${Arrow} {
            transform: rotate(180deg);
        }
        ${HiddenBoxMenu} {
            opacity: 1;
            transform: none;
        }
        ${MenuItem} {
            opacity: 1;
            padding-left: 0;
        }
        ${MenuItem}:nth-child(2) {
            transition: all 400ms ease 300ms;
        }
        ${MenuItem}:nth-child(3) {
            transition: all 400ms ease 450ms;
        }
        ${MenuItem}:nth-child(4) {
            transition: all 400ms ease 600ms;
        }
        ${MenuItem}:nth-child(5) {
            transition: all 400ms ease 750ms;
            cursor: auto;
        }
    }
`;
