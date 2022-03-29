import { useEffect, useState } from 'react';

export default (() => {
    const [nowSeconds, setNowSeconds] = useState(Math.floor(Date.now() / 1000));

    useEffect(() => {
        const secondInterval = setInterval(() => {
            setNowSeconds(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => {
            clearInterval(secondInterval);
        };
    });

    return { nowSeconds };
}) as () => { nowSeconds: number };
