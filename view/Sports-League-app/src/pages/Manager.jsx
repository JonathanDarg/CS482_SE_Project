import { useState, useEffect } from "react";

export default function Manager() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    teamName: "",
    manager: "",
    players: [""] // Start with one empty player field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Load teams
  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams");
      if (!res.ok) throw new Error("Failed to load teams");
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Error loading teams:", err);
      setError("Failed to load teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Update team name or manager
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update individual player field
  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...form.players];
    updatedPlayers[index] = value;
    setForm({ ...form, players: updatedPlayers });
  };

  // Add new player field
  const addPlayerField = () => {
    setForm({ ...form, players: [...form.players, ""] });
  };

  // Remove player field
  const removePlayerField = (index) => {
    const updatedPlayers = form.players.filter((_, i) => i !== index);
    setForm({ 
      ...form, 
      players: updatedPlayers.length > 0 ? updatedPlayers : [""] 
    });
  };

  // Create team
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.teamName.trim()) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError("");

    // Filter out empty player names
    const filteredPlayers = form.players
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const payload = {
      teamName: form.teamName,
      manager: form.manager,
      players: filteredPlayers
    };

    try {
      const url = editMode 
        ? `http://localhost:4000/api/teams/${editingTeamId}`
        : "http://localhost:4000/api/teams";
      
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Failed to ${editMode ? 'update' : 'create'} team`);

      setForm({ teamName: "", manager: "", players: [""] });
      setEditMode(false);
      setEditingTeamId(null);
      await fetchTeams();
    } catch (err) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} team:`, err);
      setError(`Failed to ${editMode ? 'update' : 'create'} team. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Edit team - populate form
  const handleEditTeam = (team) => {
    setForm({
      teamName: team.teamName,
      manager: team.manager || "",
      players: team.players && team.players.length > 0 ? team.players : [""]
    });
    setEditMode(true);
    setEditingTeamId(team._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setForm({ teamName: "", manager: "", players: [""] });
    setEditMode(false);
    setEditingTeamId(null);
    setError("");
  };

  // Delete team
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/teams/${id}`, { 
        method: "DELETE" 
      });
      if (!res.ok) throw new Error("Failed to delete team");
      await fetchTeams();
    } catch (err) {
      console.error("Error deleting team:", err);
      setError("Failed to delete team");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <h1 className="text-3xl font-bold text-center mb-10">Team Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-14">
        <h2 className="text-2xl font-semibold mb-4">
          {editMode ? "Edit Team" : "Create a Team"}
        </h2>

        <div>
          <input
            name="teamName"
            placeholder="Team Name *"
            value={form.teamName}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="manager"
            placeholder="Manager Name"
            value={form.manager}
            onChange={handleChange}
            className="w-full mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Dynamic Player Fields */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">Players</label>
            
            {form.players.map((player, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  placeholder={`Player ${index + 1} Name`}
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.players.length > 1 && (
                  <button
                    onClick={() => removePlayerField(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addPlayerField}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
            >
              + Add Player
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading 
                ? (editMode ? "Updating..." : "Creating...") 
                : (editMode ? "Update Team" : "Create Team")
              }
            </button>
            
            {editMode && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Team List */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold mb-4">All Teams</h2>

        {teams.length === 0 && (
          <p className="text-gray-500 text-center">No teams created yet.</p>
        )}

        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{team.teamName}</h3>
                <p className="text-sm text-gray-700">
                  Manager: {team.manager || "None"}
                </p>
                <p className="text-sm text-gray-700">
                  Players:{" "}
                  {team.players?.length
                    ? team.players.join(", ")
                    : "None"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}