import Icon from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import React from 'react';

// @ts-ignore
import GasIcon from '@public/img/general/gas_icon.svg';
import { GasPriceTooltip } from '@components/Tooltips';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

export default (() => {
    const { gasPrice, wallet, network } = useWeb3();
    return (
        <div className="flex items-center p-2 ml-auto">
            <GasPriceTooltip
                network={networkConfig[network ?? 0]?.name ?? 'Unknown'}
                wallet={wallet?.name ?? 'Unknown'}
            >
                <Icon component={GasIcon} className="icon mr-2" />
                <span>{gasPrice?.toFixed(3)}</span>
                <style>{`
                    .icon {
                        height: 22px;
                        width: 20px;
                        vertical-align: 0;
                    }
                    .icon svg {
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
            </GasPriceTooltip>
        </div>
    );
}) as React.FC;
