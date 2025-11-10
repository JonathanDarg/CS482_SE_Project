import React from "react";
import useCountdown from "../hooks/UseCountdown";
import ScoreBoard from "../components/ScoreBoard";
import ImageGallery from "../components/ImageGallery";
import CountdownTimer from "../components/CountDownTimer";

function Countdown({ targetDate }){
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-6">Countdown to the Big Game!</h2>
            <CountdownTimer targetDate={targetDate} />
            <ScoreBoard />
        </div>
    );
}

export default Countdown;