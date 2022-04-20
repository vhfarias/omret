const { readFileSync, writeFileSync } = require('fs');

//caminhos dos arquivos a serem lidos/escritos
const root = __dirname + '/database/';
const wordListFilepath = root + 'wordList.json';
const pastWordsFilepath = root + 'pastWords.json';
const lastWordFilepath = root + 'pdd.json';

const drawWord = () => {
  //carrega o conteúdo dos arquivos em forma de Array
  let wordList = Object.entries(JSON.parse(readFileSync(wordListFilepath, { encoding: 'utf-8' })));
  let pastWords = Object.entries(JSON.parse(readFileSync(pastWordsFilepath, { encoding: 'utf-8' })));
  let lastWord = Object.entries(JSON.parse(readFileSync(lastWordFilepath, { encoding: 'utf-8' })))[0];

  //limpa lista de palavras sorteadas se todas elas já foram,
  //deixando apenas a mais recente
  //(vai levar um bom tempo, mas vai que...)
  if (pastWords.length === wordList.length) {
    pastWords = [Array.from(lastWord)];
  }
  //sorteia uma palavra aleatória até ela ser nova
  let randomEntry = Array.from(lastWord);
  while (pastWords.find(wrd => wrd[0] === randomEntry[0])) {
    let randomIndex = Math.floor(Math.random() * wordList.length);
    randomEntry = Array.from(wordList[randomIndex]);
  }
  //adiciona a palavra sorteada no conjunto
  pastWords.push(randomEntry);
  lastWord = [Array.from(randomEntry)];
  //escreve a palavra mais recente em arquivo separado
  writeFileSync(lastWordFilepath, JSON.stringify(Object.fromEntries(lastWord)));
  //escreve as palavras sorteadas anteriormente em arquivo
  writeFileSync(pastWordsFilepath, JSON.stringify(Object.fromEntries(pastWords), null, ' '));
}

module.exports = drawWord;

