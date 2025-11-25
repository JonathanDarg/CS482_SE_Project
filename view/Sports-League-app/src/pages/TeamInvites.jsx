import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle, XCircle, Users } from "lucide-react";

export default function TeamInvites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/Login");
      return;
    }
    
    const user = JSON.parse(userData);
    // Only child and parent roles can view invites
    if (user.role !== "child" && user.role !== "parent") {
      alert("This page is only for players and parents.");
      navigate("/");
      return;
    }

    fetchInvites();
  }, [navigate]);

  const fetchInvites = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/invites/player", {
        credentials: "include"
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to load invites");
      }
      
      const data = await res.json();
      setInvites(data.invites);
    } catch (err) {
      console.error("Error loading invites:", err);
      setError(err.message);
    }
  };

  const handleRespond = async (inviteId, response, teamName) => {
    const action = response === 'accept' ? 'accept' : 'reject';
    const confirmMessage = response === 'accept' 
      ? `Are you sure you want to join ${teamName}?`
      : `Are you sure you want to decline the invite from ${teamName}?`;
    
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:4000/api/invites/${inviteId}/respond`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ response })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action} invite`);
      }

      const data = await res.json();
      setSuccess(data.message);
      
      // Refresh invites
      fetchInvites();

      // If accepted, refresh the page after a delay to show updated team info
      if (response === 'accept') {
        setTimeout(() => {
          // Update localStorage with new teamId
          const userData = localStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            // Note: You might want to fetch updated user data from server
            localStorage.setItem("user", JSON.stringify({ ...user, teamId: data.teamId }));
          }
          navigate("/Profile");
        }, 2000);
      }
    } catch (err) {
      console.error(`Error ${action}ing invite:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Mail className="w-10 h-10" />
            Team Invites
          </h1>
          <p className="text-lg">View and respond to team invitations</p>
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

        {/* Invites List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {invites.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No pending invites</p>
              <p className="text-gray-400 mt-2">You'll see team invitations here when a manager invites you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Pending Invites ({invites.length})</h2>
              {invites.map((invite) => (
                <div 
                  key={invite._id} 
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-400 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="text-orange-600 w-6 h-6" />
                        <h3 className="text-2xl font-bold text-gray-800">
                          {invite.teamId?.teamName || "Unknown Team"}
                        </h3>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-semibold">Manager:</span>{" "}
                          {invite.managerId?.name || "Unknown"}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {invite.managerId?.email || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Invited on {new Date(invite.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleRespond(invite._id, 'accept', invite.teamId?.teamName)}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(invite._id, 'reject', invite.teamId?.teamName)}
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
