import React, { useMemo } from 'react';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions } from '@context/UsersCommitContext';
import { CommitsFocusEnum } from '@libs/constants';
import useCommitsBreakdown from '@libs/hooks/useCommitsBreakdown';
import { classNames } from '@libs/utils/functions';
import TWPopup from '@components/General/TWPopup';
import TooltipSelector from '@components/Tooltips/TooltipSelector';

const linkStyles = 'my-2 mx-4 text-sm text-blue-500 cursor-pointer underline hover:opacity-80 ';

// const CommitDropdown
export default (({ setShowQueued, hide }) => {
    const { commitDispatch } = useCommitActions();
    const { mints, burns, nextUpdate } = useCommitsBreakdown();

    useMemo(() => {
        if (mints + burns > 0) {
            setShowQueued(true);
        } else {
            setShowQueued(false);
        }
    }, [mints, burns]);

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
            preview={`${mints + burns} Queued`}
        >
            <div className="flex text-sm font-normal items-center py-2 px-4 text-theme-text opacity-90 border-b border-theme-border">
                <TooltipSelector tooltip={{ content: <>Time until mints/burns are processed</> }}>
                    <div className="uppercase mr-2 whitespace-nowrap">Up Next</div>
                </TooltipSelector>
                <TimeLeft
                    className="py-1 px-3 m-auto box-border whitespace-nowrap border rounded bg-theme-button-bg text-theme-text opacity-90 border-theme-border"
                    targetTime={nextUpdate}
                />
            </div>
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.mints)}>
                <a>{mints} Mints</a>
            </div>
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.burns)}>
                <a>{burns} Burns</a>
            </div>
        </TWPopup>
    );
}) as React.FC<{
    setShowQueued: React.Dispatch<React.SetStateAction<boolean>>;
    hide?: boolean;
}>;
