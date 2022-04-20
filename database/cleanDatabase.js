let prompt = require('prompt-sync')();
let { readFileSync, writeFileSync } = require('fs');

let input = Array.from(Object.entries(JSON.parse(readFileSync(__dirname + '/words.json'))));

let output = input.filter((el, i, arr) => {
  let filter = prompt(`(${i + 1}/${arr.length}) Manter ${el[1]}? (y/n): `)
  return filter.toLowerCase() === 'y'
})

writeFileSync(__dirname + '/words.json', JSON.stringify(Object.fromEntries(output), null, ' '));