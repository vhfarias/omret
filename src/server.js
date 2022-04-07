const express = require('express');

let app = express();

const PORT = 4000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
app.get('/css/:name', (req, res) => {
  res.sendFile(__dirname + '/css/' + req.params.name);
})

app.get('/js/:name', (req, res) => {
  res.sendFile(__dirname + '/js/' + req.params.name);
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));