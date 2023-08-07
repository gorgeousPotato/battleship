/*----- constants -----*/
// const TURN = {
//   1: "user",
//   "-1": "comp",
// };

const CONDITION = {
  0: "", //empty
  s: "⚪️", //user's ship
  sc: "▫️", //computer's ship
  i: "💣", //injured
  k: "🔥", //killed
  m: "✖️", //miss
};

// const SHIPS = {
//   cr: {
//     name: "carrier",
//     cells: 5,
//     quantity: 1,
//   },
//   bt: {
//     name: "battleship",
//     cells: 4,
//     quantity: 2,
//   },
//   sb: {
//     name: "submarine",
//     cells: 3,
//     quantity: 3,
//   },
//   pt: {
//     name: "patrol boat",
//     cells: 2,
//     quantity: 4,
//   },
// };

/*----- state variables -----*/
let boardUser, boardComp;
let game; //is true when the user and the computer make guesses, is wrong when they are placing ships
let turn; // true for user, false for computer
let winner;
let score;
let currShip; //represents which ship is being placed, maybe will delete this
let shipLength; //represents the length of a ship being placed currently
let shipIsRotated; //represents if a user's ship is rotated
let shipIsPlaced;
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
shipEls.forEach((ship) => {
  addEventListener("click", handleRotate);
});

startGameBtn.addEventListener("click", handleGameStart);

boardCompEl.addEventListener("click", handleUserShoot);

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

  turn = true;
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
  //if game has begun (game === true), turn is rendered
  if (game) {
    messageEl.innerText = `${turn === true ? "Your" : "Computer's"} turn`;

    //if game hasn't begun, the instruction on how to place ships is rendered
  } else {
    messageEl.innerHTML = `Drag a ship to place it, click to rotate ⬇️`;
    messageEl.style.textAlign = "right";
  }
}

function renderScore() {
  scoreEl.innerHTML = `You:  ${score["u"]} \u00A0\u00A0\u00A0\u00A0 Computer:  ${score["c"]}`;
}

//user's ship placement function

function handleShipPlacement(cellId, length) {
  //changes  cells in the model
  const cellIdx = getIdx(cellId);
  let rowIdx = cellIdx[1];
  let colIdx = cellIdx[0];
  if (
    boardUser[rowIdx][colIdx] === 0 &&
    (rowIdx === 0 || boardUser[rowIdx - 1][colIdx] === 0) &&
    (rowIdx === 9 || boardUser[rowIdx + 1][colIdx] === 0) &&
    (colIdx === 0 || boardUser[rowIdx][colIdx - 1] === 0) &&
    (colIdx === 9 || boardUser[rowIdx][colIdx + 1] === 0)
  ) {
    let currCells = [cellIdx];
    for (let i = 1; i < length; i++) {
      if (shipIsRotated === true) {
        rowIdx = rowIdx + 1;
        if (
          rowIdx >= 0 &&
          rowIdx <= 9 &&
          boardUser[rowIdx][colIdx] === 0 &&
          (rowIdx === 9 || boardUser[rowIdx + 1][colIdx] === 0) &&
          (colIdx === 0 || boardUser[rowIdx][colIdx - 1] === 0) &&
          (colIdx === 9 || boardUser[rowIdx][colIdx + 1] === 0)
        ) {
          currCells.push([colIdx, rowIdx]);
        } else return (shipIsPlaced = false);
      } else {
        colIdx = colIdx + 1;
        if (
          colIdx >= 0 &&
          colIdx <= 9 &&
          boardComp[rowIdx][colIdx] === 0 &&
          (rowIdx === 0 || boardUser[rowIdx - 1][colIdx] === 0) &&
          (rowIdx === 9 || boardUser[rowIdx + 1][colIdx] === 0) &&
          (colIdx === 9 || boardUser[rowIdx][colIdx + 1] === 0)
        ) {
          currCells.push([colIdx, rowIdx]);
        } else return (shipIsPlaced = false);
      }
    }
    currCells.forEach((cell) => {
      let row = boardUser[cell[1]];
      let col = cell[0];
      row[col] = "s";
    });
    shipIsPlaced = true;
    render();
  } else shipIsPlaced = false;
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
  dragged = evt.target;
  evt.target.style.opacity = "0.4";

  const classListArr = [...evt.target.classList];
  shipLength = classListArr[0];
  if (classListArr.includes("rotated")) shipIsRotated = true;
  else shipIsRotated = false;
  if (shipIsRotated === true) {
    const img = new Image();
    img.src = `images/rotated/rotated-${shipLength}.png`;
    evt.dataTransfer.setDragImage(img, 10, 10);
  }
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
    handleShipPlacement(evt.target.id, shipLength);
    if (shipIsPlaced === true) {
      dragged.parentNode.removeChild(dragged);
      dragged.opacity = "";
    }
    if (checkShips(boardUser) === 30) startGameBtn.classList.remove("hidden");
    // return false;
  }
}

//function for rotating

function handleRotate(evt) {
  console.log(evt);
  if (evt.target.nodeName !== "IMG") return;
  evt.target.classList.toggle("rotated");
}

//starting game

function handleGameStart() {
  game = true;
  computerShipPlacement();
  document.getElementById("ships-to-drag-container").classList.add("hidden");
  document.getElementById("board-comp-container").classList.remove("hidden");
  startGameBtn.classList.add("hidden");
  scoreEl.classList.remove("hidden");
  // messageEl.innerHTML = "Your turn!";
  messageEl.style.textAlign = "center";
  render();
}

//helper function placing a ship to a random cell
function randomCellIdx() {
  const randomCellIdx = [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ];
  return randomCellIdx;
}

//helper function randomly choosing direction
function randomDirection() {
  const directions = ["v", "h"]; //v for vertical,h for horizontal
  const randomNum = Math.floor(Math.random() * 2);
  return directions[randomNum];
}

//helper function to handle random placement of a ship

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
  doUntilPlaced(4);
  doUntilPlaced(3);
  doUntilPlaced(3);
  doUntilPlaced(3);
  doUntilPlaced(2);
  doUntilPlaced(2);
  doUntilPlaced(2);
  doUntilPlaced(2);
}

//user's shooting function

function handleUserShoot(evt) {
  const cellIdx = getIdx(evt.target.id);
  let rowIdx = cellIdx[1];
  let colIdx = cellIdx[0];
  if (evt.target.parentElement.id !== "board-comp") return;
  //if a cell is empty
  if (boardComp[rowIdx][colIdx] === 0) {
    boardComp[rowIdx][colIdx] = "m";
    turn = false;
    render();
    setTimeout(computerRandomShoot, 1000);
    return;
    //if a cell is occupied
  } else if (boardComp[rowIdx][colIdx] === "sc") {
    //checking if there are anu other cells of this ship left, if no, the ship is killed, otherwise it's injured
    if (
      (rowIdx === 9 ||
        boardComp[rowIdx + 1][colIdx] === 0 ||
        boardComp[rowIdx + 1][colIdx] === "i" ||
        boardComp[rowIdx + 1][colIdx] === "m") &&
      (rowIdx === 0 ||
        boardComp[rowIdx - 1][colIdx] === 0 ||
        boardComp[rowIdx - 1][colIdx] === "i" ||
        boardComp[rowIdx - 1][colIdx] === "m") &&
      (colIdx === 9 ||
        boardComp[rowIdx][colIdx + 1] === 0 ||
        boardComp[rowIdx][colIdx + 1] === "i" ||
        boardComp[rowIdx][colIdx + 1] === "m") &&
      (colIdx === 0 ||
        boardComp[rowIdx][colIdx - 1] === 0 ||
        boardComp[rowIdx][colIdx - 1] === "i" ||
        boardComp[rowIdx][colIdx - 1] === "m")
    ) {
      boardComp[rowIdx][colIdx] = "k";
      score.u += 1;
      turn = false;
      //variable to check if there are any injured ship cells left
      let shipIsComplete = false;
      while (shipIsComplete !== true) {
        if (rowIdx !== 9 && boardComp[rowIdx + 1][colIdx] === "i") {
          rowIdx += 1;
          boardComp[rowIdx][colIdx] = "k";
        } else if (rowIdx !== 0 && boardComp[rowIdx - 1][colIdx] === "i") {
          rowIdx -= 1;
          boardComp[rowIdx][colIdx] = "k";
        } else if (colIdx !== 9 && boardComp[rowIdx][colIdx + 1] === "i") {
          colIdx += 1;
          boardComp[rowIdx][colIdx] = "k";
        } else if (colIdx !== 0 && boardComp[rowIdx][colIdx - 1] === "i") {
          colIdx -= 1;
          boardComp[rowIdx][colIdx] = "k";
        } else shipIsComplete = true;
      }
    } else {
      boardComp[rowIdx][colIdx] = "i";
      render();
      return;
    }
  }
  setTimeout(computerRandomShoot, 1000);
  render();
}

//computer's shooting function (random for now, AI - later)

function computerRandomShoot() {
  console.log("hi");
  const cellIdx = randomCellIdx();
  let rowIdx = cellIdx[1];
  let colIdx = cellIdx[0];
  //if a cell is empty
  if (boardUser[rowIdx][colIdx] === 0) {
    boardUser[rowIdx][colIdx] = "m";
    turn = true;
    render();
    return;
    //if a cell is occupied
  } else if (boardComp[rowIdx][colIdx] === "s") {
    //checking if there are anu other cells of this ship left, if no, the ship is killed, otherwise it's injured
    if (
      (rowIdx === 9 ||
        boardUser[rowIdx + 1][colIdx] === 0 ||
        boardUser[rowIdx + 1][colIdx] === "i" ||
        boardUser[rowIdx + 1][colIdx] === "m") &&
      (rowIdx === 0 ||
        boardUser[rowIdx - 1][colIdx] === 0 ||
        boardUser[rowIdx - 1][colIdx] === "i" ||
        boardUser[rowIdx - 1][colIdx] === "m") &&
      (colIdx === 9 ||
        boardUser[rowIdx][colIdx + 1] === 0 ||
        boardUser[rowIdx][colIdx + 1] === "i" ||
        boardUser[rowIdx][colIdx + 1] === "m") &&
      (colIdx === 0 ||
        boardUser[rowIdx][colIdx - 1] === 0 ||
        boardUser[rowIdx][colIdx - 1] === "i" ||
        boardUser[rowIdx][colIdx - 1] === "m")
    ) {
      boardUser[rowIdx][colIdx] = "k";
      score.c += 1;
      turn = true;
      //variable to check if there are any injured ship cells left
      let shipIsComplete = false;
      while (shipIsComplete !== true) {
        if (rowIdx !== 9 && boardComp[rowIdx + 1][colIdx] === "i") {
          rowIdx += 1;
          boardUser[rowIdx][colIdx] = "k";
        } else if (rowIdx !== 0 && boardComp[rowIdx - 1][colIdx] === "i") {
          rowIdx -= 1;
          boardUser[rowIdx][colIdx] = "k";
        } else if (colIdx !== 9 && boardComp[rowIdx][colIdx + 1] === "i") {
          colIdx += 1;
          boardUser[rowIdx][colIdx] = "k";
        } else if (colIdx !== 0 && boardComp[rowIdx][colIdx - 1] === "i") {
          colIdx -= 1;
          boardUser[rowIdx][colIdx] = "k";
        } else shipIsComplete = true;
      }
    } else {
      boardUser[rowIdx][colIdx] = "i";
    }
  }
  render();
}
