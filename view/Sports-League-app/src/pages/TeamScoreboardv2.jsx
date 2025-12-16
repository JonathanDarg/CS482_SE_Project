import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

function TeamScoreboardv2() {
  // Hard-coded teams
  const initialTeams = [
    { id: 1, team: "Lions", wins: 8, losses: 2, points: 24 },
    { id: 2, team: "Tigers", wins: 6, losses: 4, points: 18 },
    { id: 3, team: "Sharks", wins: 7, losses: 3, points: 21 },
    { id: 4, team: "Eagles", wins: 5, losses: 5, points: 15 },
    { id: 5, team: "Wolves", wins: 9, losses: 1, points: 27 },
  ];

  const [teams, setTeams] = useState([]);
  const [selection, setSelection] = useState("Lions");

  useEffect(() => {
    // Sort by wins descending and assign rank
    const ordered = initialTeams
      .sort((a, b) => b.wins - a.wins)
      .map((t, i) => ({ ...t, rank: i + 1 }));
    setTeams(ordered);
  }, []);

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="bg-white text-black shadow-xl rounded-lg overflow-hidden p-6 w-[850px] border-2 border-orange-500">
        <select
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          className="mb-6 w-full p-2 text-center border rounded-md"
        >
          {teams.map((team) => (
            <option key={team.id} value={team.team}>
              {team.team}
            </option>
          ))}
        </select>

        {teams.map(
          (team) =>
            team.team === selection && (
              <div key={team.id}>
                <h2 className="text-2xl font-bold uppercase tracking-wide text-center mb-4">
                  {team.team}
                </h2>

                <table className="w-full text-center border-collapse mb-6">
                  <thead>
                    <tr className="border-b border-gray-400 text-gray-700 text-xl">
                      <th className="text-center pl-4">WINS</th>
                      <th>LOSSES</th>
                      <th>POINTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-xl">
                      <td className="text-center pl-4 font-semibold text-orange-500 text-7xl">
                        {team.wins}
                      </td>
                      <td className="text-center font-semibold text-orange-500 text-7xl">
                        {team.losses}
                      </td>
                      <td className="text-center font-semibold text-orange-500 text-7xl">
                        {team.points}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="w-full text-center border-collapse">
                  <h2 className="border-b border-gray-400 text-gray-700 text-2xl font-bold">
                    Total Games
                  </h2>
                  <h2 className="text-center pl-4 font-semibold text-orange-500 text-9xl">
                    {team.wins + team.losses}
                  </h2>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default TeamScoreboardv2;
