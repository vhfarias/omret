const express = require('express');
const { checkWord } = require('./checkWord');
const { drawWord, getWordOfTheDayTimestamp } = require('./drawWord');

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
  res.json(checkWord(req.body.guess, req.body.tries === 6));
})

app.post('/draw', (req, res) => {
  drawWord();
  res.json({ status: 'ok' });
})

//verifica se precisa sortear uma nova palavra
const today = new Date(Date.now()).getDate();
if (today !== getWordOfTheDayTimestamp()) drawWord();
if (today !== getWordOfTheDayTimestamp()) console.log('precisou sortear palavra nova');

//TODO: definir um intervalo diário para sortar palavras

//define um timer para sortear a próxima palavra, às 0h do próximo dia
const tomorrow = new Date(Date.now());
tomorrow.setDate(today + 1);
tomorrow.setHours(0);
tomorrow.setMinutes(0);
tomorrow.setSeconds(0);
console.log(`Faltam ${tomorrow - Date.now()}ms para o próximo sorteio`)

setTimeout(() => {
  drawWord();
  //define um intervalo diário
  setInterval(() => {
    drawWord()
  }, 24 * 60 * 60 * 1000);
}, (tomorrow - Date.now()))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));