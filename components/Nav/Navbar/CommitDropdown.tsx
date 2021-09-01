import { Select, SelectDropdown } from '@components/General/Input';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions } from '@context/UsersCommitContext';
import useCommitsBreakdown from '@libs/hooks/useCommitsBreakdown';
import React from 'react';
import styled from "styled-components";

// const CommitDropdown
export default (() => {
	const { commitDispatch } = useCommitActions();
	const { buys, sells, nextUpdate } = useCommitsBreakdown();

	const handleClick = () => {
		if (commitDispatch) {
			commitDispatch({ type: 'setShow', value: true })
		} else {
			console.error("Commitdispatch undefined")
		}
	}

	return (
		<QueuedDropdown preview={`${buys + sells} Queued`}>
			<Header>
				UP NEXT <TimeLeft targetTime={nextUpdate} />
			</Header>
			<Link onClick={handleClick}>
				<a>{buys} Buys</a>
			</Link>
			<Link onClick={handleClick}>
				<a>{sells} Sells</a>
			</Link>
		</QueuedDropdown>
	)
})

const QueuedDropdown = styled(Select)`
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 7px;
    background: #3DA8F5;
    margin: auto 1rem;
    width: 158px;
    height: 42px;
	line-height: 42px;
	color: #fff;
	box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1);
	border-radius: 6px;

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
	color: #3DA8F5;
	cursor: pointer;
	line-height: normal;
	&:hover {
		text-decoration: underline;
	}
`

const Header = styled.div`
	border-bottom: 1px solid #F3F4F6;
	padding: 0.5rem 1rem;
	color: #3F3F46;
	display: flex;
	font-size: 14px;
	font-weight: 600;
	align-items: center;
	line-height: normal;
	height: 4rem;
	${TimeLeft} {
		background: #FAFAFA;
		color: #6B7280;
		border: 1px solid #E4E4E7;
		box-sizing: border-box;
		border-radius: 6px;
		padding: 2px 8px;
		margin: auto
	}
`



