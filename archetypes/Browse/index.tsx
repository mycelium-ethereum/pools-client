import React, { useContext } from 'react';
import { FilterContext, noDispatch, defaultState } from '@context/FilterContext';
import styled from 'styled-components';
import FilterSelects from './FilterSelects';
import PoolsTable from './PoolsTable';
import { Button, Container } from '@components/General';

export const Browse: React.FC = () => {
    const { filterState, filterDispatch } = useContext(FilterContext);
    return (
        <BrowseContainer>
            <BrowseButtons>
                <PageButton>Exchange</PageButton>
                <PageButton className="primary">Browse</PageButton>
            </BrowseButtons>
            <BrowseModal>
                <Title>Pool Tokens</Title>
                <FilterSelects
                    filterState={filterState ?? defaultState}
                    filterDispatch={filterDispatch ?? noDispatch}
                />
                <PoolsTable pools={filterState?.filteredPools ?? []} />
            </BrowseModal>
        </BrowseContainer>
    );
};

const Title = styled.h1`
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    color: #111928;
    padding-bottom: 0.8rem;
`;

const BrowseContainer = styled(Container)`
    margin-top: 100px;
`;

const BrowseButtons = styled.div`
    margin-bottom: 1rem;
`;

const BrowseModal = styled.div`
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;

const PageButton = styled(Button)`
    width: 122px;
    height: 55px;
    display: inline;
    background: #e5e7eb;
    color: #6b7280;
    border: none;

    &:hover {
        color: #fff;
    }

    &.primary {
        color: #fff;
        border: 1px solid var(--color-primary);
        margin-left: 0.5rem;
    }
`;
