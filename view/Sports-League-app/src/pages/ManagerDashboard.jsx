import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Send, CheckCircle, XCircle } from "lucide-react";

export default function ManagerDashboard() {
  const [team, setTeam] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const navigate = useNavigate();

  const MAX_TEAM_SIZE = 15;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/Login");
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== "manager") {
      alert("Access denied. Managers only.");
      navigate("/");
      return;
    }

    if (!user.teamId) {
      setError("Team not found. Please log out and log back in.");
      return;
    }

    fetchTeamData(user.teamId);
    fetchAvailablePlayers();
    fetchTeamInvites(user.teamId);
  }, [navigate]);

  const fetchTeamData = async (teamId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/teams/${teamId}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to load team data");
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error("Error loading team:", err);
      setError("Failed to load team data");
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams/children", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to load players");
      const data = await res.json();
      
      // Filter out players who already have a team
      const available = data.filter(player => !player.teamId);
      setAvailablePlayers(available);
    } catch (err) {
      console.error("Error loading players:", err);
      setError("Failed to load available players");
    }
  };

  const fetchTeamInvites = async (teamId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/invites/team/${teamId}`, {
        credentials: "include"
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to load invites");
      }
      const data = await res.json();
      console.log("Fetched invites:", data.invites); // Debug log
      setSentInvites(data.invites || []);
    } catch (err) {
      console.error("Error loading invites:", err);
      setError(`Failed to load invites: ${err.message}`);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    
    if (!selectedPlayer) {
      setError("Please select a player to invite");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:4000/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ playerId: selectedPlayer })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send invite");
      }

      const data = await res.json();
      setSuccess(data.message || "Invite sent successfully!");
      setSelectedPlayer("");
      
      // Refresh data - make sure team is defined
      if (team && team._id) {
        await fetchTeamInvites(team._id);
        await fetchAvailablePlayers();
        await fetchTeamData(team._id);
      }
    } catch (err) {
      console.error("Error sending invite:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameTeam = async () => {
    if (!newTeamName.trim()) {
      setError("Team name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get manager ID from localStorage since team.manager might be null
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);
      
      const res = await fetch(`http://localhost:4000/api/teams/${team._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          teamName: newTeamName,
          manager: user._id,
          players: team.players ? team.players.map(p => p._id || p) : []
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to rename team");
      }

      setSuccess("Team renamed successfully!");
      setIsEditingTeamName(false);
      fetchTeamData(team._id);
    } catch (err) {
      console.error("Error renaming team:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      accepted: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300"
    };

    const icons = {
      pending: <Send className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!team && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Manager Dashboard</h1>
          {team && (
            <div className="text-lg">
              <div className="mb-1 flex items-center gap-3">
                <span>Team: </span>
                {isEditingTeamName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="px-3 py-1 rounded text-gray-800 font-semibold"
                      placeholder="Team name"
                    />
                    <button
                      onClick={handleRenameTeam}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm font-semibold disabled:bg-gray-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingTeamName(false);
                        setNewTeamName("");
                      }}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold">{team.teamName}</span>
                    <button
                      onClick={() => {
                        setNewTeamName(team.teamName);
                        setIsEditingTeamName(true);
                      }}
                      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-semibold"
                    >
                      ✏️ Rename
                    </button>
                  </>
                )}
              </div>
              <p className="mb-1">Roster: <span className="font-semibold">{team.players?.length || 0}/{MAX_TEAM_SIZE}</span> players</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {/* Current Roster */}
        {team && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-blue-600" />
              Current Roster ({team.players?.length || 0}/{MAX_TEAM_SIZE})
            </h2>
            {team.players && team.players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players.map((player) => (
                  <div key={player._id} className="border rounded-lg p-4 bg-gray-50">
                    <p className="font-semibold text-lg">{player.name}</p>
                    <p className="text-sm text-gray-600">{player.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No players on your team yet. Send invites below!</p>
            )}
          </div>
        )}

        {/* Send Invite Form */}
        {team && team.players?.length < MAX_TEAM_SIZE && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Send className="text-blue-600" />
              Invite Players
            </h2>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Player
                </label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">-- Choose a player --</option>
                  {availablePlayers.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.name} ({player.email})
                    </option>
                  ))}
                </select>
                {availablePlayers.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No available players without a team.</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !selectedPlayer || availablePlayers.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Invite"}
              </button>
            </form>
          </div>
        )}

        {team && team.players?.length >= MAX_TEAM_SIZE && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            Your team is full ({MAX_TEAM_SIZE} players). You cannot send more invites.
          </div>
        )}

        {/* Sent Invites */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Sent Invites</h2>
          {sentInvites && sentInvites.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Player Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Sent Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sentInvites.map((invite) => (
                    <tr key={invite._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{invite.playerId?.name || "Unknown"}</td>
                      <td className="px-4 py-3">{invite.playerId?.email || "N/A"}</td>
                      <td className="px-4 py-3">{getStatusBadge(invite.status)}</td>
                      <td className="px-4 py-3">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No invites sent yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
