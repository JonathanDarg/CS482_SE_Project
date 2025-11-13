const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'parent', 'child'], 
    default: 'parent',
    required: true 
  },
  
  // For child accounts - link to parent
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() { return this.role === 'child'; }
  },
  
  // For parent accounts - array of their children
  children: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  
  // For managers - link to their team
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team',
    required: function() { return this.role === 'manager'; }
  },
  
  // Optional: for team assignment validation
  teamCode: { type: String },
  
  // Track account status
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);