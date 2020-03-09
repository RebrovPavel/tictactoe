let element;
let crossTurn = true;
let turns = [];
let redo = [];

function checkRow(cells) {
  let cur = 0;
  let row = 0;
  while (cur < cells.length) {
    if (cells[cur].matches('.ch')) {
      row += 1;
    }
    cur += 1;
  }
  if (row === 3) {
    return 'Crosses';
  }

  cur = 0;
  row = 0;
  while (cur < cells.length) {
    if (cells[cur].matches('.r')) {
      row += 1;
    }
    if (row === 3) {
      return 'Toes';
    }
    cur += 1;
  }

  return false;
}

function checkWinner() {
  // check win horizontal
  element = [...document.body.querySelectorAll('.row')];
  while (element[0]) {
    const children = [...element.pop().children];
    if (checkRow(children)) {
      children.forEach(e => e.classList.add('win', 'horizontal'));
      return checkRow(children);
    }
  }
  // check win vertical
  const size = document.body.querySelector('.row').childElementCount;
  element = [...document.body.querySelectorAll('.cell')];
  for (let cur = 0; cur < size; cur += 1) {
    const children = element.filter((_e, i) => (i - cur) % size === 0);
    if (checkRow(children)) {
      children.forEach(e => e.classList.add('win', 'vertical'));
      return checkRow(children);
    }
  }
  // check win diagonal-right
  element = [...document.body.querySelectorAll('.cell')];
  let children = element.filter((_e, i) => i % (size + 1) === 0);
  if (checkRow(children)) {
    children.forEach(e => e.classList.add('win', 'diagonal-right'));
    return checkRow(children);
  }
  // check win diagonal-left
  children = element.filter((_e, i) => i % (size - 1) === 0 && i > 0 && i < size * size - 1);
  if (checkRow(children)) {
    children.forEach(e => e.classList.add('win', 'diagonal-left'));
    return checkRow(children);
  }
  // check draw
  if (element.every(e => e.matches('.ch') || e.matches('.r'))) {
    return 'Draw';
  }

  return false;
}

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

function isEnd() {
  const winner = checkWinner();
  if (winner === 'Crosses') {
    element = document.body.querySelector('.won-title');
    element.classList.remove('hidden');
    element = document.body.querySelector('.won-message');
    element.innerText = `Crosses won!`;
    turns = [];
    redo = [];
  } else if (winner === 'Toes') {
    element = document.body.querySelector('.won-title');
    element.classList.remove('hidden');
    element = document.body.querySelector('.won-message');
    element.innerText = `Toes won!`;
    turns = [];
    redo = [];
  } else if (winner === 'Draw') {
    element = document.body.querySelector('.won-title');
    element.classList.remove('hidden');
    element = document.body.querySelector('.won-message');
    element.innerText = `It's a draw!`;
    turns = [];
    redo = [];
  } else {
    return false;
  }

  checkButtons();
  return true;
}

element = document.body.querySelector('.field'); // FIELD click event
element.addEventListener('click', event => {
  const firstAtribute = event.target.classList[0];
  const secontAtribute = event.target.classList[1];
  if (firstAtribute === 'cell' && !secontAtribute) {
    if (crossTurn) {
      event.target.classList.add('ch');
      crossTurn = false;
    } else {
      event.target.classList.add('r');
      crossTurn = true;
    }

    turns.push(event.target);
    redo = [];
    checkButtons();
  }

  isEnd();
});

element = document.body.querySelector('.undo-btn'); // UNDO click event
element.addEventListener('click', () => {
  crossTurn = !crossTurn;
  element = turns.pop();
  element.className = 'cell';
  redo.push(element);
  checkButtons();
});

element = document.body.querySelector('.redo-btn'); // REDO click event
element.addEventListener('click', () => {
  element = redo.pop();
  if (crossTurn) {
    element.classList.add('ch');
  } else {
    element.classList.add('r');
  }

  crossTurn = !crossTurn;
  turns.push(element);
  checkButtons();
});

element = document.body.querySelector('.restart-btn'); // RESTART click event
element.addEventListener('click', () => {
  element = [...document.body.querySelectorAll('.cell')];
  element.forEach(e =>
    e.classList.remove('win', 'ch', 'r', 'vertical', 'horizontal', 'diagonal-right', 'diagonal-left')
  );
  element = document.body.querySelector('.won-title');
  element.classList.add('hidden');
});
