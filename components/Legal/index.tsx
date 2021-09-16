import React, { useState } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';

import ArrowDown from '@public/img/general/caret-down-black.svg';
import Icon from '@ant-design/icons';

export const LegalPageLayout: React.FC = ({ children }) => {
    const route = useRouter().pathname;
    const [open, setOpen] = useState(false);
    return (
        <>
            <NavBar />
            <Dropdown onClick={() => setOpen(!open)}>
                {route === '/privacy-policy'
                    ? 'Privacy Policy'
                    : route === '/terms-of-use'
                    ? 'Terms of Use'
                    : 'Disclaimer'}
                <Arrow component={ArrowDown} />
                <HiddenMenu className={`${open ? 'show' : ''}`}>
                    <MenuItem className={`${route === '/privacy-policy' ? 'selected' : ''}`}>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </MenuItem>
                    <MenuItem className={`${route === '/terms-of-use' ? 'selected' : ''}`}>
                        <Link href="/terms-of-use">Terms of Use</Link>
                    </MenuItem>
                    <MenuItem className={`${route === '/disclaimer' ? 'selected' : ''}`}>
                        <Link href="/disclaimer">Disclaimer</Link>
                    </MenuItem>
                </HiddenMenu>
            </Dropdown>
            <LayoutWrapper className="container flex">
                <LeftPanel>
                    <ContentWrapper>
                        <NavMainTitle>Legal</NavMainTitle>
                        <NavTitle className={`${route === '/privacy-policy' ? 'selected' : ''}`}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </NavTitle>
                        <NavTitle className={`${route === '/terms-of-use' ? 'selected' : ''}`}>
                            <Link href="/terms-of-use">Terms of Use</Link>
                        </NavTitle>
                        <NavTitle className={`${route === '/disclaimer' ? 'selected' : ''}`}>
                            <Link href="/disclaimer">Disclaimer</Link>
                        </NavTitle>
                    </ContentWrapper>
                </LeftPanel>
                <RightPanel>
                    <ContentWrapper>{children}</ContentWrapper>
                </RightPanel>
            </LayoutWrapper>
            <Footer />
        </>
    );
};

const LayoutWrapper = styled.div``;

const Dropdown = styled.div`
    position: relative;
    display: none;
    cursor: pointer;
    font-size: 20px;
    font-weight: 500;
    margin: 30px 0 0 20px;
    width: fit-content;
    background-color: #fafafa;
    padding: 10px 20px;
    border-radius: 10px;

    @media (max-width: 1024px) {
        display: flex;
    }
`;

const Arrow = styled(Icon)`
    margin: auto 10px;
    height: 8px;
    width: 15px;
`;

const HiddenMenu = styled.div`
    position: absolute;
    width: 250px;
    height: fit-content;
    border-radius: 7px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
    top: 60px;
    left: 0;
    padding: 10px 0 10px 20px;
    transform-origin: top left;
    transform: scale(0.7, 0);
    transition: all 500ms ease-in-out;
    opacity: 0;
    background-color: white;

    &.show {
        opacity: 1;
        transform: none;
    }
`;
const MenuItem = styled.div`
    font-size: 16px;
    font-weight: normal;
    color: gray;
    cursor: pointer;
    padding: 5px 0;

    &.selected {
        color: black;
        font-weight: 500;
    }
`;

const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;

    @media (max-width: 1024px) {
        display: none;
    }
`;

const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;

    a {
        color: var(--color-secondary);
        text-decoration: underline;
    }

    @media (max-width: 1024px) {
        width: 100%;
        padding: 0 20px;
    }
`;

const ContentWrapper = styled.div`
    margin: 0 auto;
`;

const NavMainTitle = styled.div`
    font-size: 30px;
    padding: 40px 0 10px;
`;

const NavTitle = styled.div`
    padding: 5px 0 5px 15px;
    color: gray;
    opacity: 0.5;

    &.selected {
        color: black;
        opacity: 1;
    }
`;

export const MainTitle = styled.div`
    font-size: 30px;
    font-weight: 500;
    padding: 40px 0 20px;
`;

export const Title = styled.div`
    font-size: 20px;
    padding: 15px 0;
`;

export const Subtitle = styled.div`
    font-weight: bold;
    padding-bottom: 15px;
`;

export const Paragraph = styled.div`
    padding: 5px 0;
    max-width: 800px;
`;

export const GeneralContainer = styled.div`
    max-height: calc(100vh - 100px);
`;

export const BodyText = styled.div`
    padding: 16px;
    width: 100%;
    border: 1px solid #0c3586;
    overflow-y: scroll;
    height: fit-content;
    max-height: calc(100vh - 170px);

    p:last-of-type {
        padding-bottom: 0;
    }

    a {
        color: var(--color-secondary);
    }
`;

export const List = styled.ul`
    max-width: 800px;
    list-style: unset;
    padding-inline-start: 16px;
    margin-bottom: 16px;
`;
export const ListItem = styled.li``;
