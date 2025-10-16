const express = require('express');
require('dotenv').config();
const db = require('./model/DbConnection');

db.connect(); // Connect to MongoDB

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running'); //test app
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on ${process.env.HOSTNAME}:${process.env.PORT}...`));
