
import { timeTill } from '@libs/utils';
import React, { useEffect, useState } from 'react';


export default (({ targetTime }) => {
	const [ hours, setHours] = useState(0);
	const [ minutes, setMinutes ] = useState(0);
    const [ seconds, setSeconds ] =  useState(0);

	useEffect(() => {
		const timeTill_ = timeTill(targetTime);
		setHours(timeTill_.h ?? 0)
		setMinutes(timeTill_.m ?? 0)
		setSeconds(timeTill_.s ?? 0)
	}, [])

	useEffect(()=>{
    	let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
				if (minutes > 0) {
					setSeconds(59)
					setMinutes(minutes - 1)
				}
				if (minutes === 0) {
					if (hours > 0) {
						setSeconds(59)
						setMinutes(59)
						setHours(hours -1)
					}
					if (hours === 0) {
						// seconds, minutes and hours is all 0
						clearInterval(myInterval)
					}
                } 
            } 
        }, 1000)
        return () => {
            clearInterval(myInterval);
		};
    });

	return (
		<>
			
			<span>
				{`${hours}h ${minutes}m ${seconds}s`}
			</span>
		</>
	)
}) as React.FC<{ targetTime: number }>;