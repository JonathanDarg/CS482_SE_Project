import { useState, useEffect } from "react";
import "./Leaderboard.css";

function Leaderboard() {
    const [teams, setTeams] = useState([]);
    useEffect(() => {
    fetchTeams();
  }, []);
  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data = await res.json();

      setTeams(
        data.map((t) => ({
          id: t._id,
          title: `${t.teamName}`,
          wins: t.wins,
          loses: t.loses
        }))
      );
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };
    return(
        <div className="leaderboard-page">
      <h1>Team Leaderboard</h1>
      </div>
    );
}
export default Leaderboard;