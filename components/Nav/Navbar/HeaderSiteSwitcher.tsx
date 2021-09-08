import React from 'react';
import MobileSocialLogos from './MobileSocialLogos';
import styled from 'styled-components';
import { Menu, MenuItem } from './HeaderDropdown';
// @ts-ignore
import ArrowDown from '@public/img/general/caret_down.svg';
import Icon from '@ant-design/icons';

export default (() => (
    <StyledHeaderSiteSwitcher>
        <MainLink href="/">
            <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_perps.svg" />
        </MainLink>

        <Arrow component={ArrowDown} />

        <Menu>
            <StyledMenuItem>
                <a href="https://tracer.finance" target="_blank" rel="noreferrer noopener">
                    <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_logo.svg" />
                </a>
            </StyledMenuItem>
            <StyledMenuItem>
                <a href="https://tracer.finance" target="_blank" rel="noreferrer noopener">
                    <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_logo.svg" />
                </a>
            </StyledMenuItem>
            <StyledMenuItem>
                <a href="https://gov.tracer.finance" target="_blank" rel="noreferrer noopener">
                    <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_govern.svg" />
                </a>
            </StyledMenuItem>
            <StyledMenuItem>
                <a href="https://tracer.finance/radar" target="_blank" rel="noreferrer noopener">
                    <StyledTracerLogo alt="tracer-logo" src="/img/logos/tracer/tracer_blog.svg" />
                </a>
            </StyledMenuItem>
            <StyledMenuItem>
                <MobileSocialLogos />
            </StyledMenuItem>
        </Menu>
    </StyledHeaderSiteSwitcher>
)) as React.FC;

const MainLink = styled.a`
    z-index: 11;
`;

const Arrow = styled(Icon)`
    height: 8px;
    width: 15px;
    transition: all 400ms ease-in-out;
    z-index: 11;
    vertical-align: 0;
`;

const StyledTracerLogo = styled.img`
    display: block;
    height: 1.7rem;
    margin-right: 2rem;
`;

const StyledMenuItem = styled(MenuItem)`
    &:first-child > ${StyledTracerLogo} {
        opacity: 0;
    }
`;

const StyledHeaderSiteSwitcher = styled.div`
    position: relative;
    display: flex;
    align-items: center;

    &:hover {
        ${Arrow} {
            transform: rotate(180deg);
        }
        ${Menu} {
            opacity: 1;
            transform: none;
        }
        ${MenuItem} {
            opacity: 1;
            cursor: pointer;
            padding-left: 0;
            &:last-child {
                cursor: auto;
                padding-left: 2rem;
            }
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
