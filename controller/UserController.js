const User = require("../model/User");
const TeamDao = require("../model/TeamDao");

// Return the profile for the currently logged-in user
exports.getMe = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.session.user.id)
      .populate("children", "name role")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // If user has a team, attach basic team info
    if (user.teamId) {
      const team = await TeamDao.readOneTeam(user.teamId);
      user.team = team ? { id: team._id, name: team.teamName } : null;
    }

    res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Return a public profile for a given user id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .populate("children", "name role")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // attach team info when available
    if (user.teamId) {
      const team = await TeamDao.readOneTeam(user.teamId);
      user.team = team ? { id: team._id, name: team.teamName } : null;
    }

    // If the requester is not the owner, strip sensitive fields
    if (!req.session.user || String(req.session.user.id) !== String(id)) {
      // hide email and internal fields for public view
      delete user.email;
      delete user.password;
    }

    res.json({ user });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ error: err.message });
  }
};
