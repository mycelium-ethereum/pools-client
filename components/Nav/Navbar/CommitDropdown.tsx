import React from 'react';
import { useCommitActions } from '@context/UsersCommitContext';
import { CommitsFocusEnum } from '@libs/constants';
import { classNames } from '@libs/utils/functions';
import TWPopup from '@components/General/TWPopup';
import useQueuedCommits from '@libs/hooks/useQueuedCommits';

const linkStyles = 'my-2 mx-4 text-sm text-blue-500 cursor-pointer underline hover:opacity-80 ';

// const CommitDropdown
export default (({ hide }) => {
    const { commitDispatch } = useCommitActions();
    const { pendingCommits, claimablePools } = useQueuedCommits();

    const handleClick = (focus: CommitsFocusEnum) => {
        if (commitDispatch) {
            commitDispatch({ type: 'show', focus: focus });
        } else {
            console.error('Commitdispatch undefined');
        }
    };

    return (
        <TWPopup
            className={classNames('my-auto mx-2 w-[120px] text-left relative', hide ? 'hidden' : 'block')}
            preview={`${pendingCommits.mints.length + pendingCommits.burns.length + claimablePools.length} Queued`}
        >
            {/* <div className="flex text-sm font-normal items-center py-2 px-4 text-theme-text opacity-90 border-b border-theme-border">
                <TooltipSelector tooltip={{ content: <>Time until pendingCommits become claimable</> }}>
                    <div className="uppercase mr-2 whitespace-nowrap">Up Next</div>
                </TooltipSelector>
                <TimeLeft
                    className="py-1 px-3 m-auto box-border whitespace-nowrap border rounded bg-theme-button-bg text-theme-text opacity-90 border-theme-border"
                    targetTime={nextUpdate}
                />
            </div> */}
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.pending)}>
                <a>{pendingCommits.mints.length + pendingCommits.burns.length} Pending</a>
            </div>
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.claimable)}>
                <a>{claimablePools.length} Claimable</a>
            </div>
        </TWPopup>
    );
}) as React.FC<{
    hide?: boolean;
}>;
