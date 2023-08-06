/*----- constants -----*/
const TURN = {
  1: "user",
  "-1": "comp",
};

const CONDITION = {
  0: "", //empty
  s: "⚪️", //user's ship
  sc: "▫️", //computer's ship
  i: "💣", //injured
  k: "🔥", //killed
  m: "✖️", //miss
};

const SHIPS = {
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
let shipLength; //represents the length of a ship being placed currently
let dragged; //to store info about a ship currently being dragged

/*----- cached elements  -----*/
const messageEl = document.getElementById("turn");
const scoreEl = document.getElementById("score");
const boardsEl = document.getElementById("board-user-container"); //maybe delete either this or the next 2 lines, will decide later
const boardUserEl = document.querySelector(".board-user");
const boardCompEl = document.querySelector(".board-comp");
const shipEls = document.querySelectorAll("#ships-to-drag img");
const startGameBtn = document.querySelector(".start-game");

/*----- event listeners -----*/
shipEls.forEach((ship) => {
  addEventListener("dragstart", handleDragStart);
  addEventListener("dragover", handleDragOver);
  // addEventListener("dragenter", handleDragEnter);
  // addEventListener("dragleave", handleDragLeave);
  addEventListener("dragend", handleDragEnd);
  addEventListener("drop", handleDrop);
});
startGameBtn.addEventListener("click", handleGameStart);

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
    messageEl.style.textAlign = "right";
  }
}

function renderScore() {
  scoreEl.innerHTML = `${score["u"]}   :   ${score["c"]}`;
}

function handleUserPlacementClick(cell) {
  //changes one cell in the model
  if (game) return;
  const cellId = cell;
  const cellIdx = getIdx(cellId);
  const rowArr = boardUser[cellIdx[1]];
  const colIdx = cellIdx[0];
  rowArr[colIdx] = "s";
  render();
}

function handleShipPlacement(cellId, length) {
  //changes other cells in the model
  const cellIdx = getIdx(cellId);
  const rowArr = boardUser[cellIdx[1]];
  const colIdx = cellIdx[0];
  const currIdx = colIdx;
  for (let i = 1; i < length; i++) {
    if (currIdx + i > 9) {
      rowArr[colIdx - 1] = "s";
    } else {
      rowArr[colIdx + i] = "s";
    }
  }
  render();
}

//helper function

const getIdx = function (id) {
  const idxArr = id.split("");
  return [parseInt(idxArr[2]), parseInt(idxArr[4])];
};

//helper function to check how many ships are on a board
function checkShips(board) {
  let count = 0;
  board.forEach((row) => {
    count += row.filter((c) => c === "s").length;
  });
  return count;
}

//functions for dragging and dropping

function handleDragStart(evt) {
  console.log(evt);
  dragged = evt.target;
  evt.target.style.opacity = "0.4";
  shipLength = evt.target.className;
}

function handleDragEnd(evt) {
  evt.target.style.opacity = ""; //will correct this later
  dragged = null;
}

function handleDragOver(evt) {
  evt.preventDefault();
  return false;
}

function handleDrop(evt) {
  evt.stopPropagation();
  if (evt.target.parentElement.id === "board-user") {
    dragged.parentNode.removeChild(dragged);
    dragged.opacity = "";
    handleUserPlacementClick(evt.target.id);
    handleShipPlacement(evt.target.id, shipLength);
    if (checkShips(boardUser) === 30) startGameBtn.classList.remove("hidden");
    // return false;
  }
}

//starting game

function handleGameStart() {
  let game = true;
  computerShipPlacement();
  document.getElementById("ships-to-drag-container").classList.add("hidden");
  document.getElementById("board-comp-container").classList.remove("hidden");
  startGameBtn.classList.add("hidden");
  scoreEl.classList.remove("hidden");
  messageEl.innerHTML = "Your turn!";
  messageEl.style.textAlign = "center";
}

//helper function placing a ship to a random cell
function randomCellIdx() {
  const randomCellIdx = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return randomCellIdx;
}

//helper function ramdomly choosing direction
function randomDirection() {
  const directions = ["v", "h"]; //v for vertical,h for horizontal
  const randomNum = Math.floor(Math.random() * 2);
  return directions[randomNum];
}

//helper function to handle random placement of a ship

// function randomShipPlacement(length) {
//   randomCellIdx();
//   const randomCell = randomCellIdx();
//   // let rowArr = boardComp[randomCell[1]];
//   let rowIdx = randomCell[1];
//   let colIdx = randomCell[0];
//   console.log(randomCell);
//   console.log(boardComp[rowIdx - 1][colIdx]);
//   if (
//     boardComp[rowIdx][colIdx] !== 0 ||
//     boardComp[rowIdx + 1][colIdx] !== 0 ||
//     boardComp[rowIdx - 1][colIdx] !== 0 ||
//     boardComp[rowIdx][colIdx + 1] !== 0 ||
//     boardComp[rowIdx][colIdx - 1] !== 0
//   )
//     return false;

//   let currCells = [randomCell];
//   const randomDir = randomDirection();
//   for (let i = 1; i < length; i++) {
//     if (randomDir === "v") {
//       rowIdx = rowIdx + 1;
//       if (
//         boardComp[rowIdx][colIdx] !== 0 ||
//         boardComp[rowIdx][colIdx + 1] !== 0 ||
//         boardComp[rowIdx][colIdx - 1] !== 0 ||
//         boardComp[rowIdx + 1][colIdx] !== 0
//       )
//         return false;
//       currCells.push([colIdx, rowIdx]);
//     }
//     if (randomDir === "h") {
//       colIdx = colIdx + 1;
//       if (
//         boardComp[rowIdx][colIdx] !== 0 ||
//         boardComp[rowIdx + 1][colIdx] !== 0 ||
//         boardComp[rowIdx - 1][colIdx] !== 0 ||
//         boardComp[rowIdx][colIdx + 1] !== 0
//       )
//         return false;
//       currCells.push([colIdx, rowIdx]);
//     }
//   }
//   currCells.forEach((cell) => {
//     let row = boardComp[cell[1]];
//     let col = cell[0];
//     row[col] = "sc";
//   });
//   render();
//   return true;
// }

function randomShipPlacement(length) {
  randomCellIdx();
  const randomCell = randomCellIdx();
  // let rowArr = boardComp[randomCell[1]];
  let rowIdx = randomCell[1];
  let colIdx = randomCell[0];
  if (
    boardComp[rowIdx][colIdx] === 0 &&
    (rowIdx === 0 || boardComp[rowIdx - 1][colIdx] === 0) &&
    (rowIdx === 9 || boardComp[rowIdx + 1][colIdx] === 0) &&
    (colIdx === 0 || boardComp[rowIdx][colIdx - 1] === 0) &&
    (colIdx === 9 || boardComp[rowIdx][colIdx + 1] === 0)
  ) {
    let currCells = [randomCell];
    const randomDir = randomDirection();
    for (let i = 1; i < length; i++) {
      if (randomDir === "v") {
        rowIdx = rowIdx + 1;
        if (
          rowIdx >= 0 &&
          rowIdx <= 9 &&
          boardComp[rowIdx][colIdx] === 0 &&
          (rowIdx === 9 || boardComp[rowIdx + 1][colIdx] === 0) &&
          (colIdx === 0 || boardComp[rowIdx][colIdx - 1] === 0) &&
          (colIdx === 9 || boardComp[rowIdx][colIdx + 1] === 0)
        ) {
          currCells.push([colIdx, rowIdx]);
        } else return false;
      }
      if (randomDir === "h") {
        colIdx = colIdx + 1;
        if (
          colIdx >= 0 &&
          colIdx <= 9 &&
          boardComp[rowIdx][colIdx] === 0 &&
          (rowIdx === 0 || boardComp[rowIdx - 1][colIdx] === 0) &&
          (rowIdx === 9 || boardComp[rowIdx + 1][colIdx] === 0) &&
          (colIdx === 9 || boardComp[rowIdx][colIdx + 1] === 0)
        ) {
          currCells.push([colIdx, rowIdx]);
        } else return false;
      }
    }
    currCells.forEach((cell) => {
      let row = boardComp[cell[1]];
      let col = cell[0];
      row[col] = "sc";
    });
    render();
    return true;
  } else return false;
}

//helper function to handle a random placement of a ship until it's actually placed
function doUntilPlaced(length) {
  let ship;
  do {
    ship = randomShipPlacement(length);
  } while (ship !== true);
}

function computerShipPlacement() {
  doUntilPlaced(5);
  doUntilPlaced(4);
  doUntilPlaced(3);
  doUntilPlaced(3);
  doUntilPlaced(2);
  doUntilPlaced(2);
  doUntilPlaced(2);
  doUntilPlaced(1);
  doUntilPlaced(1);
  doUntilPlaced(1);
}
