const fs = require('fs');

let input = fs.readFileSync(__dirname + '/lexporbr_alfa_txt.txt', { encoding: 'latin1' });
let output = fs.openSync(__dirname + '/database.csv', 'w');

//TODO: filtro para remover palavras estrangeiras

//funcão para encadeamento de uma sequência de funções a serem aplicadas aos dados
const pipe = (...funcs) => x => funcs.reduce((acc, f) => f(acc), x);

const splitLines = x => {
  x.data = x.data.split(x.lineSeparator);
  return x
}
const splitCols = x => {
  x.data = x.data.map(row => row.split(x.dataSeparator));
  return x
}
const splitHeader = x => {
  if (x.hasHeader) x.header = x.data.shift();
  return x;
}
const filterByLength = x => {
  x.data = x.data.filter((row, i) => {
    return row[0].length === x.wordLength;
  })
  return x
}
const filterBySymbol = x => {
  x.data = x.data.filter((row, i) => {
    return row[0].match(/([A-z]|[ãáâeéêíóôúç]){5}/);
  })
  return x
}
const removeFlexedVerbs = x => {
  x.data = x.data.filter((row, i) => {
    if (row[1].includes('ver')) {
      let verb = row[0];
      return (verb[verb.length - 1] === 'r')
    }
    return true;
  })
  return x
}
const rejoinData = x => {
  x.data = x.data.map(row => {
    return row.filter((data, i) => {
      return (x.desiredColumns.includes(i));
    })
      .join(x.newDataSeparator);
  })
  return x
}

let result = pipe(splitLines, splitCols, splitHeader, filterByLength, filterBySymbol, removeFlexedVerbs, rejoinData)({
  data: input,
  lineSeparator: '\r\n',
  dataSeparator: '\t',
  newDataSeparator: ';',
  hasHeader: true,
  wordLength: 5,
  desiredColumns: [0, 1, 2, 14, 24]
})

fs.writeFileSync(output, result.data.join('\n'))