import React, { useReducer } from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import MintBurnModal from '~/archetypes/Pools/MintBurnModal';
import { browseReducer, BrowseState } from '~/archetypes/Pools/state';
import { noDispatch, useSwapContext } from '~/context/SwapContext';
import usePendingCommits from '~/hooks/useQueuedCommits';
import Overview from './Overview';
import { Container } from './Overview/styles';

export type PageOptions = {
    key: CommitActionEnum;
    text: React.ReactNode;
}[];

export default (() => {
    const { swapDispatch = noDispatch } = useSwapContext();
    const [state, dispatch] = useReducer(browseReducer, {
        mintBurnModalOpen: false,
    } as BrowseState);

    const commits = usePendingCommits();

    const handleCommitAction = (pool: string, side: SideEnum, action?: CommitActionEnum) => {
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: action });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
    };

    const handleModalClose = () => {
        dispatch({
            type: 'setMintBurnModalOpen',
            open: false,
        });
    };

    return (
        <Container>
            <Overview onClickCommitAction={handleCommitAction} commits={commits} />
            {state.mintBurnModalOpen && <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />}
        </Container>
    );
});
