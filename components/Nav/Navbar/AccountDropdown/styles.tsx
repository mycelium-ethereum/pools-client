import { Logo } from '@components/General';
import { CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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
    &:hover {
        background: ${({ theme }) => theme['button-bg-hover']};
    }

    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
`;

export const Options = styled.div`
    padding: 0.25rem 1rem;
    margin-bottom: 0.5rem;
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
    width: 180px;
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
`;
