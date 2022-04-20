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
const removeSymbols = x => {
  x.data = x.data.filter((row, i) => {
    return row[0].match(/([A-z]|[aãáâeéêiíoóôuúç]){5}/);
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

const filterEnglish = x => {
  x.data = x.data.filter((row, i) => {
    /* let letra_k = /k/;        //182
    let letra_y = /y/;        //153
    let bigrama_ll = /ll/     //58
    let bigrama_sh = /sh/;    //46
    let bigrama_ts = /ts/     //45
    let bigrama_th = /th/;    //40
    let trigrama_tch = /tch/; //12
    let bigrama_rl = /rl/     //12
    let bigrama_gh = /gh/;    //12
    let bigrama_aa = /aa/;    //12
    let bigrama_sw = /sw/;    //8
    let trigrama_ems = /ems/; //6
    let bigrama_ii = /ii/;    //6
    let bigrama_md = /md/;    //6
    let inicio_cedilha = /^(ç)/ //3
    let bigrama_dz = /dz/;    //2 */

    //let regexp = bigrama_md;

    let regexp = new RegExp(`^(ç)|(k|y|(sh)|(th)|(md)|(sw)|(gh)|(rl)|([aáâ][aáâ])|(tch)|(ems)|(ll)|(ii)|(ts)|(dz))|([^[aãáâeéêiíoóôuúçlmrsz]$)`)
    return (!row[0].match(regexp))
  })
  return x;
}

const sortByAlphabetical = x => {
  x.data = x.data.sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
  return x;
}

const filterVerbs = x => {
  x.data = x.data.filter(row => row[1] === 'ver')
  return x;
}

const rejoinData = x => {
  x.data = x.data.map(row => {
    return row.filter((data, i) => {
      return (x.desiredColumns ? x.desiredColumns.includes(i) : true);
    })
      .join(x.newDataSeparator);
  })
  //rejoin header
  if (x.header && x.keepHeader) x.data.unshift(x.header.filter((data, i) => (x.desiredColumns ? x.desiredColumns.includes(i) : true)).join(x.newDataSeparator));
  return x;
}

let result = pipe(splitLines,
  splitCols,
  splitHeader,
  filterByLength,
  removeSymbols,
  removeFlexedVerbs,
  filterEnglish,
  /* sortByAlphabetical, */
  rejoinData)({
    data: input,
    lineSeparator: '\r\n',
    dataSeparator: '\t',
    newDataSeparator: ';',
    hasHeader: true,
    keepHeader: false,
    wordLength: 5,
    /*   desiredColumns: [0, 1, 9, 10, 14, 15, 17, 19, 24] */
    desiredColumns: [0]
  })
fs.writeFileSync(output, result.data.join('\n'));

//separando um conjunto de palavras
let pool = new Set(result.data);
let db = Array.from(pool);
//embaralhar palavras
for (let i = 0; i < 1000; i++) {
  db = db.sort((a, b) => Math.random() - 0.5)
}
db = db.map(word => {
  let key = word.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); //remove acentos 
  return [key, word];
})

fs.writeFileSync(__dirname + '/words.json', JSON.stringify(Object.fromEntries(db), null, ' '));