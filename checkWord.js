let fs = require('fs');

const todayWord = fs.readFileSync('./database/pdd.txt', { encoding: 'utf8' });
console.log(`Palavra do dia: ${todayWord}`)

const checkWord = (guess) => {
  let pdd = todayWord.split('').reduce((acc, letter, i) => {
    if (acc.hasOwnProperty(letter)) {
      acc[letter].push(i);
    } else {
      acc[letter] = [i];
    }
    return acc;
  }, {})

  let check = Object.entries(guess).reduce((acc, entry) => {
    let [letter, occurrences] = entry;
    // se tiver a letra do palpite na pdd, ou tá certo ou tá fora de lugar
    if (pdd.hasOwnProperty(letter)) {
      for (let i = 0; i < Math.min(pdd[letter].length, occurrences.length); i++) {
        let oc = occurrences[i];
        pdd[letter].includes(oc) ? acc[oc] = 'right' : acc[oc] = 'misplaced';
      }
    }
    return acc;
  }, new Array(5).fill('wrong'));
  return Object.fromEntries(check.entries());
}

module.exports = {
  checkWord
}