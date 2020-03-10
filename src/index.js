let element;
let crossTurn = true;
let turns = [];
let redo = [];

function checkButtons() {
  element = document.body.querySelector('.undo-btn'); // check UNDO
  if (turns.length === 0) {
    element.disabled = true;
  } else {
    element.disabled = false;
  }
  element = document.body.querySelector('.redo-btn'); // check REDO
  if (redo.length === 0) {
    element.disabled = true;
  } else {
    element.disabled = false;
  }
}

function drawField(target) {
  if (crossTurn) {
    target.classList.add('ch');
    crossTurn = false;
  } else {
    target.classList.add('r');
    crossTurn = true;
  }
}

function loadStorage() {
  if (localStorage.getItem('turns') != null) {
    turns = JSON.parse(localStorage.getItem('turns'));
    turns.forEach(e => drawField(document.getElementById(e)));
  }
  if (localStorage.getItem('redo') != null) {
    redo = JSON.parse(localStorage.getItem('redo'));
  }
  checkButtons();
}

loadStorage();

function checkRow(cells, winType = false) {
  let row = 0;
  for (let cur = 0; cur < cells.length; cur += 1) {
    if (cells[cur].matches('.ch')) {
      row += 1;
    } else {
      row = 0;
    }
    if (row === 3) {
      if (winType !== false) {
        // add win class to cells
        cells.filter((_e, i) => i <= cur && i >= cur - 2).forEach(e => e.classList.add('win', winType));
      }
      return 'Crosses';
    }
  }

  row = 0;
  for (let cur = 0; cur < cells.length; cur += 1) {
    if (cells[cur].matches('.r')) {
      row += 1;
    } else {
      row = 0;
    }
    if (row === 3) {
      if (winType !== false) {
        // add win class to cells
        cells.filter((_e, i) => i <= cur && i >= cur - 2).forEach(e => e.classList.add('win', winType));
      }
      return 'Toes';
    }
  }

  return false;
}

function checkWinner() {
  // check win horizontal
  element = [...document.body.querySelectorAll('.row')];
  while (element[0]) {
    const children = [...element.pop().children];
    if (checkRow(children)) {
      return checkRow(children, 'horizontal');
    }
  }
  // check win vertical
  const size = document.body.querySelector('.row').childElementCount;
  element = [...document.body.querySelectorAll('.cell')];
  for (let cur = 0; cur < size; cur += 1) {
    const children = element.filter((_e, i) => (i - cur) % size === 0);
    if (checkRow(children)) {
      return checkRow(children, 'vertical');
    }
  }
  // check win diagonal-right
  element = [...document.body.querySelectorAll('.cell')];
  let children = element.filter((_e, i) => i % (size + 1) === 0);
  if (checkRow(children)) {
    return checkRow(children, 'diagonal-right');
  }
  // check win diagonal-left
  children = element.filter((_e, i) => i % (size - 1) === 0 && i > 0 && i < size * size - 1);
  if (checkRow(children)) {
    return checkRow(children, 'diagonal-left');
  }
  // check draw
  if (element.every(e => e.matches('.ch') || e.matches('.r'))) {
    return 'Draw';
  }

  return false;
}

function isEnd() {
  const winner = checkWinner();
  if (winner !== false) {
    element = document.body.querySelector('.won-title');
    element.classList.remove('hidden');
    element = document.body.querySelector('.won-message');
    if (winner === 'Crosses') {
      element.innerText = `Crosses won!`;
    } else if (winner === 'Toes') {
      element.innerText = `Toes won!`;
    } else if (winner === 'Draw') {
      element.innerText = `It's a draw!`;
    }
  } else {
    element = document.body.querySelector('.won-title');
    if (!element.matches('.hidden')) {
      element.classList.add('hidden');
      element.innerText = '';
      [...document.body.querySelectorAll('.cell')].forEach(e =>
        e.classList.remove('win', 'vertical', 'horizontal', 'diagonal-right', 'diagonal-left')
      );
    }
    return false;
  }

  return true;
}

isEnd();

function gameUpdate() {
  localStorage.setItem('turns', JSON.stringify(turns));
  localStorage.setItem('redo', JSON.stringify(redo));
  checkButtons();
}

element = document.body.querySelector('.field'); // FIELD click event
element.addEventListener('click', event => {
  const firstAtribute = event.target.classList[0];
  const secondAtribute = event.target.classList[1];
  if (firstAtribute === 'cell' && !secondAtribute) {
    drawField(event.target);
    turns.push(event.target.id);
    redo = [];
    gameUpdate();
    isEnd();
  }
});

element = document.body.querySelector('.undo-btn'); // UNDO click event
element.addEventListener('click', () => {
  crossTurn = !crossTurn;
  const elementID = turns.pop();
  document.getElementById(elementID).className = 'cell';
  redo.push(elementID);
  gameUpdate();
  isEnd();
});

element = document.body.querySelector('.redo-btn'); // REDO click event
element.addEventListener('click', () => {
  const elementID = redo.pop();
  drawField(document.getElementById(elementID));
  crossTurn = !crossTurn;
  turns.push(elementID);
  gameUpdate();
  isEnd();
});

function clearField() {
  crossTurn = true;
  turns = [];
  redo = [];
  [...document.body.querySelectorAll('.cell')].forEach(e =>
    e.classList.remove('ch', 'r', 'win', 'vertical', 'horizontal', 'diagonal-right', 'diagonal-left')
  );
}

element = document.body.querySelector('.restart-btn'); // RESTART click event
element.addEventListener('click', () => {
  clearField();
  document.body.querySelector('.won-title').classList.add('hidden');
  gameUpdate();
});

window.addEventListener('storage', () => {
  clearField();
  loadStorage();
  isEnd();
});
