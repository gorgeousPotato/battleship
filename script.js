/*----- constants -----*/
const TURN = {
  1: "user",
  "-1": "comp",
};

const CONDITION = {
  0: "", //empty
  s: "⚪️", //ship
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
let boardUser, boardComp;
let game; //is true when the user and the computer make guesses, is wrong when they are placing ships
let turn; // 1 for user, -1 for computer
let winner;
let score;
let currShip; //represents which ship is being placed, maybe will delete this

/*----- cached elements  -----*/
const messageEl = document.getElementById("turn");
const scoreEl = document.getElementById("score");
const boardsEl = document.getElementById("boards"); //maybe delete either this or the next 2 lines, will decide later
const boardUserEl = document.querySelector(".board-user");
const boardCompEl = document.querySelector(".comp-user");

/*----- event listeners -----*/
// boardUserEl.addEventListener("click", handleUserPlacement);
/*----- functions -----*/
init();

function init() {
  boardUser = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  boardComp = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  score = {
    u: 0,
    c: 0,
  };

  turn = 1;
  winner = null;
  currShip = "cr";
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
    messageEl.innerHTML = `Click a ship to place it ⬇️`;
  }
}

function renderScore() {
  scoreEl.innerHTML = `${score["u"]}   :   ${score["c"]}`;
}

function handleUserPlacement(evt) {
  if (game) return;
  console.log("hi");
  const cellId = evt.target.id;
  const cellIdx = getIdx(cellId);
  const rowArr = boardUser[cellIdx[1]];
  const colIdx = cellIdx[0];
  rowArr[colIdx] = "s";
  render();
}

//helper function

const getIdx = function (id) {
  const idxArr = id.split("");
  return [parseInt(idxArr[2]), parseInt(idxArr[4])];
};

function gameProcess() {
  for (const property in SHIP) {
    currShip = property;
    for (let n = 0; n < SHIP[property].quantity; n++) {
      for (let i = 0; i < SHIP[property].cells; i++) {
        console.log(i);
        boardUserEl.addEventListener("click", handleUserPlacement);
      }
    }
  }
}

gameProcess();
