import React, { useMemo } from 'react';
import { Select, SelectDropdown } from '@components/General/Input';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions } from '@context/UsersCommitContext';
import { BUYS, SELLS } from '@libs/constants';
import { CommitsFocus } from '@libs/types/General';
import useCommitsBreakdown from '@libs/hooks/useCommitsBreakdown';
import styled from 'styled-components';

// const CommitDropdown
export default (({ setShowQueued, show }) => {
    const { commitDispatch } = useCommitActions();
    const { buys, sells, nextUpdate } = useCommitsBreakdown();

    useMemo(() => {
        if (buys + sells > 0) {
            setShowQueued(true);
        } else {
            setShowQueued(false);
        }
    }, [buys, sells]);

    const handleClick = (focus: CommitsFocus) => {
        if (commitDispatch) {
            commitDispatch({ type: 'show', focus: focus });
        } else {
            console.error('Commitdispatch undefined');
        }
    };

    return (
        <QueuedDropdown preview={`${buys + sells} Queued`} show={show}>
            <Header>
                UP NEXT <TimeLeft targetTime={nextUpdate} />
            </Header>
            <Link onClick={() => handleClick(BUYS)}>
                <a>{buys} Buys</a>
            </Link>
            <Link onClick={() => handleClick(SELLS)}>
                <a>{sells} Sells</a>
            </Link>
        </QueuedDropdown>
    );
}) as React.FC<{
    setShowQueued: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
}>;

export const QueuedDropdown = styled(Select)<{
    show: boolean;
}>`
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 7px;
    background: #3da8f5;
    margin: auto 1rem;
    width: 158px;
    height: 2.625rem;
    line-height: 2.625rem;
    color: #fff;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 6px;

    display: ${(props) => (props.show ? 'block' : 'none')};

    // for size of menu
    ${SelectDropdown} {
        left: -50px;
        background: #fff;
    }

    & svg {
        fill: #fff;
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
