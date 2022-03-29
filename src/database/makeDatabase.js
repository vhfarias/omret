const fs = require('fs');

const lineSeparator = '\r\n';
const dataSeparator = '\t';

const wordLength = 5;
const newLineSeparator = '\n';
const newDataSeparator = ';'
const columns = [0, 1, 2, 14, 24];

let input = fs.readFileSync(__dirname + '/lexporbr_alfa_txt.txt', { encoding: 'latin1' });
let output = fs.openSync(__dirname + '/database.csv', 'w');
let header = [];

let result = input
  // separa as linhas
  .split(lineSeparator)
  // separa as infos de cada linha
  .map(line => {
    return line.split(dataSeparator);
  });
//separa a linha de cabeçalho
header = result.shift();
// mantém apenas as palavras de [wordLength] letras
result = result
  .filter((line, i) => {
    return i === 0 ? true : line[0].length === wordLength && !line[14].includes("S");
  })
  //remove conjugações de verbos, deixa apenas infinitivos
  .filter((line, i) => {
    if (line[1].includes('ver')) {
      let verbo = line[0];
      return (verbo[verbo.length - 1] === 'r')
    }
    return true;
  })
  // junta as infos das colunas desejadas de uma linha com o novo separador
  .map(line => {
    return line.filter((data, i) => {
      return (columns.includes(i));
    })
      .join(newDataSeparator);
  })

//fs.writeFileSync(output, header + newLineSeparator)
fs.writeFileSync(output, result.join(newLineSeparator))