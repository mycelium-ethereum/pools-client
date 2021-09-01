import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Heading, QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';

export default (() => {
	const ref = useRef(null)
	const { commitDispatch = () => console.error("Dispatch undefined")} = useCommitActions();
	const { showCommits = false } = useCommits();
	const commits = usePendingCommits();

	useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        const handleClickOutside = (event: any) => {
            if (ref.current && !(ref.current as any).contains(event.target)) {
				commitDispatch({ 
					type: 'setShow', value: false 
				})
            }
        }

        // Bind the event listener
        document?.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document?.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

	return (
		<PendingCommits show={showCommits}>
			<Overlay show={showCommits} />
			<PendingCommitsModal ref={ref} show={showCommits}>
				<Title>Queued Commits</Title>
				<Table>
					<TableHeader>
						{headings.map((heading, index) => (
							<TableHeading key={`pending-commit-heading-row-${index}`} width={heading.width}>
								{heading.text}
							</TableHeading>
						))}
					</TableHeader>
					<TableBody>
						{
							commits.map((commit) => <CommitRow {...commit} />)
						}
					</TableBody>
				</Table>
			</PendingCommitsModal>
		</PendingCommits>
	)
}) as React.FC<{
	show: boolean,
	// setShow: (val: boolean) => any
}>

const Title = styled.h1`
	font-style: normal;
	font-weight: bold;
	font-size: 30px;
	color: #111928;
`


const PendingCommits = styled.div<{ show: boolean }>`
`

const Overlay = styled.div<{ show: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transition: 0.3s;
	opacity: ${(props) => props.show ? 0.5 : 0};
	background: black;
	z-index: 1;
`

const PendingCommitsModal = styled.div<{ show: boolean }>`
	transition: 0.3s;
	padding-top: ${(props) => props.show ? '0' : '5vh'};
	opacity: ${(props) => props.show ? 1 : 0};
	position: absolute;
	width: 1010px;
	height: 700px;
	background: #fff;
	padding: 71px 65px;
	z-index: 2;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
	border-radius: 20px;
`

const CommitRow: React.FC<QueuedCommit>= ({ token, spent, tokenPrice, amount, nextRebalance }) => {
	return (
		<TableRow>
			<TableCell>
				{token.name}
			</TableCell>
			<TableCell>
				{toApproxCurrency(spent)}
			</TableCell>
			<TableCell>
				{toApproxCurrency(tokenPrice)}
			</TableCell>
			<TableCell>
				{amount.toNumber()}
			</TableCell>
			<TableCell>
				<TimeLeft targetTime={nextRebalance.toNumber()} />
			</TableCell>
		</TableRow>
	)

}

// last heading is for buttons
const headings: Heading[] = [
    {
        text: 'TOKEN',
        width: 'auto',
    },
    {
        text: 'SPEND (USDC)',
        width: 'auto',
    },
    {
        text: 'TOKEN PRICE (USDC)',
        width: 'auto',
    },
    {
        text: 'AMOUNT (TOKENS)',
        width: 'auto',
    },
    {
        text: 'NEXT_REBALANCE',
        width: 'auto',
    },
    {
        text: '',
        width: '30%',
    },
];
