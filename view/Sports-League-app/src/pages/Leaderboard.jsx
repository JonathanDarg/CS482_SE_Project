import { useState, useEffect } from "react";
import styles from "./Leaderboard.module.css";

function Leaderboard() {
    const EE = "r";
    const dataE = [{id: 1, wins: 1, losses: 2}, {id: 2, wins:3}];
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
          title: `${t.teamName}`,
          wins: t.wins,
          losses: t.losses
        }));
        const ordered = unordered.sort((teamA, teamB) => teamB.wins-teamA.wins);
      setTeams(ordered);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };
    return(
        <div className={styles["leaderboard-page"]}>
      <h1>Team Leaderboard</h1>
      <br></br>
      <table>
        <thead>
          <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Wins</th>
          <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr  key={team.id}> 
              <td>{i+1}</td> 
              <td>{team.title}</td> 
              <td>{team.wins}</td> 
              <td>{team.losses}</td> 
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
}
export default Leaderboard;