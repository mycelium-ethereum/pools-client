import styled from 'styled-components';
import { SearchInput as UnstyledSearchInput } from '~/components/General/SearchInput';
import { TableRowCell } from '~/components/General/TWTable';
import ArrowRight_ from '~/public/img/general/arrow-right.svg';

export const Container = styled.div`
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    background: ${({ theme }) => theme.background};
`;

export const Wrapper = styled.div`
    white-space: nowrap;
    padding: 1rem;

    @media (min-width: 640px) {
        display: flex;
        justify-content: space-between;
    }
`;

export const Title = styled.div`
    line-height: 150%;
    font-weight: 600;
    font-size: 20px;
    margin-top: 0.5rem;
    margin-bottom: 6px;
    opacity: 1;
`;

export const SubTitle = styled.div`
    line-height: 150%;
    font-weight: 400;
    font-size: 12px;
    color: #71717a;
`;

export const Text = styled.div`
    margin: auto 0.5rem auto 0;
`;

export const Content = styled.div`
    display: flex;
    margin: auto 0;
`;

export const Actions = styled.div`
    display: flex;
    &:first-child {
        margin-right: 0.5rem;

        @media (min-width: 640px) {
            margin-right: 1.25rem;
        }
    }
`;

export const SearchInput = styled(UnstyledSearchInput)`
    input {
        padding: calc(0.5rem - 1px) 1rem calc(0.5rem - 1px) 2.5rem;
    }
`;

export const ArrowRight = styled(ArrowRight_)`
    margin-left: auto;
`;

export const OverviewTableRowCell = styled(TableRowCell)`
    font-size: 16px;
`;
