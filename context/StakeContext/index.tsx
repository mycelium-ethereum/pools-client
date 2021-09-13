import React, { useContext } from 'react';
import { Children } from '@libs/types/General';
//import { Children, Pool } from '@libs/types/General';
//import React, { useContext, useState } from 'react';
// interface ContextProps {
//     pools: Record<string, Pool>;
// }

// interface ActionContextProps {
//     commit: (pool: string, commitType: CommitType, amount: number) => void;
//     approve: (pool: string) => void;
//     uncommit: (pool: string, commitID: number) => void;
// }

// interface SelectedPoolContextProps {
//     pool: Pool;
// }

/**
 * Wrapper store for the swap page state
 */

// using hello world as dummy data
export const StakeContext = React.createContext<any>({});
export const StakeActionsContext = React.createContext<any>({});

export const StakePoolStore: React.FC<Children> = ({ children }: Children) => {
    return (
        <StakeContext.Provider
            value={{
                data: 'hello world',
            }}
        >
            <StakeActionsContext.Provider
                value={{
                    data: 'hello world',
                }}
            >
                {children}
            </StakeActionsContext.Provider>
        </StakeContext.Provider>
    );
};

export const useStakeContext: () => any = () => {
    const context = useContext(StakeContext);
    if (context === undefined) {
        throw new Error(`usePools must be called within PoolsContext`);
    }
    return context;
};

export const usePoolActions: () => any = () => {
    const context = useContext(StakeActionsContext);
    if (context === undefined) {
        throw new Error(`usePoolActions must be called within PoolsActionsContext`);
    }
    return context;
};
