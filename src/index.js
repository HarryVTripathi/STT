'use strict'
const express = require('express');
const bodyparser = require('body-parser');
const { sttRouter } = require('./middleware/stt');

const app = express();


app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.status(200).json({ msg: "Welcome to pucho STT"});
})

app.get('/test', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.json({ query: req.query });
})

app.use('/stt', sttRouter)

app.listen(3003, () => {
  console.log("server running on port 3003");
})