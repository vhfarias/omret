let fs = require('fs');

const pdd = fs.readFileSync('./database/pdd.txt', { encoding: 'utf8' });
console.log(`Palavra do dia: ${pdd}`)

const checkWord = (guess) => {

  // cria um array distinguindo as letras no lugar certo das outras
  let par = Array.from(pdd).map((letter, i) => guess[i] === letter ? '=' : pdd[i]);

  //cria uma cópia do array acima
  let par2 = Array.from(par);

  //transformea o array acima para distinguir letras no lugar errado e no lugar certo das outras
  for (let i in par) {
    //se a letra já foi dada como igual, ignorar
    if (par[i] === '=') continue
    else {
      //percorrer cada letra da tentativa para encontrar correspondência com a palavra-chave
      for (let j in guess) {
        // ignorar letras que já foram comparadas
        if (['=', '~', '-'].includes(par2[j])) continue
        // se as letras são iguais, está na palavra, mas na posição errada
        if (guess[j] === pdd[i]) {
          par2[j] = '~';
          break;
        }
      }
    }
  }

  // cria um array que distingue letras certas, em posição errada e inexistentes
  let par3 = par2.map(v => ['=', '~'].includes(v) ? v : '-')

  return par3.map(s => (s === '=' ? 'right' : s === '~' ? 'misplaced' : 'wrong'))

}

module.exports = {
  checkWord
}