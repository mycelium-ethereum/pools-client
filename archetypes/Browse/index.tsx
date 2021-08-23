import { FilterContext, noDispatch, defaultState } from '@context/FilterContext';
import React from 'react';
import { useContext } from 'react';
import styled from 'styled-components';
import FilterSelects from './FilterSelects';
import PoolsTable from './PoolsTable';

export const Browse: React.FC = () => {
    const { filterState, filterDispatch } = useContext(FilterContext);
    return (
        <Container>
            <Title>Perpetual Pool Tokens</Title>
            <FilterSelects filterState={filterState ?? defaultState} filterDispatch={filterDispatch ?? noDispatch} />
            <PoolsTable
                pools={filterState?.filteredPools ?? []}
            />
        </Container>
    );
};

const Title = styled.h1``;

const Container = styled.div`
    width: 100%;
`;
