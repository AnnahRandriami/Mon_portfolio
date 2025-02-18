export const modalContent = `
<div id="scoreTimer">
  <p id="gameOverMessage" style="display: none; color: red; font-size: 20px;">Game Over!</p>

  <div id="scoreDisplay" style="font-size: 15px; text-align: center; font-family: cursive, sans-serif; color: black;">
    Score: 0
  </div>
</div>
<div id="instruction">
  <p style="text-align:center;"><strong>Utiliser les flèches <BR>du clavier :</strong></p>
  <p>⬅️: Déplacer à gauche</p>
  <p>➡️: Déplacer à droite</p>
  <p>⬆️: Tourner la pièce</p>
  <p>⬇️: Accélérer la descente</p>
</div>
<canvas id="tetris"></canvas>
`;

let gameInterval;
let gameRunning = false;

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
  const modalHeight = modalLeft.clientHeight;

  const COLUMNS = 15;
  const ROWS = 30;

  // Ajuste la taille des blocs pour que cela soit plus lisse
  const BLOCK_SIZE = Math.floor(
    Math.min(canvas.width / COLUMNS, canvas.height / ROWS)
  );

  // Réinitialiser la taille du canvas à chaque fois
  canvas.width = BLOCK_SIZE * COLUMNS;
  canvas.height = BLOCK_SIZE * ROWS;

  const ctx = canvas.getContext("2d");

  // Activer l'anti-aliasing pour éviter la pixellisation
  ctx.imageSmoothingEnabled = true;

  if (!ctx) {
    console.error("Impossible d'obtenir le contexte du canvas");
    return;
  }

  const COLORS = [null, "#000000"]; // Couleur des blocs

  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [
      [1, 1],
      [1, 1],
    ], // O
    [
      [0, 1, 0],
      [1, 1, 1],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // S
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // Z
    [
      [1, 0, 0],
      [1, 1, 1],
    ], // L
    [
      [0, 0, 1],
      [1, 1, 1],
    ], // J
  ];

  let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  let currentPiece, currentPosition;
  let score = 0;

  function startGameLoop() {
    generatePiece();
    drawBoard();
    gameInterval = setInterval(gameLoop, 500);
  }

  function stopGame() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameRunning = false;
      gameOverMessage.style.display = "block";
      gameOverMessage.innerText = "Game Over! Final Score: " + score; // Afficher le score final
    }
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

    ctx.fillStyle = "#D8BFD8"; // Couleur de fond
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        if (board[row][col]) {
          ctx.fillStyle = COLORS[1];
          ctx.fillRect(
            col * BLOCK_SIZE,
            row * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          ctx.strokeStyle = "#FFFFFF";
          ctx.strokeRect(
            col * BLOCK_SIZE,
            row * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }

    for (let row = 0; row < currentPiece.length; row++) {
      for (let col = 0; col < currentPiece[row].length; col++) {
        if (currentPiece[row][col]) {
          ctx.fillStyle = COLORS[1];
          ctx.fillRect(
            (currentPosition.x + col) * BLOCK_SIZE,
            (currentPosition.y + row) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          ctx.strokeStyle = "#FFFFFF";
          ctx.strokeRect(
            (currentPosition.x + col) * BLOCK_SIZE,
            (currentPosition.y + row) * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }
  }

  // Fonction pour mettre à jour le score
  function updateScore() {
    scoreDisplay.innerText = "Score: " + score;
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
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row].every((cell) => cell !== 0)) {
        board.splice(row, 1);
        board.unshift(Array(COLUMNS).fill(0));
        score += 100; // Incrémenter le score
        updateScore(); // Mettre à jour l'affichage du score
      }
    }
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
    if (!isValidMove()) {
      currentPiece = oldPiece;
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      currentPosition.x--;
      if (!isValidMove()) currentPosition.x++;
    }
    if (e.key === "ArrowRight") {
      currentPosition.x++;
      if (!isValidMove()) currentPosition.x--;
    }
    if (e.key === "ArrowDown") {
      moveDown();
    }
    if (e.key === "ArrowUp") {
      rotatePiece();
    }
  });

  function gameLoop() {
    moveDown();
    drawBoard();
  }

  startGameLoop();
}
