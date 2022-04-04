import React from 'react';
import styled from 'styled-components';
import { NotificationIcon } from './Icon';
import { Theme } from '~/store/ThemeSlice/themes';

type InjectedProps = {
    closeToast?: any; // injected
    toastProps?: any; // injected
};
type NotificationProps = {
    title: React.ReactNode;
    children?: React.ReactNode;
};

const Title = styled.span`
    font-weight: 700;
    color: ${({ theme }) => theme.text};
    margin-left: 15px;
`;

const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: hidden;
`;

const Content = styled.div`
    flex-grow: 1;
    line-height: 1.4;
    width: 100%;
    word-break: break-word;
    font-size: 1rem;
    margin-top: 0.5rem;
    margin-left: calc(15px + 24px); // Title margin + width of icon

    color: ${({ theme: { theme } }) => {
        switch (theme) {
            case Theme.Light:
                return '#3F3F46';
            default:
                return '#D1D5DB';
        }
    }};
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

export const Notification = ({ title, toastProps, children }: NotificationProps & InjectedProps): JSX.Element => (
    <Container>
        <Flex>
            <NotificationIcon type={toastProps?.type} />
            <Title>{title}</Title>
        </Flex>
        {children && <Content>{children}</Content>}
    </Container>
);

export default Notification;
