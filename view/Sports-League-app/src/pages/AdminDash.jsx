import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

export default function Manager() {
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [children, setChildren] = useState([]);
  const [form, setForm] = useState({
    teamName: "",
    manager: "",
    players: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);

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

  const fetchManagers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams/managers");
      if (!res.ok) throw new Error("Failed to load managers");
      const data = await res.json();
      setManagers(data);
    } catch (err) {
      console.error("Error loading managers:", err);
      setError("Failed to load managers");
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/teams/children");
      if (!res.ok) throw new Error("Failed to load children");
      const data = await res.json();
      setChildren(data);
    } catch (err) {
      console.error("Error loading children:", err);
      setError("Failed to load children");
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchManagers();
    fetchChildren();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePlayer = (playerId) => {
    setForm((prev) => ({
      ...prev,
      players: prev.players.includes(playerId)
        ? prev.players.filter((id) => id !== playerId)
        : [...prev.players, playerId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.teamName.trim()) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      teamName: form.teamName,
      manager: form.manager || null,
      players: form.players
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

      if (!res.ok) throw new Error(`Failed to ${editMode ? "update" : "create"} team`);

      setForm({ teamName: "", manager: "", players: [] });
      setEditMode(false);
      setEditingTeamId(null);
      await fetchTeams();
    } catch (err) {
      console.error(`Error ${editMode ? "updating" : "creating"} team:`, err);
      setError(`Failed to ${editMode ? "update" : "create"} team. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = (team) => {
    setForm({
      teamName: team.teamName,
      manager: team.manager?._id || "",
      players: team.players?.map((p) => p._id || p) || []
    });
    setEditMode(true);
    setEditingTeamId(team._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm({ teamName: "", manager: "", players: [] });
    setEditMode(false);
    setEditingTeamId(null);
    setError("");
  };

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
    <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10 min-h-screen bg-gray-50">

      <header className="text-center py-6 bg-orange-500 text-white shadow-md rounded-lg mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          ⚾ Little League Admin Dashboard
        </h1>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">

        {/* Create/Edit Form */}
        <div className="lg:col-span-1 bg-white shadow-xl rounded-lg p-6 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold mb-6 text-black">
            {editMode ? " Edit Team" : "➕ Create a New Team"}
          </h2>

          <div>
            <input
              name="teamName"
              placeholder="Team Name *"
              value={form.teamName}
              onChange={handleChange}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              name="manager"
              value={form.manager}
              onChange={handleChange}
              className="w-full mb-6 p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" className="text-gray-500">
                Select Manager (Optional)
              </option>
              {managers.map((manager) => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 font-semibold bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-150 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
              >
                {loading
                  ? editMode
                    ? "Updating..."
                    : "Creating..."
                  : editMode
                  ? "Update Team"
                  : "Create Team"}
              </button>

              {editMode && (
                <button
                  onClick={handleCancelEdit}
                  className="font-semibold bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-150 shadow-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Player Selection */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold mb-4 text-black">Select Players</h2>

          {children.length === 0 ? (
            <p className="text-gray-500 text-center py-10 border border-dashed rounded-lg">
              No children available to draft.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2 border p-3 rounded-lg bg-gray-50">
              {children.map((child) => (
                <label
                  key={child._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-150 ${
                    form.players.includes(child._id)
                      ? "bg-orange-100 border-l-4 border-orange-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.players.includes(child._id)}
                    onChange={() => togglePlayer(child._id)}
                    className="mr-4 h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-black">{child.name}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 text-md text-gray-700 font-medium">
            <span className="text-orange-500 font-bold">
              {form.players.length}
            </span>{" "}
            player(s) selected
          </div>
        </div>
      </div>

      <div className="mt-16">

        <h2 className="text-3xl font-bold mb-6 text-black border-b-2 border-orange-500 pb-2 flex items-center justify-center gap-2">
          <Trophy className="h-7 w-7 text-orange-500" />
          Existing Teams
        </h2>

        {teams.length === 0 && (
          <p className="text-lg text-gray-500 text-center py-10">
            No teams created yet. Get started by drafting one!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-300 transition duration-300 ease-in-out hover:border-orange-400 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex-1">

                {/* Team name — NO trophy here */}
                <h3 className="text-xl font-extrabold text-orange-500 mb-2 border-b border-gray-100 pb-1">
                  {team.teamName}
                </h3>

                <p className="text-sm text-gray-700 mb-3">
                  <span className="font-semibold text-black">Manager:</span>{" "}
                  {team.manager?.name || "Unassigned"}
                </p>

                <div className="text-sm text-gray-700 mt-3">
                  <span className="font-semibold text-black">
                    Players ({team.players?.length || 0}):
                  </span>

                  {team.players?.length ? (
                    <ul className="list-disc ml-5 mt-1 text-sm text-gray-600 max-h-24 overflow-y-auto">
                      {team.players.map((player) => (
                        <li key={player._id}>{player.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic">
                      {" "}
                      No players drafted yet.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditTeam(team)}
                  className="flex-1 border border-orange-500 text-black px-3 py-2 rounded-lg hover:bg-orange-100 transition duration-150 whitespace-nowrap text-sm font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteTeam(team._id)}
                  className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-500 transition duration-150 whitespace-nowrap text-sm font-medium"
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
