const mongoose = require('mongoose');

const TeamScoreSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    score: Number,
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    visiting: Boolean
});

const TeamScoreModel = mongoose.model('TeamScore', TeamScoreSchema);

exports.createTeamScore = async function(TeamScoreData){
    let TeamScore = new TeamScoreModel(TeamScoreData);
    await TeamScore.save();
    return TeamScore;
}

exports.getAllTeamScores = async function(){
    let lstTeamScores = await TeamScoreModel.find();
    return lstTeamScores;
}

exports.readOneTeamScore = async function(id){
    let TeamScore = await TeamScoreModel.findById(id);
    return TeamScore;
}

exports.updateTeamScore = async function(id, TeamScoreData){
    let TeamScore = await TeamScoreModel.findById(id);
    if(!TeamScore) return null;
    TeamScore.teamId = TeamScoreData.teamId;
    TeamScore.score = TeamScoreData.score;
    TeamScore.gameId = TeamScoreData.gameId;
    TeamScore.visiting = TeamScoreData.visiting;
    await TeamScore.save();
    return TeamScore;
}

exports.deleteTeamScore = async function(id){
    await TeamScoreModel.findByIdAndDelete(id);
}

exports.deleteAll = async function name(){
    await TeamScoreModel.deleteMany();
}

exports.addHomeRun = async function(id){
    let TeamScore = await TeamScoreModel.findById(id);
    if(!TeamScore) return null;
    TeamScore.score += 1;
    await TeamScore.save();
    return TeamScore;
}