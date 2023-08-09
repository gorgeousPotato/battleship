const CONDITION = {
  0: "", //empty
  s: "⚪️", //user's ship
  sc: "", //computer's ship
  i: "💣", //injured
  k: "🔥", //killed
  m: "✖️", //miss
};

/*----- state variables -----*/
let boardUser, boardComp;
let game; //is true when the user and the computer make guesses, is wrong when they are placing ships
let turn; // true for user, false for computer
let winner;
let score;
let currShip; //represents which ship is being placed
let shipLength; //represents the length of a ship being placed currently
let shipIsRotated; //represents if a user's ship is rotated
let shipIsPlaced;
let dragged; //to store info about a ship currently being dragged
let targets = null;
let firstRowIdx; //to store the first injured cell's row idx
let firstColIdx; //to store the first injured cell's col idx

/*----- cached elements  -----*/
const messageEl = document.getElementById("turn");
const scoreEl = document.getElementById("score");
const boardsEl = document.getElementById("board-user-container"); //maybe delete either this or the next 2 lines, will decide later
const boardUserEl = document.querySelector(".board-user");
const boardCompEl = document.querySelector(".board-comp");
const shipEls = document.querySelectorAll("#ships-to-drag img");
const shipsEl = document.getElementById("ships-to-drag");
const startGameBtn = document.getElementById("start-game");
const startAgainBtn = document.getElementById("start-again");

/*----- event listeners -----*/

shipsEl.addEventListener("dragstart", handleDragStart);
shipsEl.addEventListener("click", handleRotate);
shipsEl.addEventListener("dragend", handleDragEnd);
boardUserEl.addEventListener("dragover", handleDragOver);
boardUserEl.addEventListener("drop", handleDrop);
startGameBtn.addEventListener("click", handleGameStart);
boardCompEl.addEventListener("click", handleUserShoot);
startAgainBtn.addEventListener("click", initAfterGame);

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
  } else if (winner) {
    messageEl.innerHTML = `${winner} won!`;
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
  evt.target.style.opacity = "";
  dragged = null;
}

function handleDragOver(evt) {
  evt.preventDefault();
  return false;
}

function handleDrop(evt) {
  // evt.stopPropagation();
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
  if (!game) return;
  if (!turn) return;
  const cellIdx = getIdx(evt.target.id);
  let rowIdx = cellIdx[1];
  let colIdx = cellIdx[0];
  if (evt.target.parentElement.id !== "board-comp") return;
  //if a cell is empty
  if (boardComp[rowIdx][colIdx] === 0) {
    boardComp[rowIdx][colIdx] = "m";
    turn = false;
    render();
    setTimeout(computerShoot, 1000);
    return;
    //if a cell is occupied
  } else if (boardComp[rowIdx][colIdx] === "sc") {
    boardComp[rowIdx][colIdx] = "i";
    render();
    //checking on which direction injured cells are left, if any
    let direction;
    if (rowIdx !== 9 && boardComp[rowIdx + 1][colIdx] === "i") {
      direction = "v";
    } else if (rowIdx !== 0 && boardComp[rowIdx - 1][colIdx] === "i") {
      direction = "v";
    } else if (colIdx !== 9 && boardComp[rowIdx][colIdx + 1] === "i") {
      direction = "h";
    } else if (colIdx !== 0 && boardComp[rowIdx][colIdx - 1] === "i") {
      direction = "h";
    } else {
      render();
      return;
    }
    let initialRowIdx = rowIdx;
    let initialColIdx = colIdx;
    let isKilled = false;
    let injuredShipCells = [[rowIdx, colIdx]];
    //checking if both sides of both directions contain injured cells
    if (direction === "v") {
      let shipIsComplete = false;

      while (shipIsComplete !== true) {
        if (rowIdx !== 9 && boardComp[rowIdx + 1][colIdx] === "i") {
          rowIdx += 1;
          injuredShipCells.push([rowIdx, colIdx]);
        } else {
          shipIsComplete = true;
        }
      }
      rowIdx = initialRowIdx;
      shipIsComplete = false;
      while (shipIsComplete !== true) {
        if (rowIdx !== 0 && boardComp[rowIdx - 1][colIdx] === "i") {
          rowIdx -= 1;
          injuredShipCells.push([rowIdx, colIdx]);
        } else {
          shipIsComplete = true;
        }
      }
      isKilled = false;
      injuredShipCells.forEach((cell) => {
        if (cell[0] !== 9 && boardComp[cell[0] + 1][cell[1]] === "sc") {
          isKilled = true;
        }
        if (cell[0] !== 0 && boardComp[cell[0] - 1][cell[1]] === "sc") {
          isKilled = true;
        }
      });
    } else if (direction === "h") {
      //these two variables store the information if there's any injures cells left and if there's any ship cells left
      let shipIsComplete = false;

      while (shipIsComplete !== true) {
        if (colIdx !== 9 && boardComp[rowIdx][colIdx + 1] === "i") {
          colIdx += 1;
          injuredShipCells.push([rowIdx, colIdx]);
        } else {
          shipIsComplete = true;
        }
      }
      colIdx = initialColIdx;
      shipIsComplete = false;
      while (shipIsComplete !== true) {
        if (colIdx !== 0 && boardComp[rowIdx][colIdx - 1] === "i") {
          colIdx -= 1;
          injuredShipCells.push([rowIdx, colIdx]);
        } else {
          shipIsComplete = true;
        }
      }
      isKilled = false;
      injuredShipCells.forEach((cell) => {
        if (cell[1] !== 9 && boardComp[cell[0]][cell[1] + 1] === "sc") {
          isKilled = true;
        }
        if (cell[1] !== 0 && boardComp[cell[0]][cell[1] - 1] === "sc") {
          isKilled = true;
        }
      });
    }

    if (isKilled === "true") {
      render();
      return;
    } else if (isKilled === false) {
      score.u += 1;
      injuredShipCells.forEach((cell) => {
        boardComp[cell[0]][cell[1]] = "k";
      });
      getWinner();
      if (winner) {
        game = false;
        startAgainBtn.classList.remove("hidden");
      }
      render();
    }
  }
}

//computer's shooting function

function computerShoot() {
  if (!game) return;
  let rowIdx;
  let colIdx;

  let nextCellIdx; //to store the next cell from targets array

  if (!targets) {
    let cellIdx;
    //while loop to check if a random cell is empty
    let cellIsEmpty = false;

    while (cellIsEmpty !== true) {
      cellIdx = huntTarget();
      const row = cellIdx[1];
      const col = cellIdx[0];
      if (
        boardUser[row][col] !== "i" &&
        boardUser[row][col] !== "m" &&
        boardUser[row][col] !== "k"
      ) {
        if (
          (row + 1 > 9 || boardUser[row + 1][col] !== "k") &&
          (row - 1 < 0 || boardUser[row - 1][col] !== "k") &&
          (col + 1 > 9 || boardUser[row][col + 1] !== "k") &&
          (col - 1 < 0 || boardUser[row][col - 1] !== "k")
        )
          cellIsEmpty = true;
      }
    }
    rowIdx = cellIdx[1];
    colIdx = cellIdx[0];

    //if a cell is empty
    if (boardUser[rowIdx][colIdx] === 0) {
      boardUser[rowIdx][colIdx] = "m";
      turn = true;
      render();
      return;
    } else if (boardUser[rowIdx][colIdx] === "s") {
      boardUser[rowIdx][colIdx] = "i";
      firstRowIdx = rowIdx;
      firstColIdx = colIdx;
      render();
      targets = [];
      targets.push(
        [colIdx, rowIdx - 1],
        [colIdx, rowIdx + 1],
        [colIdx - 1, rowIdx],
        [colIdx + 1, rowIdx]
      );
    }
  } else if (targets) {
    //while loop to check if a target cell !== undegined and !== injured
    let cellIsEmpty = false;
    while (cellIsEmpty !== true) {
      nextCellIdx = targets.pop();
      const row = nextCellIdx[1];
      const col = nextCellIdx[0];
      if (
        row >= 0 &&
        row <= 9 &&
        col >= 0 &&
        col <= 9 &&
        boardUser[row][col] !== "i" &&
        boardUser[row][col] !== "m"
      ) {
        if (
          (row + 1 > 9 || boardUser[row + 1][col] !== "k") &&
          (row - 1 < 0 || boardUser[row - 1][col] !== "k") &&
          (col + 1 > 9 || boardUser[row][col + 1] !== "k") &&
          (col - 1 < 0 || boardUser[row][col - 1] !== "k")
        )
          cellIsEmpty = true;
      }
    }
    rowIdx = nextCellIdx[1];
    colIdx = nextCellIdx[0];

    if (boardUser[rowIdx][colIdx] === 0) {
      boardUser[rowIdx][colIdx] = "m";
      turn = true;
      render();
      return;
    } else if (boardUser[rowIdx][colIdx] === "s") {
      boardUser[rowIdx][colIdx] = "i";
      targets = [];
      //checking either rows or columns are equal, so that we can assign new target cells
      if (rowIdx === firstRowIdx) {
        if (colIdx > firstColIdx) {
          targets.push(
            [firstColIdx - 2, rowIdx],
            [colIdx + 2, rowIdx],
            [firstColIdx - 1, rowIdx],
            [colIdx + 1, rowIdx]
          );
        } else {
          targets.push(
            [colIdx - 2, rowIdx],
            [firstColIdx + 2, rowIdx],
            [colIdx - 1, rowIdx],
            [firstColIdx + 1, rowIdx]
          );
        }
      } else if (colIdx === firstColIdx) {
        if (rowIdx > firstRowIdx) {
          targets.push(
            [colIdx, rowIdx + 2],
            [colIdx, firstRowIdx - 2],
            [colIdx, rowIdx + 1],
            [colIdx, firstRowIdx - 1]
          );
        } else {
          targets.push(
            [colIdx, firstRowIdx + 2],
            [colIdx, rowIdx - 2],
            [colIdx, firstRowIdx + 1],
            [colIdx, rowIdx - 1]
          );
        }
      }
      render();
    }
  }

  //checking on which direction injured cells are left, if any
  let direction;
  if (rowIdx !== 9 && boardUser[rowIdx + 1][colIdx] === "i") {
    direction = "v";
  } else if (rowIdx !== 0 && boardUser[rowIdx - 1][colIdx] === "i") {
    direction = "v";
  } else if (colIdx !== 9 && boardUser[rowIdx][colIdx + 1] === "i") {
    direction = "h";
  } else if (colIdx !== 0 && boardUser[rowIdx][colIdx - 1] === "i") {
    direction = "h";
  } else {
    render();
    setTimeout(computerShoot, 1000);
    return;
  }
  let initialRowIdx = rowIdx;
  let initialColIdx = colIdx;
  let isKilled = false;
  let injuredShipCells = [[rowIdx, colIdx]];
  //checking if both sides of both directions contain injured cells
  if (direction === "v") {
    let shipIsComplete = false;

    while (shipIsComplete !== true) {
      if (rowIdx !== 9 && boardUser[rowIdx + 1][colIdx] === "i") {
        rowIdx += 1;
        injuredShipCells.push([rowIdx, colIdx]);
      } else {
        shipIsComplete = true;
      }
    }
    rowIdx = initialRowIdx;
    shipIsComplete = false;
    while (shipIsComplete !== true) {
      if (rowIdx !== 0 && boardUser[rowIdx - 1][colIdx] === "i") {
        rowIdx -= 1;
        injuredShipCells.push([rowIdx, colIdx]);
      } else {
        shipIsComplete = true;
      }
    }
    isKilled = false;
    injuredShipCells.forEach((cell) => {
      if (cell[0] !== 9 && boardUser[cell[0] + 1][cell[1]] === "s") {
        isKilled = true;
      }
      if (cell[0] !== 0 && boardUser[cell[0] - 1][cell[1]] === "s") {
        isKilled = true;
      }
    });
  } else if (direction === "h") {
    //these two variables store the information if there's any injures cells left and if there's any ship cells left
    let shipIsComplete = false;

    while (shipIsComplete !== true) {
      if (colIdx !== 9 && boardUser[rowIdx][colIdx + 1] === "i") {
        colIdx += 1;
        injuredShipCells.push([rowIdx, colIdx]);
      } else {
        shipIsComplete = true;
      }
    }
    colIdx = initialColIdx;
    shipIsComplete = false;
    while (shipIsComplete !== true) {
      if (colIdx !== 0 && boardUser[rowIdx][colIdx - 1] === "i") {
        colIdx -= 1;
        injuredShipCells.push([rowIdx, colIdx]);
      } else {
        shipIsComplete = true;
      }
    }
    isKilled = false;
    injuredShipCells.forEach((cell) => {
      if (cell[1] !== 9 && boardUser[cell[0]][cell[1] + 1] === "s") {
        isKilled = true;
      }
      if (cell[1] !== 0 && boardUser[cell[0]][cell[1] - 1] === "s") {
        isKilled = true;
      }
    });
  }
  if (isKilled) {
    render();
    setTimeout(computerShoot, 1000);

    return;
  } else if (isKilled === false) {
    score.c += 1;
    injuredShipCells.forEach((cell) => {
      boardUser[cell[0]][cell[1]] = "k";
    });
    targets = null;
    firstColIdx = null;
    firstRowIdx = null;
    setTimeout(computerShoot, 1000);
    getWinner();
    if (winner) {
      game = false;
      startAgainBtn.classList.remove("hidden");
    }
    render();
  }
}

function getWinner() {
  if (score.u === 10) winner = "You";
  else if (score.c === 10) winner = "Computer";
  return winner;
}

//helper function for getting a random number, for choosing one if the potential targets in targets array

function randomTarget(length) {
  const randomNum = Math.floor(Math.random() * length);
  return randomNum;
}

// helper function for hunt/target strategy random cell choose.
// it'll randomly choose one of the cells from a pattern for finding a patrol boat

function huntTarget() {
  let huntTarget = false;
  let huntTargetIdx = null;
  while (huntTarget !== true) {
    huntTargetIdx = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    const rowIdx = huntTargetIdx[1];
    const colIdx = huntTargetIdx[0];
    if ((colIdx + rowIdx) % 2 === 0) huntTarget = true;
  }
  return huntTargetIdx;
}

function initAfterGame() {
  init();
  shipsEl.innerHTML = `<img draggable="true" class="5" src="images/Frame 1.png" />
  <img draggable="true" class="4" src="images/Frame 2.png" />
  <img draggable="true" class="4" src="images/Frame 2.png" />
  <img draggable="true" class="3" src="images/Frame 3.png" />
  <img draggable="true" class="3" src="images/Frame 3.png" />
  <img draggable="true" class="3" src="images/Frame 3.png" />
  <img draggable="true" class="2" src="images/Frame 4.png" />
  <img draggable="true" class="2" src="images/Frame 4.png" />
  <img draggable="true" class="2" src="images/Frame 4.png" />
  <img draggable="true" class="2" src="images/Frame 4.png" />`;
  document.getElementById("ships-to-drag-container").classList.remove("hidden");
  document.getElementById("board-comp-container").classList.add("hidden");
  scoreEl.classList.add("hidden");
}
