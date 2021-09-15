import React from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';

export const LegalPageLayout: React.FC = ({ children }) => {
    const route = useRouter().pathname;
    return (
        <>
            <NavBar />
            <LayoutWrapper className="container flex">
                <LeftPanel>
                    <ContentWrapper>
                        <NavMainTitle>Legal</NavMainTitle>
                        <NavTitle className={`${route === '/privacy-policy' ? 'selected' : ''}`}>
                            <a href="/privacy-policy">Privacy Policy</a>
                        </NavTitle>
                        <NavTitle className={`${route === '/terms-of-use' ? 'selected' : ''}`}>
                            <a href="/terms-of-use">Terms of Use</a>
                        </NavTitle>
                        <NavTitle className={`${route === '/disclaimer' ? 'selected' : ''}`}>
                            <a href="/disclaimer">Disclaimer</a>
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

const LeftPanel = styled.div`
    width: 20%;
    display: flex;
    flex-direction: column;
    border: 1px solid #0c3586;

    @media (max-width: 1024px) {
        display: none;
    }
`;

const RightPanel = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    border: 1px solid #0c3586;

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
