import { set } from 'mongoose';
import { use } from 'react';
import { useState, useEffect } from 'react';

const useCountdown = (targetDate) => {
    const [countDown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setCountdown({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    expired: true
                });
                clearInterval(interval);
                return;
            }

            setCountdown({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                expired: false
            });
        }, 1000);

        return () => clearInterval(interval);
    }  , [targetDate]);
    
    return countDown;
};

export default useCountdown;