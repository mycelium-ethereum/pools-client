import React, { useMemo } from 'react';
import { Select, SelectDropdown } from '@components/General/Input';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions } from '@context/UsersCommitContext';
import { CommitsFocusEnum } from '@libs/constants';
import useCommitsBreakdown from '@libs/hooks/useCommitsBreakdown';
import styled from 'styled-components';
import { classNames } from '@libs/utils/functions';
import { Tooltip } from '@components/General/Tooltip';

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
        <QueuedDropdown
            className={classNames('my-auto mx-2 w-[120px] text-left', hide ? 'hidden' : 'block')}
            preview={`${buys + sells} Queued`}
        >
            <Header>
                <Tooltip placement="left" text="Time until buys/sells are processed">
                    UP NEXT
                </Tooltip>
                <TimeLeft targetTime={nextUpdate} />
            </Header>
            <Link onClick={() => handleClick(CommitsFocusEnum.buys)}>
                <a>{buys} Buys</a>
            </Link>
            <Link onClick={() => handleClick(CommitsFocusEnum.sells)}>
                <a>{sells} Sells</a>
            </Link>
        </QueuedDropdown>
    );
}) as React.FC<{
    setShowQueued: React.Dispatch<React.SetStateAction<boolean>>;
    hide?: boolean;
}>;

export const QueuedDropdown = styled(Select)`
    // for size of menu
    ${SelectDropdown} {
        left: -50px;
        background: #fff;
    }
`;

const Link = styled.div`
    margin: 0.8rem 1rem;
    color: #3da8f5;
    cursor: pointer;
    line-height: normal;
    &:hover {
        text-decoration: underline;
    }
`;

const Header = styled.div`
    border-bottom: 1px solid #f3f4f6;
    padding: 0.5rem 1rem;
    color: #3f3f46;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    align-items: center;
    line-height: normal;
    height: 4rem;
    ${TimeLeft} {
        background: #fafafa;
        color: #6b7280;
        border: 1px solid #e4e4e7;
        box-sizing: border-box;
        border-radius: 6px;
        padding: 2px 8px;
        margin: auto;
    }
`;
