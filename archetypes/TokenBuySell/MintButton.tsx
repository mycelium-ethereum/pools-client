import React from 'react';
import styled from 'styled-components';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import Button from '~/components/General/Button';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';

const MintButton: React.FC<ExchangeButtonProps> = ({
    swapState,
    swapDispatch,
    account,
    handleConnect,
    userBalances,
    approve,
    pool,
    amountBN,
    commit,
    commitType,
}) => {
    const { selectedPool, invalidAmount, commitAction, balanceType } = swapState;

    if (!account) {
        return (
            <Button
                size="lg"
                variant="primary"
                onClick={(_e) => {
                    handleConnect();
                }}
            >
                Connect Wallet
            </Button>
        );
    } else if (
        (!userBalances.settlementToken.approvedAmount?.gte(userBalances.settlementToken.balance) ||
            userBalances.settlementToken.approvedAmount.eq(0)) &&
        commitAction !== CommitActionEnum.burn
    ) {
        return (
            <Button
                size="lg"
                variant="primary"
                disabled={!selectedPool}
                onClick={(_e) => {
                    if (!approve) {
                        return;
                    }
                    approve(selectedPool ?? '', pool.settlementToken.symbol);
                }}
            >
                Unlock {pool.settlementToken.symbol}
            </Button>
        );
    } else {
        return (
            <ButtonStyled
                size="lg"
                variant="primary"
                disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                onClick={(_e) => {
                    if (!commit) {
                        return;
                    }

                    commit(selectedPool ?? '', commitType, balanceType, amountBN, {
                        onSuccess: () => {
                            swapDispatch?.({ type: 'setAmount', value: '' });
                        },
                    });
                }}
            >
                Mint Tokens
            </ButtonStyled>
        );
    }
};

export default MintButton;

const ButtonStyled = styled(Button)`
    text-transform: capitalize;
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
`;
