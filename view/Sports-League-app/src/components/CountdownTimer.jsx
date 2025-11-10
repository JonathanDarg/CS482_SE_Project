import React from "react";
import useCountdown from "../hooks/UseCountdown";

const CountDownTimer = ({ targetDate }) => {
    const { days, hours, minutes, seconds, expired } = useCountdown(targetDate);

    if (expired) {
        return (
            <div className="text-center text-2xl font-bold text-red-600">
                The game is over!
            </div>
        );
    }

    return (
        <div className="text-center text-2xl font-bold">
            <div className="flex justify-center space-x-4">
                <div>
                    <span className="text-4xl">{days}</span>
                    <div>Days</div>
                </div>
                <div>
                    <span className="text-4xl">{hours}</span>
                    <div>Hours</div>
                </div>
                <div>
                    <span className="text-4xl">{minutes}</span>
                    <div>Minutes</div>
                </div>
                <div>
                    <span className="text-4xl">{seconds}</span>
                    <div>Seconds</div>
                </div>
            </div>
        </div>
    );
};

export default CountDownTimer;