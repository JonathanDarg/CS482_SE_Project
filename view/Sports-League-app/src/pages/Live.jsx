import React from "react";
import ScoreBoard1 from "../components/ScoreBoard1";
import LiveScoreboard from "../components/Scoreboard"; 

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 space-y-16">
      {/* Top single-game scoreboard */}
      <div className="w-full flex justify-center">
        <ScoreBoard1 />
      </div>

      {/* Live multi-game scoreboard */}
      <div className="w-full">
        <LiveScoreboard />
      </div>
    </div>
  );
}
