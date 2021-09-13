import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CommitType } from '@libs/types/General';
import { PoolCommitter__factory, PoolCommitter } from '@tracer-protocol/perpetual-pools-contracts/types';
import { useWeb3 } from '@context/Web3Context/Web3Context';

// const useEstimatedGasFee
export default ((committerAddress: string, amount: number, commitType: CommitType) => {
    const { signer } = useWeb3();
    const [gasFee, setGasFee] = useState(0);

    useEffect(() => {
        if (!committerAddress) {
            console.error('Committer address undefined when trying to estimate gas price');
        } else if (!signer) {
            console.error('Provider undefined when trying to estimate gas price');
        } else if (!amount) {
        } else {
            const committer = new ethers.Contract(
                committerAddress,
                PoolCommitter__factory.abi,
                signer,
            ) as PoolCommitter;
            committer.estimateGas
                .commit(commitType, ethers.utils.parseEther(amount ? amount.toString() : '0'))
                .then((gwei) => {
                    const gasFee = parseFloat(ethers.utils.formatUnits(gwei, 'gwei'));
                    console.log('Fetched gas fee', gasFee);
                    setGasFee(gasFee);
                });
        }
    }, [committerAddress, commitType, amount, signer]);

    return gasFee;
}) as (committerAddress: string | undefined, amount: number, commitType: CommitType) => number;
