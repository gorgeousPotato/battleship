/*----- constants -----*/
const TURN = {
  1: "user",
  "-1": "comp",
};

const CONDITION = {
  0: "", //empty
  s: "⚓️", //ship
  i: "💣", //injured
  k: "🔥", //killed
  m: "✖️", //miss
};

const SHIP = {
  cr: {
    name: "carrier",
    cells: 5,
    quantity: 1,
  },
  bt: {
    name: "battleship",
    cells: 4,
    quantity: 2,
  },
  sb: {
    name: "submarine",
    cells: 3,
    quantity: 3,
  },
  pt: {
    name: "patrol boat",
    cells: 2,
    quantity: 4,
  },
};

/*----- state variables -----*/
let boardUser, boardComp, game, turn, winner, score;

/*----- cached elements  -----*/
const messageEl = document.getElementById("turn");
const scoreEl = document.getElementById("score");

/*----- event listeners -----*/

/*----- functions -----*/
init();

function init() {
  boardUser = [
    [0, "k", 0, 0, 0, 0, "m", 0, 0, 0],
    [0, "k", 0, 0, 0, 0, 0, 0, 0, 0],
    [0, "k", 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, "s", 0, 0, 0, 0, 0, 0],
    [0, 0, 0, "s", 0, 0, 0, "m", 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, "i", 0, 0, 0],
    [0, 0, "m", 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  boardComp = [
    [0, "k", 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, "i", 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, "m", 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  score = {
    u: 0,
    c: 0,
  };
  turn = 1;
  winner = null;
  game = false;
  render();
}

function render() {
  renderBoardComp();
  renderBoardUser();
  renderMessage();
  renderScore();
}

function renderBoardComp() {
  boardComp.forEach((rowArr, rowIdx) => {
    rowArr.forEach((cell, colIdx) => {
      const cellId = `cc${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.innerHTML = CONDITION[cell];
    });
  });
}

function renderBoardUser() {
  boardUser.forEach((rowArr, rowIdx) => {
    rowArr.forEach((cell, colIdx) => {
      const cellId = `uc${colIdx}r${rowIdx}`;
      const cellEl = document.getElementById(cellId);
      cellEl.innerHTML = CONDITION[cell];
    });
  });
}

function renderMessage() {
  //if game has begun (game === 1), turn is rendered
  if (game) {
    messageEl.innerHTML = `${turn === 1 ? "Your" : "Computer's"} turn`;
    //if game hasn't begun, the instruction on how to place ships is rendered
  } else {
    messageEl.innerHTML = `Click ${SHIP["cr"].cells} cells to place your ${SHIP["cr"].name}`;
  }
}

function renderScore() {
  scoreEl.innerHTML = `${score["u"]}   :   ${score["c"]}`;
}
