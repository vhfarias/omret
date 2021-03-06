let fs = require('fs');

const checkWord = (guess, showSolution) => {
  //lê o arquivo com a palavra do dia
  const pdd = Object.entries(JSON.parse(fs.readFileSync('./database/pdd.json', { encoding: 'utf8' })))[0];

  // cria um array distinguindo as letras no lugar certo das outras
  let par = Array.from(pdd[0]).map((letter, i) => guess[i] === letter ? '=' : pdd[0][i]);

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
        if (guess[j] === pdd[0][i]) {
          par2[j] = '~';
          break;
        }
      }
    }
  }

  // cria um array que distingue letras certas, em posição errada e inexistentes
  let par3 = par2.map(v => ['=', '~'].includes(v) ? v : '-')

  let par4 = par3.map(s => (s === '=' ? 'right' : s === '~' ? 'misplaced' : 'wrong'))

  let response = {};
  response.answer = par4;
  //envia a resposta certa se for a ultima tentativa
  showSolution ? response.solution = pdd[1] : '';
  return response
}

module.exports = {
  checkWord
}