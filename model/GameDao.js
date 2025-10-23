const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    location: String,
    dateTime: {type: Date, default: Date.now},
    rating: Number,
    typeOfMatch: String
});

const gameModel = mongoose.model('Game', gameSchema);

exports.createGame = async function(gameData){
    let game = new gameModel(gameData);
    await game.save();
    return game;
}

exports.getAllGames = async function(){
    let lstGames = await gameModel.find();
    return lstGames;
}

exports.readOneGame = async function(id){
    let game = await gameModel.findById(id);
    return game;
}

exports.updateGame = async function(id, gameData){
    let game = await gameModel.findById(id);
    if(!game) return null;
    game.location = gameData.location;
    game.dateTime = gameData.dateTime;
    game.rating = gameData.rating;
    game.typeOfMatch = gameData.typeOfMatch;
    await game.save();
    return game;
}

exports.deleteGame = async function(id){
    await gameModel.findByIdAndDelete(id);
}

exports.deleteAll = async function name(){
    await gameModel.deleteMany();
}

