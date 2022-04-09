const express = require('express');
const { checkWord } = require('./checkWord');

let app = express();

const PORT = 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/css/:name', (req, res) => {
  res.sendFile(__dirname + '/public/css/' + req.params.name);
})

app.get('/js/:name', (req, res) => {
  res.sendFile(__dirname + '/public/js/' + req.params.name);
})

app.post('/check', (req, res) => {
  console.log(req.body);
  res.json(checkWord(req.body.word));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));