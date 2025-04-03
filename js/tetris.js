export const modalContent = `
<div id="scoreTimer">
  <p id="gameOverMessage" style="display: none; color: red; font-size: 20px;">Game Over!</p>
  <div id="scoreDisplay">Score: 0</div>
  <div id="timeDisplay"></div>
</div>
<div id="instruction">
  <p style="text-align:center;"><strong>Utiliser les <br>flèches du clavier :</strong></p>
  <p>⬅️: Déplacer à gauche</p>
  <p>➡️: Déplacer à droite</p>
  <p>⬆️: Tourner la pièce</p>
  <p>⬇️: Accélérer la descente</p>
</div>

<canvas id="tetris"></canvas>
`;

let gameInterval;
let gameRunning = false;
let score = 0;
let linesCleared = 0;
let lastUpdateTime = Date.now();
let timerSpeed = 500; // Temps d'intervalle entre chaque descente de la pièce

export function startGame() {
  const canvas = document.getElementById("tetris");
  const gameOverMessage = document.getElementById("gameOverMessage");
  const scoreDisplay = document.getElementById("scoreDisplay");

  if (!canvas) {
    console.error("Canvas non trouvé dans la modale");
    return;
  }

  const modalLeft = document.querySelector(".content-modal-left");
  const modalWidth = modalLeft.clientWidth;

  const COLUMNS = 15;
  const ROWS = 30;
  const BLOCK_SIZE = Math.floor(modalWidth / COLUMNS);

  canvas.width = BLOCK_SIZE * COLUMNS;
  canvas.height = BLOCK_SIZE * ROWS;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Impossible d'obtenir le contexte du canvas");
    return;
  }

  const COLORS = ["#000000"];

  const SHAPES = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
  ];

  let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  let currentPiece, currentPosition;

  function startGameLoop() {
    // Réinitialiser le jeu à chaque redémarrage
    score = 0;
    linesCleared = 0;
    updateScore();

    // Annuler l'ancien intervalle de jeu, si existant
    if (gameInterval) {
      clearInterval(gameInterval);
    }

    // Lancer le jeu avec un nouvel intervalle
    generatePiece();
    drawBoard();
    gameInterval = setInterval(gameLoop, timerSpeed);
    gameRunning = true;
    gameOverMessage.style.display = "none";
    document.addEventListener("keydown", handleKeyDown);
  }

  function stopGame() {
    // Arrêter l'intervalle du jeu
    clearInterval(gameInterval);
    gameRunning = false;
    document.removeEventListener("keydown", handleKeyDown);
  }

  function generatePiece() {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    currentPiece = SHAPES[randomIndex];
    currentPosition = {
      x: Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2),
      y: 0,
    };

    if (!isValidMove()) {
      gameOverMessage.style.display = "block";
      stopGame();
    }
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#D8BFD8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner les blocs présents sur le plateau
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        if (board[row][col]) {
          drawBlock(col, row);
        }
      }
    }

    // Dessiner la pièce actuelle
    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          drawBlock(currentPosition.x + col, currentPosition.y + row);
        }
      }
    }
  }

  function drawBlock(x, y) {
    ctx.fillStyle = COLORS[0];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  function moveDown() {
    currentPosition.y++;
    if (!isValidMove()) {
      currentPosition.y--;
      placePiece();
      generatePiece();
    }
  }

  function placePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          board[currentPosition.y + row][currentPosition.x + col] = 1;
        }
      }
    }
    clearFullLines();
  }

  function clearFullLines() {
    let fullLines = [];

    // Détection des lignes complètes
    for (let row = 0; row < ROWS; row++) {
      if (board[row].every((cell) => cell !== 0)) {
        fullLines.push(row);
      }
    }

    // Si on trouve des lignes complètes
    if (fullLines.length > 0) {
      // Animation facultative avant suppression
      fullLines.forEach((lineIndex) => animateLineClear(lineIndex));

      // Créer un nouveau board sans les lignes complètes
      let newBoard = board.filter((_, index) => !fullLines.includes(index));

      // Ajouter de nouvelles lignes vides en haut pour compenser les suppressions
      while (newBoard.length < ROWS) {
        newBoard.unshift(Array(COLUMNS).fill(0));
      }

      // Remplace l'ancien board par le nouveau
      board = newBoard;

      // Mise à jour du score avec bonus progressif
      const points = [0, 100, 300, 500, 800];
      score += points[fullLines.length];
      linesCleared += fullLines.length;
      updateScore();
    }
  }

  // Fonction d'animation (optionnelle)
  function animateLineClear(lineIndex) {
    console.log(`Animation pour la ligne ${lineIndex}`);
  }

  function updateScore() {
    scoreDisplay.innerText = "Score: " + score;
  }

  function isValidMove() {
    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          const x = currentPosition.x + col;
          const y = currentPosition.y + row;
          if (x < 0 || x >= COLUMNS || y >= ROWS || (y >= 0 && board[y][x])) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function rotatePiece() {
    const rotated = currentPiece[0]
      .map((_, index) => currentPiece.map((row) => row[index]))
      .reverse();
    const oldPiece = currentPiece;
    currentPiece = rotated;
    if (!isValidMove()) currentPiece = oldPiece;
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft")
      currentPosition.x--, !isValidMove() && currentPosition.x++;
    if (e.key === "ArrowRight")
      currentPosition.x++, !isValidMove() && currentPosition.x--;
    if (e.key === "ArrowDown") moveDown();
    if (e.key === "ArrowUp") rotatePiece();
    drawBoard();
  }

  function gameLoop() {
    let now = Date.now();
    if (now - lastUpdateTime > timerSpeed) {
      moveDown();
      drawBoard();
      lastUpdateTime = now;
    }
  }

  startGameLoop();
}
