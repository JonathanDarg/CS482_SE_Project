const User = require("../model/User");
const bcrypt = require("bcryptjs");
const TeamDao = require("../model/TeamDao");

// Default team code for managers
const DEFAULT_TEAM_CODE = "LEAGUE2025";

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, parentEmail, teamCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Build user object
    const userData = {
      name,
      email,
      password: hashed,
      role: role || 'parent'
    };

    // Handle child account - verify parent exists
    if (role === 'child') {
      if (!parentEmail) {
        return res.status(400).json({ message: "Parent email required for child accounts" });
      }
      
      const parent = await User.findOne({ email: parentEmail, role: 'parent' });
      if (!parent) {
        return res.status(400).json({ message: "Parent account not found" });
      }
      
      userData.parentId = parent._id;
    }

    // Handle manager account - verify team code and create team
    if (role === 'manager') {
      if (!teamCode) {
        return res.status(400).json({ message: "Team code required for manager accounts" });
      }
      
      // Verify the team code is correct
      if (teamCode !== DEFAULT_TEAM_CODE) {
        return res.status(400).json({ message: "Invalid team code" });
      }
      
      // Don't store teamCode on user - only use it for validation
      // Don't set teamId yet - will be set after team creation
    }

    // Admin accounts should only be created by existing admins
    if (role === 'admin') {
      if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can create admin accounts" });
      }
    }

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    // If manager, create their team automatically
    if (role === 'manager') {
      const managerTeam = await TeamDao.createTeam({
        teamName: `${name}'s Team`,
        manager: newUser._id,
        players: []
      });
      
      // Update the user's teamId
      newUser.teamId = managerTeam._id;
      await newUser.save();
    }

    // If child account, add to parent's children array
    if (role === 'child' && userData.parentId) {
      await User.findByIdAndUpdate(
        userData.parentId,
        { $push: { children: newUser._id } }
      );
    }

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Store user info in session including role
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      parentId: user.parentId,
      teamId: user.teamId
    };

    res.json({
      message: "Login successful",
      user: req.session.user
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

exports.checkSession = (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

exports.getChildren = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'parent') {
      return res.status(403).json({ message: "Access denied" });
    }

    const parent = await User.findById(req.session.user._id)
      .populate('children', 'name email createdAt');
    
    res.json({ children: parent.children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Session user:", req.session.user); // Debug log
    
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ message: "User ID and new role are required" });
    }

    // Validate role
    const validRoles = ['parent', 'manager', 'child', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent demoting yourself if you're the admin
    if (user._id.toString() === req.session.user._id && newRole !== 'admin') {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    // Update the role
    user.role = newRole;
    
    // Clear teamId if changing from manager to another role
    if (user.role !== 'manager' && user.teamId) {
      user.teamId = null;
    }

    await user.save();

    res.json({ 
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.session.user._id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ 
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: err.message });
  }
};