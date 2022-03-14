import styled from 'styled-components';
import { SearchInput as UnstyledSearchInput } from '@components/General/SearchInput';

export const TableSection = styled.div`
    border-radius: 0.75rem;
    margin-top: 2.5rem;
    padding: 1.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    background: ${({ theme }) => theme.background};
`;

export const SearchInput = styled(UnstyledSearchInput)`
    input {
        padding: calc(0.5rem - 1px) 1rem calc(0.5rem - 1px) 2.5rem;
    }
`;
