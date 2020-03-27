var board = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "]
];
var scores = {
  x: 1,
  o: -1,
  d: 0
};

const comp = "x";
const user = "o";

const boardIsFull = () => {
  let mainStr = "";
  for (let i = 0; i < 3; i++){
      mainStr += board[i].join("")
  }
  if(mainStr.includes(" ")){
      return false
  }
  return true;
};

const clear = () => {
  board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
  ];
};

const placeOnBoard = (move, player) => {
  board[parseInt(move[0])][parseInt(move[1])] = player;
};

const aiMove = () => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === " ") {
        board[i][j] = comp;
        let score = minimax(board, 0, false);
        board[i][j] = " ";
        if (bestScore < score) {
          bestScore = score;
          move = [i, j];
        }
      }
    }
  }
  board[move[0]][move[1]] = comp;
  return move;
};

const checkWinner = () => {
  let posibilities = [];
  for (let i = 0; i < 3; i++) {
    posibilities.push(board[i].join(""));
  }
  for (let i = 0; i < 3; i++) {
    let p = [];
    for (let j = 0; j < 3; j++) {
      p.push(board[j][i]);
    }
    posibilities.push(p.join(""));
  }

  let p = [];
  for (let i = 0; i < 3; i++) {
    p.push(board[i][i]);
  }
  posibilities.push(p.join(""));

  p = [];
  for (let i = 2; i >= 0; i--) {
    p.push(board[2 - i][i]);
  }
  posibilities.push(p.join(""));
   
  let gameWon = null;
  posibilities.forEach(p => {
    if (p.includes("xxx") || p.includes("ooo")) {
      gameWon = p[0];
    }
  });
  if (boardIsFull() && gameWon == null) {
    return "d";
  }
  return gameWon;
};

const minimax = (board, depth, isMaximizing) => {
  let result = checkWinner(board);

  if (result != null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = comp;
          let score = minimax(board, 0, false);
          board[i][j] = " ";
          if (bestScore < score) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          board[i][j] = user;
          let score = minimax(board, 0, true);
          board[i][j] = " ";
          if (bestScore > score) {
            bestScore = score;
          }
        }
      }
    }
    return bestScore;
  }
};

exports.checkWinner = checkWinner;
exports.aiMove = aiMove;
exports.placeOnBoard = placeOnBoard;
exports.clear = clear;