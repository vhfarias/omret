let prompt = require('prompt-sync')();
let { readFileSync, writeFileSync } = require('fs');

//importa o objeto do arquivo
let input = JSON.parse(readFileSync(__dirname + '/words.json'));

//converte o objeto em um array para facilidade de iteração
let data = Array.from(Object.entries(input));

//ordem alfabética
//data = data.sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));

//embaralhar palavras
/* for (let i = 0; i < 1000; i++) {
  data = data.sort((a, b) => Math.random() - 0.5);
} */

// confirma palavra a palavra
let output = data.filter((el, i, arr) => {
  let filter = prompt(`(${i + 1}/${arr.length}) Manter ${el[1]}? (y/n): `);
  return filter.toLowerCase() === 'y';
})

writeFileSync(__dirname + '/words.json', JSON.stringify(Object.fromEntries(output), null, ' '));