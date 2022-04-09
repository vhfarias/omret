let fs = require('fs');

const todayWord = fs.readFileSync('./database/pdd.txt', { encoding: 'utf8' });
console.log(`Palavra do dia: ${todayWord}`)

const checkWord = (guess) => {
  let check = guess.split('').map((letter, i) => {
    if (letter.toLowerCase() === todayWord[i].toLowerCase()) {
      return [i, 'right'];
    } else if (todayWord.split('').includes(letter)) {
      return [i, 'misplaced']
    } else return [i, 'wrong']
  })

  return Object.fromEntries(check);
}

module.exports = {
  checkWord
}