'use strict'
const express = require('express');
const bodyparser = require('body-parser');
const { sttRouter } = require('./middleware/stt');

const app = express();


app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.status(200).json({ msg: "Welcome to pucho STT"});
})
app.use('/stt', sttRouter)

app.listen(3003, () => {
  console.log("server running on port 3003");
})