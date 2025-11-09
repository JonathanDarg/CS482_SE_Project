import React, { useState } from "react";

function Score() {
  const [homeTeam, setHomeTeam] = useState({
    name: "Lions",
    record: "4-3",
    score: 5,
    logo:  "/images/lion.jpg",
  });

  const [awayTeam, setAwayTeam] = useState({
    name: "Tigers",
    record: "3-4",
    score: 4,
    logo: "/images/tiger.jpg",
  });

  const [editing, setEditing] = useState({ team: null });

  const handleScoreChange = (team, value) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      team === "home"
        ? setHomeTeam({ ...homeTeam, score: parsed })
        : setAwayTeam({ ...awayTeam, score: parsed });
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[850px] overflow-hidden">
        {/* Orange Top Bar */}
        <div className="bg-orange-500 h-2 w-full rounded-t-xl"></div>

        {/* Main Content */}
        <div className="flex flex-col items-center px-6 py-6">
          {/* Series Info */}
          <div className="text-gray-600 text-sm mb-4 text-center">
            Championship: Game 1, Tigers vs Lions
          </div>

          {/* Scoreboard */}
          <div className="flex items-center justify-between w-full">
            {/* Away Team */}
            <div className="flex items-center space-x-4 w-1/3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold">{awayTeam.name}</span>
                <span className="text-sm text-gray-500">{awayTeam.record}</span>
              </div>
            </div>

            {/* Score Section */}
            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center space-x-4">
                {/* Away Score */}
                {editing.team === "away" ? (
                  <input
                    type="number"
                    value={awayTeam.score}
                    onChange={(e) => handleScoreChange("away", e.target.value)}
                    onBlur={() => setEditing({ team: null })}
                    autoFocus
                    className="w-14 text-center border border-gray-300 rounded text-black"
                  />
                ) : (
                  <span
                    className="text-5xl font-bold cursor-pointer hover:text-orange-500"
                    onClick={() => setEditing({ team: "away" })}
                  >
                    {awayTeam.score}
                  </span>
                )}

                <span className="text-gray-600 font-semibold text-lg">
                  FINAL 11
                </span>
                <span className="text-gray-400 text-2xl">➤</span>

                {/* Home Score */}
                {editing.team === "home" ? (
                  <input
                    type="number"
                    value={homeTeam.score}
                    onChange={(e) => handleScoreChange("home", e.target.value)}
                    onBlur={() => setEditing({ team: null })}
                    autoFocus
                    className="w-14 text-center border border-gray-300 rounded text-black"
                  />
                ) : (
                  <span
                    className="text-5xl font-bold cursor-pointer hover:text-orange-500"
                    onClick={() => setEditing({ team: "home" })}
                  >
                    {homeTeam.score}
                  </span>
                )}
              </div>
            </div>

            {/* Home Team */}
            <div className="flex items-center justify-end space-x-4 w-1/3">
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold">{homeTeam.name}</span>
                <span className="text-sm text-gray-500">{homeTeam.record}</span>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Score;
