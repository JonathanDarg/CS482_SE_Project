const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./model/DbConnection'); 
db.connect(); // Connect to MongoDB

const gameController = require('./model/GameDao.js'); 

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/games', async (req, res) => {
  const games = await gameController.getAllGames();
  res.json(games);
});

app.post('/api/games', async (req, res) => {
  const game = await gameController.createGame(req.body);
  res.json(game);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
