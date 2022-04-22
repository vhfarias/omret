let Game = {
  tries: 1,
  word: 'not so fast, cheater',
  wordLength: 5,
  maxTries: 6
}

const createGame = () => {
  let gameArea = document.createElement('div');
  gameArea.classList.add('gameArea');
  for (let i = 0; i < Game.maxTries; i++) {
    let row = createRow('');
    if (i == 0) row.classList.add('current');
    gameArea.appendChild(row);
  }
  return gameArea;
}

const createRow = (word) => {
  word = word.toUpperCase();
  let line = document.createElement('div');
  line.classList.add('line');
  for (let i = 0; i < Game.wordLength; i++) {
    let letter = document.createElement('div');
    letter.classList.add('letter')
    letter.innerHTML = word[i] || '';
    line.appendChild(letter);
  }
  return line;
}

const getCurrentRow = () => {
  return document.querySelector(`.gameArea > .line:nth-of-type(${Game.tries})`);
}

const getGuess = () => {
  let line = getCurrentRow();
  let word = Array.from(line.childNodes).reduce((acc, node) => {
    return acc + node.textContent;
  }, "")
  return word;
}

const checkWord = (word) => {
  //TODO: comparar com um dicionário para palavras válidas
  return true;
}

const sendGuess = (word) => {
  return fetch('./check', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ guess: word, tries: Game.tries })
  })
}

const makeKb = () => {
  let keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'];
  let kb = document.createElement('div');
  kb.classList.add('keyboard');
  kb.addEventListener('click', kbClickHandler);
  window.addEventListener('keydown', kbTypeHandler);
  for (k of keys) {
    let el = document.createElement('button');
    el.id = `kb_${k}`;
    if (k !== 'backspace' && k !== 'enter') {
      el.innerHTML = k.toUpperCase();
    }
    kb.appendChild(el);
  }
  document.body.insertBefore(kb, document.querySelector('body>script:first-of-type'));
}

const keyboardHandler = (key) => {
  //pega a linha atual
  let currentRow = getCurrentRow();
  //pega a coluna atual, a última com algo escrito (-1 (vazio) a 4 (cheio))
  let currentColumn = Array.from(currentRow.childNodes).reduce((acc, node, index) => {
    return node.textContent !== '' ? index : acc;
  }, -1);
  //se for uma letra que não backspace e enter
  if (key.length === 1) {
    //não faz nada se não tiver mais espaço para digitar
    if (currentColumn === Game.wordLength - 1) return;
    // coloca a letra clicada no espaço livre seguinte 
    currentRow.childNodes[currentColumn + 1].textContent = key.toUpperCase();
  }
  //se for backspace
  else if (key === 'backspace') {
    //se tiver uma letra no espaço, apaga ela
    if (currentColumn > -1) {
      currentRow.childNodes[currentColumn].textContent = '';
    }
  }
  //se for enter
  else if (key === 'enter') {
    //só faz algo se toda a linha estiver preenchida
    if (currentColumn === Game.wordLength - 1) {
      let word = getGuess();
      //checa se pode enviar a tentativa para verificação
      if (!checkWord(word)) {
        console.log('a palavra não é válida');
      }
      else {
        sendGuess(word.toLowerCase())
          .then(res => res.body.getReader().read())
          .then(({ value, done }) => {
            return Promise.resolve(JSON.parse(new TextDecoder("utf-8").decode(value)))
          })
          .then(res => {
            let answers = res['answer'];
            //pega a fileira atual
            let currentRow = getCurrentRow();
            //atualiza a fileira com as cores dorrespondentes a tentativa
            Array.from(currentRow.childNodes).forEach((node, i) => node.classList.add(answers[i]))
            //atualiza o teclado
            updateKb(currentRow);
            currentRow.classList.remove('current');

            //checar fim de jogo
            //vitória
            if (Object.values(answers).every(answer => answer === 'right')) {
              //mostra mensagem de vitória
              let keywordDiv = document.querySelector('.warn');
              let messages = ['Tá de hack!', 'Você é vidente?', 'Mandou muito!', 'Show!', 'Parabéns!', 'Ufa...'];
              keywordDiv.innerText = messages[Game.tries - 1];
              keywordDiv.classList.remove('hidden');
              return;
            }
            //derrota
            else if (Game.tries === Game.maxTries) {
              //mostra a palavra nos avisos
              console.log('last try: ' + Game.tries)
              let keywordDiv = document.querySelector('.warn');
              keywordDiv.innerText = `A palavra é ${res.solution.toUpperCase()}`
              keywordDiv.classList.remove('hidden');
              return;
            }
            //segue o jogo
            else {
              let nextLine = currentRow.nextSibling;
              nextLine?.classList.add('current');
              Game.tries++;
            }
          })
      }
    }
  }
}

const updateKb = (row) => {
  row.childNodes.forEach(element => {
    let letter = element.textContent.toLowerCase();
    let kbKey = document.querySelector(`#kb_${letter}`);
    if (element.classList.contains('right')) {
      if (!kbKey.classList.contains('right')) {
        kbKey.classList.remove('wrong');
        kbKey.classList.remove('misplaced');
        kbKey.classList.add('right');
      }
    }
    else if (element.classList.contains('misplaced') && !kbKey.classList.contains('right')) {
      if (!kbKey.classList.contains('misplaced')) {
        kbKey.classList.remove('wrong');
        kbKey.classList.add('misplaced');
      }
    }
    else if (element.classList.contains('wrong') && !kbKey.classList.contains('right') && !kbKey.classList.contains('misplaced')) {
      if (!kbKey.classList.contains('wrong')) {
        kbKey.classList.add('wrong');
      }
    }
  })
}

const kbClickHandler = (e) => {
  //retorna se clicar fora das letras
  if (e.target.nodeName === 'DIV') return
  //letra apertada no teclado virtual
  let key = e.target.id.split('_')[1];
  keyboardHandler(key);
}

const kbTypeHandler = (e) => {
  let keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'backspace', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'enter'];
  //pega o código da letra pressionada
  let pressed = e.key.toLowerCase();
  //filtra as letras válidas e chama o handler
  if (keys.indexOf(pressed) != -1) keyboardHandler(pressed);
}

makeKb();
document.querySelector('main').appendChild(createGame(6))