import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
//import ScoreBoardT from "../components/ScoreBoardT";

function TeamScoreboard() {
  const [teams, setTeams] = useState([]);
  const [selection, setSelection] = useState("Lions");

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
        points: t.points
      }));

      const ordered = unordered.sort((a, b) => b.wins - a.wins);
      setTeams(ordered.map((t, i) => ({ ...t, rank: i + 1 })));
      
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
    //const updateTeam = (teamID) => {}
    const getSelection = () => {
        selected = teams.filter(t => {return t.id === selection});

        return selected.team;
    };
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="bg-white text-black shadow-xl rounded-lg overflow-hidden p-6 w-[850px] border-2 border-orange-500">
        <select
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
        >
            {teams.map((team, i) => (
            
                <option className= "text-center" value={team.team}>{team.team}</option>
        
          ))}</select>
          
        
        {teams.map((team, i) => ( team.team === selection &&
        <div className="">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-center">{team.team}</h2>
        </div>))}

        {teams.map((team, i) => ( team.team === selection &&
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-gray-400 text-gray-700 text-xl">
              <th className="text-center pl-4">WINS</th>

              <th>LOSSES</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xl">
              <td className="text-center pl-4 font-semibold text-orange-500 text-7xl">{team.wins}</td>
              <td className="text-center pl-4 font-semibold text-orange-500 text-7xl">{team.losses}</td>
              <td className="text-center pl-4 font-semibold text-orange-500 text-7xl">{team.points}</td>
            </tr>
          </tbody>

        </table>))}
        <div className="h-20 bg-transparent"></div>
        {teams.map((team, i) => ( team.team === selection && 
        <div className="w-full text-center border-collapse">
            <h2 className="border-b border-gray-400 text-gray-700 text-2xl font-bold">Total Games</h2>
            <h2 className="text-center pl-4 font-semibold text-orange-500 text-9xl">{team.wins+team.losses}</h2>
        </div>))}
      </div>
    </div>
  );
}

export default TeamScoreboard;
