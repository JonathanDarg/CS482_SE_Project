const User = require("../model/User");
const bcrypt = require("bcryptjs");

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

    // Handle manager account - verify team code
    if (role === 'manager') {
      if (!teamCode) {
        return res.status(400).json({ message: "Team code required for manager accounts" });
      }
      
      userData.teamCode = teamCode;
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
      id: user._id,
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

    const parent = await User.findById(req.session.user.id)
      .populate('children', 'name email createdAt');
    
    res.json({ children: parent.children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};