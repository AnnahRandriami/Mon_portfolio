// justePrix.js

export const modalContent = document.createElement("div"); // Créer un nouvel élément div pour contenir le jeu

export function startGame() {
  // Générer un prix aléatoire entre 1 et 100
  const correctPrice = Math.floor(Math.random() * 100) + 1;

  // Ajouter le HTML du jeu à modalContent
  modalContent.innerHTML = `
    <h2>Jeu du Juste Prix</h2>
    <p>Devinez le prix !</p>
    <input type="number" id="guess" placeholder="Entrez un prix entre 1 et 100" />
    <button id="submitGuess">Valider</button>
    <p id="result"></p>
    <p id="attempts">Nombre d'essais restants : 10</p>
  `;

  const submitButton = modalContent.querySelector("#submitGuess");
  const result = modalContent.querySelector("#result");
  const guessInput = modalContent.querySelector("#guess");
  const attemptsDisplay = modalContent.querySelector("#attempts");

  let attemptsLeft = 10; // Nombre d'essais maximum

  submitButton.addEventListener("click", function () {
    const userGuess = parseInt(guessInput.value);

    // Vérification que l'utilisateur entre un nombre
    if (isNaN(userGuess)) {
      result.textContent = "Veuillez entrer un nombre valide !";
      result.style.color = "red";
      return;
    }

    attemptsLeft--; // Décrémenter le nombre d'essais à chaque tentative

    if (userGuess === correctPrice) {
      result.textContent = `Bravo, vous avez trouvé le bon prix (${correctPrice}) !`;
      result.style.color = "green";
      attemptsDisplay.textContent = "Félicitations, vous avez gagné !";
      submitButton.disabled = true; // Désactiver le bouton après avoir trouvé la réponse
    } else if (userGuess < correctPrice) {
      result.textContent = "Le prix est plus grand, essayez encore !";
      result.style.color = "orange";
      attemptsDisplay.textContent = `Nombre d'essais restants : ${attemptsLeft}`;
    } else {
      result.textContent = "Le prix est plus petit, essayez encore !";
      result.style.color = "orange";
      attemptsDisplay.textContent = `Nombre d'essais restants : ${attemptsLeft}`;
    }

    // Si l'utilisateur n'a plus d'essais
    if (attemptsLeft <= 0 && userGuess !== correctPrice) {
      result.textContent = `Game Over ! Le prix était ${correctPrice}.`;
      result.style.color = "red";
      attemptsDisplay.textContent = "Vous avez épuisé tous vos essais.";
      submitButton.disabled = true; // Désactiver le bouton après avoir épuisé les tentatives
    }
  });
}

startGame();
