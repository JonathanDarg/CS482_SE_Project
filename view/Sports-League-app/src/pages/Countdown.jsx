import React from "react";
import useCountdown from "../hooks/UseCountdown";

function Countdown({ targetDate }) {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-6">Countdown to the Big Game!</h2>
            <CountDownTimer targetDate={new Date(targetDate).getTime()} />
        </div>
    );
}

export default Countdown;