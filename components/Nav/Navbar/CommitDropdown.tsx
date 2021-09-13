import React, { useMemo } from 'react';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions } from '@context/UsersCommitContext';
import { CommitsFocusEnum } from '@libs/constants';
import useCommitsBreakdown from '@libs/hooks/useCommitsBreakdown';
import { classNames } from '@libs/utils/functions';
import { Tooltip } from '@components/General/Tooltip';
import TWPopup from '@components/General/TWPopup';

const linkStyles = 'my-2 mx-4 text-sm text-blue-500 cursor-pointer underline hover:opacity-80 ';

// const CommitDropdown
export default (({ setShowQueued, hide }) => {
    const { commitDispatch } = useCommitActions();
    const { buys, sells, nextUpdate } = useCommitsBreakdown();

    useMemo(() => {
        if (buys + sells > 0) {
            setShowQueued(true);
        } else {
            setShowQueued(false);
        }
    }, [buys, sells]);

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
            preview={`${buys + sells} Queued`}
        >
            <div className="flex text-sm font-normal items-center py-2 px-4 text-gray-700 border-b border-cool-gray-100">
                <Tooltip placement="left" text="Time until buys/sells are processed ">
                    <div className="uppercase mr-2">Up Next</div>
                </Tooltip>
                <TimeLeft
                    className="py-1 px-3 m-auto box-border whitespace-nowrap border rounded bg-gray-50 text-cool-gray-500 border-gray-200"
                    targetTime={nextUpdate}
                />
            </div>
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.buys)}>
                <a>{buys} Buys</a>
            </div>
            <div className={linkStyles} onClick={() => handleClick(CommitsFocusEnum.sells)}>
                <a>{sells} Sells</a>
            </div>
        </TWPopup>
    );
}) as React.FC<{
    setShowQueued: React.Dispatch<React.SetStateAction<boolean>>;
    hide?: boolean;
}>;
