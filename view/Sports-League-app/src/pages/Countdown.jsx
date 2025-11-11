import React from "react";
import useCountdown from "../hooks/UseCountdown";
import ScoreBoard from "../components/ScoreBoard";
import ImageGallery from "../components/ImageGallery";
import CountdownTimer from "../components/CountDownTimer";


function Countdown() {

    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-6">Countdown to the Big Game!</h2>
            <CountdownTimer targetDate={new Date("2025-12-31T23:59:59").getTime()} />
            <ScoreBoard />
        </div>
    );
}

export default Countdown;