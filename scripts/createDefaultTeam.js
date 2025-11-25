const mongoose = require("mongoose");
const TeamModel = require("../model/TeamDao");
require("dotenv").config();

const createDefaultTeam = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/youth-sports-league");
    console.log("Connected to MongoDB");

    // Check if a team with this name already exists
    const existingTeams = await TeamModel.getAllTeams();
    const defaultTeamExists = existingTeams.some(team => team.teamName === "Default Team");

    if (defaultTeamExists) {
      console.log("Default team already exists!");
      process.exit(0);
      return;
    }

    // Create default team
    const defaultTeam = await TeamModel.createTeam({
      teamName: "Default Team",
      manager: null,
      players: []
    });

    console.log("\n✅ Default Team Created Successfully!");
    console.log("================================");
    console.log("Team Name: Default Team");
    console.log("Team Code: LEAGUE2025");
    console.log("================================");
    console.log("\nManagers can use team code 'LEAGUE2025' to sign up");
    
    process.exit(0);
  } catch (err) {
    console.error("Error creating default team:", err);
    process.exit(1);
  }
};

createDefaultTeam();
