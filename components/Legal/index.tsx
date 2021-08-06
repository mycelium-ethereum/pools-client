import styled from 'styled-components';

export const GeneralContainer = styled.div`
    max-height: calc(100vh - 100px);
`;

export const BodyText = styled.div`
    padding: 16px;
    width: 100%;
    border: 1px solid #0c3586;
    border-top: unset;
    overflow-y: scroll;
    height: fit-content;
    max-height: calc(100vh - 170px);

    p:last-of-type {
        padding-bottom: 0px;
    }

    a {
        color: var(--color-secondary);
    }
`;
export const MainTitle = styled.h1`
    display: flex;
    height: 65px;
    width: 100%;
    align-items: center;
    padding: 0px 16px;
    border: 1px solid #0c3586;
    border-top: unset;
    font-size: var(--font-size-medium);
    font-weight: 400;
`;
export const SubHeading = styled.span`
    display: block;
    font-size: var(--font-size-small);
    color: var(--color-secondary);
    max-width: 720px;
    margin-bottom: 8px;
`;
export const Title = styled.h2`
    font-size: var(--font-size-medium);
    font-weight: 400;
    color: var(--color-text);
    max-width: 720px;
    margin-bottom: 8px;
`;
export const Text = styled.p`
    padding: 0px 0px 8px;
    font-size: var(--font-size-small);
    max-width: 720px;
`;
export const List = styled.ul`
    max-width: 720px;
    list-style: unset;
    padding-inline-start: 16px;
    margin-bottom: 16px;
`;
export const ListItem = styled.li``;
