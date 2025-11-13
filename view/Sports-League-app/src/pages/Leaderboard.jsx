import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

export function Leaderboard() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();

      const unordered = data.map((t) => ({
        id: t._id,
        team: t.teamName,
        wins: t.wins,
        losses: t.losses,
      }));

      const ordered = unordered.sort((a, b) => b.wins - a.wins);
      setTeams(ordered.map((t, i) => ({ ...t, rank: i + 1 })));
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  const getRankIcon = (rank, size = 20) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={size} />;
      case 2:
        return <Medal className="text-gray-400" size={size} />;
      case 3:
        return <Award className="text-orange-600" size={size} />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-4 rounded-full">
              <Trophy className="text-white" size={48} />
            </div>
          </div>
          <h2 className="text-5xl mb-4 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-semibold">
            League Standings
          </h2>
          <p className="text-xl text-gray-600">
            See how your favorite teams rank this season
          </p>
        </div>

        {/* Podium for Top 3 */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-end justify-center gap-4 px-4">
            {/* 2nd Place */}
            {teams[1] && (
              <div className="flex-1 max-w-[200px]">
                <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300 shadow-lg transform transition-transform hover:scale-105">
                  <CardContent className="pt-6 pb-8 text-center">
                    <div className="mb-3 flex justify-center">
                      {getRankIcon(2, 40)}
                    </div>
                    <div className="text-3xl mb-2">2nd</div>
                    <div className="text-xl mb-4">{teams[1].team}</div>
                    <div className="flex justify-center gap-3">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
                        {teams[1].wins}W
                      </div>
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
                        {teams[1].losses}L
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 1st Place */}
            {teams[0] && (
              <div className="flex-1 max-w-[220px]">
                <Card className="bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-400 shadow-2xl transform transition-transform hover:scale-105">
                  <CardContent className="pt-8 pb-10 text-center">
                    <div className="mb-4 flex justify-center">
                      {getRankIcon(1, 48)}
                    </div>
                    <div className="text-4xl mb-2">1st</div>
                    <div className="text-2xl mb-4">{teams[0].team}</div>
                    <div className="flex justify-center gap-3">
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">
                        {teams[0].wins}W
                      </div>
                      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
                        {teams[0].losses}L
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 3rd Place */}
            {teams[2] && (
              <div className="flex-1 max-w-[200px]">
                <Card className="bg-gradient-to-br from-orange-200 to-orange-400 border-4 border-orange-300 shadow-lg transform transition-transform hover:scale-105">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="mb-3 flex justify-center">
                      {getRankIcon(3, 36)}
                    </div>
                    <div className="text-3xl mb-2">3rd</div>
                    <div className="text-xl mb-4">{teams[2].team}</div>
                    <div className="flex justify-center gap-3">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-md">
                        {teams[2].wins}W
                      </div>
                      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
                        {teams[2].losses}L
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <Card className="shadow-xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
            <CardTitle className="text-center text-2xl">Minor League Standings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4">Rank</th>
                    <th className="text-left py-4 px-4">Team</th>
                    <th className="text-center py-4 px-4">Wins</th>
                    <th className="text-center py-4 px-4">Losses</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr
                      key={team.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        team.rank === 1 ? 'bg-orange-100/40' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {getRankIcon(team.rank)}
                          {team.rank > 3 && <span className="text-gray-700">{team.rank}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{team.team}</span>
                          {team.rank === 1 && (
                            <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                              1st Place
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-md">
                          {team.wins}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-md">
                          {team.losses}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Card className="bg-orange-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">{teams[0]?.team}</div>
                <div className="text-sm opacity-90">Division Leader</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {teams.reduce((sum, team) => sum + team.wins, 0)}
                </div>
                <div className="text-sm opacity-90">Total Wins</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">{teams.length}</div>
                <div className="text-sm opacity-90">Teams</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;
