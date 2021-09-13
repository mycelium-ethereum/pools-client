import React, { useEffect, useReducer } from 'react';
import FarmsTable from './FarmsTable';
import styled from 'styled-components';
import FilterBar from './FilterSelects/Bar';
//import FilterModal from './FilterSelects/Modal';
// import { Container } from '@components/General';
import StakeNav from '@components/Nav/FarmNav';
import { browseReducer, BrowseState, LeverageFilterEnum, SideFilterEnum, SortByEnum, MarketFilterEnum } from './state';
// import { FilterFilled, SearchOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
// import useBrowsePools from '@libs/hooks/useBrowsePools';
// import { BURN, LONG, MINT } from '@libs/constants';
// import { useRouter } from 'next/router';
import { Container } from '@components/General';
// import { SideType } from '@libs/types/General';

export const Stake: React.FC = () => {
    const { account } = useWeb3();

    //const router = useRouter();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        market: MarketFilterEnum.All,
        leverage: LeverageFilterEnum.All,
        side: SideFilterEnum.All,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filterModalOpen: false,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    //const tokens = useBrowsePools();

    return (
        <div>
            <StakeNav />
            <FarmContainer>
                <FarmModal>
                    <section className="hidden md:block">
                        <Title>Pool Token Farms</Title>
                        <p className="mb-1 text-gray-500">Stake Pool Tokens and earn TCR.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <FarmsTable
                        rows={[
                            {
                                farm: 'farm',
                                APY: 100,
                                TVL: 1.27,
                                myStaked: 0,
                                myRewards: 0,
                            },
                        ]}
                    />
                </FarmModal>
            </FarmContainer>
        </div>
    );
};

const FarmContainer = styled(Container)`
    @media (max-width: 768px) {
        margin-top: 0;
    }
    margin-top: 100px;
`;

const Title = styled.h1`
    @media (max-width: 768px) {
        display: none;
    }
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    color: #111928;
    padding-bottom: 0.8rem;
`;

const FarmModal = styled.div`
    @media (max-width: 768px) {
        padding: 0;
    }
    background: var(--color-background);
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 48px 32px;
`;
