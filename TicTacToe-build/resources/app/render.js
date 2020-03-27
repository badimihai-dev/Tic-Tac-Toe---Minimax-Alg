const remote = require("electron").remote;
const fs = require("fs");
const path = require("path");
const {
  initialize2pGame,
  initializeAiGame,
  restartGame,
  backToMenu
} = require("./game");

const loadBoard = gameMode => {
  const comp = fs.readFileSync(
    path.join(__dirname, "./components/board.html"),
    "utf8"
  );
  const app = document.getElementById("main-area");
  app.innerHTML = comp;
  var board = document.getElementById("board");
  switch (gameMode) {
    case "1p":
      document.getElementById("game-mode").innerHTML = "Singleplayer";
      initializeAiGame(board, board.querySelectorAll(".cell"));
      break;
    case "2p":
      document.getElementById("game-mode").innerHTML = "Multiplayer";
      initialize2pGame(board);
      break;
  }
};

const loadMenu = () => {
  const comp = fs.readFileSync(
    path.join(__dirname, "./components/mainMenu.html"),
    "utf8"
  );
  const app = document.getElementById("main-area");
  app.innerHTML = comp;
  const menu = document.getElementById("main-menu");
  menu.addEventListener("click", e => {
    if (e.target.className === "menu-option") {
      option = e.target.getAttribute("option");
      switch (option) {
        case "1player":
          loadBoard("1p");
          break;
        case "2players":
          loadBoard("2p");
          break;
        case "exit":
          var window = remote.getCurrentWindow();
          window.close();
          break;
      }
    }
  });
};



loadMenu();
