import { useWeb3 } from '@context/Web3Context/Web3Context';
import React from 'react';
import { GasPriceTooltip } from '@components/Tooltips';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';
import GasIcon from '@public/img/general/gas_icon.svg';

export default (() => {
    const { gasPrice, wallet, network } = useWeb3();
    return (
        <div className="flex flex-col items-center justify-center p-2 ml-auto">
            <GasPriceTooltip
                network={networkConfig[network ?? 0]?.name ?? 'Unknown'}
                wallet={wallet?.name ?? 'Unknown'}
            >
                <div className="flex">
                    <GasIcon className="inline h-[22px] w-[20px] mr-2" />
                    <span>{gasPrice?.toFixed(3)}</span>
                </div>
            </GasPriceTooltip>
        </div>
    );
}) as React.FC;
