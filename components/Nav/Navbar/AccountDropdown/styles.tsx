import { CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Logo } from '~/components/General';
import { device } from '~/store/ThemeSlice/themes';

export const ArbitrumLogo = styled(Logo)`
    display: inline;
    font-size: 1.125rem; /* 18px */
    line-height: 1.75rem; /* 28px */
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0.5rem;
`;

export const ViewOnArbiscanOption = styled.a`
    display: flex;
    padding: 0.5rem 1rem;
    &:hover {
        background: ${({ theme }) => theme.button.hover};
    }

    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
`;

export const Logout = styled.div`
    padding: 0.25rem 0;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
`;

export const LogoutButton = styled.button`
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    font-weight: 500;
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
    background-color: #2563eb;
    color: #fff;
    border-radius: 0.75rem; /* 12px */

    &:hover {
        background-color: #60a5fa;
    }
`;

export const CopyAccount = styled.div`
    display: flex;
    padding: 0.75rem 1rem 0.5rem 1rem;
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
`;

export const CopyIcon = styled(CopyOutlined)`
    align-self: center;
    svg {
        vertical-align: 0;
    }
`;

export const Account = styled.div`
    padding: 0 0.5rem;
    align-self: center;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media ${device.md} {
        max-width: 100px;
    }
`;
