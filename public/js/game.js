let Game = {
  tries: 0,
  word: 'not so fast, cheater',
  maxTries: 6
}

const createGame = (rows) => {
  let gameArea = document.createElement('div');
  gameArea.classList.add('gameArea');
  for (let i = 0; i < rows; i++) {
    let line = createLine('');
    if (i == 0) line.classList.add('current');
    gameArea.appendChild(line);
  }
  return gameArea;
}

const createLine = (word) => {
  word = word.toUpperCase();
  let line = document.createElement('div');
  line.classList.add('line');
  for (let i = 0; i < 5; i++) {
    let letter = document.createElement('div');
    letter.classList.add('letter')
    letter.innerHTML = word[i] || '';
    line.appendChild(letter);
  }
  return line;
}

const getCurrentLine = () => {
  return document.querySelector(`.gameArea > .line:nth-of-type(${Game.tries + 1})`);
}

const getGuess = () => {
  let line = getCurrentLine();
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
  let data = word.split('').reduce((acc, letter, i) => {
    if (acc.hasOwnProperty(letter)) {
      acc[letter].push(i);

    } else {
      acc[letter] = [i];
    }
    return acc;
  }, {})

  return fetch('./check', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
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
  let currentLine = document.querySelector(`.gameArea > .line:nth-of-type(${Game.tries + 1})`);
  //pega a coluna atual, a última com algo escrito (-1 (vazio) a 4 (cheio))
  let currentColumn = Array.from(currentLine.childNodes).reduce((acc, node, index) => {
    return node.textContent !== '' ? index : acc;
  }, -1);
  //se for uma letra que não backspace e enter
  if (key.length === 1) {
    //não faz nada se não tiver mais espaço para digitar
    if (currentColumn === 4) return;
    // coloca a letra clicada no espaço livre seguinte 
    currentLine.childNodes[currentColumn + 1].textContent = key.toUpperCase();
  }
  //se for backspace
  else if (key === 'backspace') {
    //se tiver uma letra no espaço, apaga ela
    if (currentColumn > -1) {
      currentLine.childNodes[currentColumn].textContent = '';
    }
  }
  //se for enter
  else if (key === 'enter') {
    //só faz algo se toda a linha estiver preenchida
    if (currentColumn === 4) {
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
          .then(answer => {
            Array.from(getCurrentLine().childNodes).forEach((node, i) => node.classList.add(answer[i.toString()]))
            let nextLine = getCurrentLine().nextSibling;
            getCurrentLine().classList.remove('current');
            if (Game.tries >= Game.maxTries) return
            Game.tries++;
            nextLine?.classList.add('current');
          })
      }
    }
  }
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