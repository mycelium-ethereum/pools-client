import Icon from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import React from 'react';

// @ts-ignore
import GasIcon from '@public/img/general/gas_icon.svg';

export default (() => {
    const { gasPrice } = useWeb3();
    return (
        <div className="flex items-center p-2 ml-auto">
            <Icon component={GasIcon} className="icon" />
            <span className="ml-2">{gasPrice}</span>
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
        </div>
    );
}) as React.FC;
