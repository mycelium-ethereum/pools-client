import { useEffect, useState } from "react";
import { EscrowRowProps } from "@archetypes/Portfolio/Overview/state";
import {usePools} from "@context/PoolContext";
import {LogoTicker} from "@components/General";

export default (() => {
    const { pools } = usePools();
    const [rows, setRows] = useState<EscrowRowProps[]>([])

    useEffect(() => {
        // TODO fetch actual rows
        if (pools) {
            const _rows: EscrowRowProps[] = []
            Object.values(pools).forEach((pool) => {
                _rows.push({
                    pool: pool.name,
                    marketTicker: pool.name.split('-')[1].split('/')[0] as LogoTicker,
                    claimableAssets: [
                        {
                            symbol: pool.longToken.symbol,
                            balance: Math.random() * 100,
                            price: Math.random() * 100,
                            token: 'Long',
                            unrealisedPNL: 0.6,
                            notionalValue: 1.2
                        },
                        {
                            symbol: pool.shortToken.symbol,
                            balance: Math.random() * 100,
                            price: Math.random() * 100,
                            token: 'Short',
                            unrealisedPNL: 2.1,
                            notionalValue: 1.2
                        },
                        {
                            symbol: pool.quoteToken.symbol,
                            balance: Math.random() * 100,
                            price: Math.random() * 100,
                            token: pool.quoteToken.symbol,
                            unrealisedPNL: 2.1,
                            notionalValue: 1.2
                        },
                    ]
                })

            })
            setRows(_rows);
        }
    }, [pools])

    return rows;

}) as () => EscrowRowProps[];
