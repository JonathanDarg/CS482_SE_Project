const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: String,
    wins: int,
    losses: int
});

const TeamModel = mongoose.model('Team', TeamSchema);

exports.createTeam = async function(TeamData){
    let Team = new TeamModel(TeamData);
    await Team.save();
    return Team;
}

exports.getAllTeams = async function(){
    let lstTeams = await TeamModel.find();
    return lstTeams;
}

exports.readOneTeam = async function(id){
    let Team = await TeamModel.findById(id);
    return Team;
}

exports.updateTeam = async function(id, TeamData){
    let Team = await TeamModel.findById(id);
    if(!Team) return null;
    Team.teamName = TeamData.teamName;
    Team.wins = TeamData.wins;
    Team.losses = TeamData.loses;
    await Team.save();
    return Team;
}

exports.deleteTeam = async function(id){
    await TeamModel.findByIdAndDelete(id);
}

exports.deleteAll = async function name(){
    await TeamModel.deleteMany();
} 