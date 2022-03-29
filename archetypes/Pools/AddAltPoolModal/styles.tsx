import styled from 'styled-components';
import CloseIcon from '/public/img/general/close.svg';
import { SearchInput, InnerSearchInput, SearchIconWrap } from '@components/General/SearchInput';

export const Close = styled(CloseIcon)`
    position: absolute;
    right: 1.75rem;
    top: 2.5rem;
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;

    @media (min-width: 640px) {
        right: 4.1rem;
        top: 5rem;
        width: 1rem;
        height: 1rem;
    }
`;

export const Title = styled.h2`
    font-weight: 500;
    font-size: 20px;
    color: ${({ theme }) => theme.text};
    margin: -5px 0 25px;

    @media (min-width: 640px) {
        margin: 45px 0 37px;
    }
`;

export const Label = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
    margin-bottom: 5px;
`;

export const Message = styled.div`
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme['text-secondary']};
    margin-bottom: 20px;
    text-align: center;
`;

export const Input = styled(SearchInput)`
    margin-bottom: 45px;

    ${SearchIconWrap} {
        display: none;
    }

    ${InnerSearchInput} {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: normal;
        width: calc(100%);
        padding-left: 0.75em;
    }
`;
