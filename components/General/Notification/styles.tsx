import styled from 'styled-components';
import UnstyledTimeLeft from '~/components/TimeLeft';
import { Theme } from '~/store/ThemeSlice/themes';
import { Logo as UnstyledLogo } from '../Logo';

export const TextWrap = styled.div`
    white-space: normal;
`;

export const CommitContent = styled.div`
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
`;

export const CommitPendingContent = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    span {
        display: flex;
    }
`;

export const ViewOrder = styled.div`
    cursor: pointer;
    color: rgba(61, 168, 245); // tracer-400
    text-decoration: underline;
`;

export const Logo = styled(UnstyledLogo)`
    margin-right: 0.5rem;
    margin-bottom: auto;
`;

export const TimeLeft = styled(UnstyledTimeLeft)`
    margin-bottom: auto;
    min-width: fit-content;
    border-radius: 0.5rem;
    border-width: 1px;
    padding: 0.25rem 0.75rem;

    background: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return 'rgb(249, 250, 251)';
            default:
                return 'rgba(31, 42, 55)';
        }
    }};
`;
