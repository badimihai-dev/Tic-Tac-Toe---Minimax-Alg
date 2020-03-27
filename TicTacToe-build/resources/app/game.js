const fs = require("fs");
const remote = require("electron").remote;
const { aiMove, placeOnBoard, checkWinner, clear } = require("./minimax");
var gameOver = false;
var currentPlayer;

const backToMenu = () => {
  var window = remote.getCurrentWindow();
  window.reload();
};

const restartGame = children => {
  clear();
  children.forEach(itm => {
    itm.innerHTML = "";
  });
  clearException();
};
const manageRestartMenu = () => {
  const comp = fs.readFileSync(
    path.join(__dirname, "./components/restartWindow.html"),
    "utf8"
  );
  app = document.getElementById("app");
  app.innerHTML += comp;
  let board = document.getElementById("board");
  let menu = document.getElementById("restart-window");
  let gamemode = document.getElementById("game-mode");
  if (gamemode.innerHTML.toLowerCase() === "singleplayer") {
    board.removeEventListener("click", singleplayer);
  } else {
    board.removeEventListener("click", multiplayer);
  }
  menu.addEventListener("click", e => {
    if (e.target.className == "button") {
      switch (e.target.getAttribute("option")) {
        case "restart":
          restartGame(document.querySelectorAll("#main-area .cell"));
          if (gamemode.innerHTML.toLowerCase() === "singleplayer") {
            let children = document.querySelectorAll("#board .cell");
            initializeAiGame(board, children);
          } else {
            initialize2pGame(board);
          }
          app.removeChild(menu);
          gameOver = false;
          break;
        case "main-menu":
          backToMenu();
          break;
      }
    }
  });
};
const initializeAiGame = (uiBoard, children) => {
  let game;
  currentPlayer = "x";
  let move = aiMove();
  addPlayer(children[move[0] * 3 + move[1]], currentPlayer);
  currentPlayer = "o";
  uiBoard.addEventListener("click", singleplayer);
};

const singleplayer = e => {
  children = document.querySelectorAll("#board .cell");
  if (
    currentPlayer === "o" &&
    e.target.className === "cell" &&
    gameOver == false
  ) {
    if (addPlayer(e.target, currentPlayer)) {
      userMove = [
        e.target.getAttribute("move-x"),
        e.target.getAttribute("move-y")
      ];
      placeOnBoard(userMove, currentPlayer);
      currentPlayer = "x";
      setTimeout(() => {
        move = aiMove();
        addPlayer(children[move[0] * 3 + move[1]], currentPlayer);
        currentPlayer = "o";
        game = checkWinner();
        if (game != null) {
          gameOver = true;
          invokeException(game);
          setTimeout(manageRestartMenu, 1000);
        }
      }, 500);
    }
  }
  game = checkWinner();
  if (game != null) {
    gameOver = true;
    invokeException(game);
    setTimeout(manageRestartMenu, 1000);
  }
};

const initialize2pGame = uiBoard => {
  currentPlayer = uiBoard.getAttribute("player-turn");
  uiBoard.addEventListener("click", multiplayer);
};

const multiplayer = e => {
  if (e.target.className === "cell" && gameOver == false) {
    let move = [
      e.target.getAttribute("move-x"),
      e.target.getAttribute("move-y")
    ];
    if (addPlayer(e.target, currentPlayer)) {
      placeOnBoard(move, currentPlayer);
      if (currentPlayer == "o") {
        currentPlayer = "x";
      } else if (currentPlayer == "x") {
        currentPlayer = "o";
      }
    }
    let game = checkWinner();
    if (game != null) {
      gameOver = true;
      invokeException(game);
      setTimeout(manageRestartMenu, 1000);
    }
  }
};

const addPlayer = (target, player) => {
  if (target.innerHTML === "") {
    target.innerHTML = `<div class="player player-${player}">${player.toUpperCase()}</div>`;
    clearException();
    return true;
  } else {
    invokeException("cell-filled");
    return false;
  }
};

const clearException = () => {
  document.getElementById("exception-zone").innerHTML = "";
};

const invokeException = exception => {
  let message;
  switch (exception) {
    case "cell-filled":
      message = "That cell is already taken, please chose another one.";
      document.getElementById("exception-zone").innerHTML = message;
      break;
    case "o":
      message = "O wins!";
      document.getElementById("exception-zone").innerHTML = message;
      break;
    case "x":
      message = "X wins!";
      document.getElementById("exception-zone").innerHTML = message;
      break;
    case "d":
      message = "It's a tie!";
      document.getElementById("exception-zone").innerHTML = message;
      break;
    default:
      break;
  }
};

exports.initializeAiGame = initializeAiGame;
exports.initialize2pGame = initialize2pGame;
