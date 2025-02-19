export const modalContent = `
  <p id="gameOverMessage" style="display: none; color: red; font-size: 20px;">Game Over!</p>
  <h2>Jeu du Juste Prix</h2>
  <div id="imageContainer">
    <button id="prevImage">&#8592;</button>
    <img id="gameImage" src="image/yellow-6556408_1280.jpg" alt="Image du jeu" />
    <button id="nextImage">&#8594;</button>
  </div>
  <p>Devinez le prix !</p>
  <input type="number" id="guess" placeholder="Entrez un prix entre 1 et 100" />
  <button id="submitGuess">Valider</button>
  <p id="result"></p>
  <p id="attempts">Nombre d'essais restants : 10</p>
  <p id="price">Prix de l'image : 0€</p> <!-- Affichage du prix -->
`;
document.addEventListener("DOMContentLoaded", () => {
  // Injection du contenu modalContent dans le DOM si nécessaire

  const images = [
    "image/watercolor.jpg", // Chemin relatif vers le dossier 'images'
    "image/yellow-6556408_1280.jpg",
  ];

  const prices = [
    20, // Prix associé à "image/watercolor.jpg"
    35, // Prix associé à "image/yellow-6556408_1280.jpg"
  ];

  let currentImageIndex = 0;

  // Sélectionner les éléments
  const gameImage = document.getElementById("gameImage");
  const prevButton = document.getElementById("prevImage");
  const nextButton = document.getElementById("nextImage");
  const priceDisplay = document.getElementById("price");

  // Fonction pour afficher le prix de l'image actuelle
  function updatePrice() {
    priceDisplay.textContent = `Prix de l'image : ${prices[currentImageIndex]}€`;
  }

  // Initialisation du prix au début du jeu
  updatePrice();

  // Fonction pour changer l'image précédente
  prevButton.addEventListener("click", () => {
    console.log("Clique sur précédent");
    // Mettre à jour l'indice de l'image
    currentImageIndex =
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    console.log("Image actuelle (précédente) :", currentImageIndex);
    gameImage.src = images[currentImageIndex]; // Mise à jour de l'image
    updatePrice(); // Mise à jour du prix
  });

  // Fonction pour changer l'image suivante
  nextButton.addEventListener("click", () => {
    console.log("Clique sur suivant");
    // Mettre à jour l'indice de l'image
    currentImageIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    console.log("Image actuelle (suivante) :", currentImageIndex);
    gameImage.src = images[currentImageIndex]; // Mise à jour de l'image
    updatePrice(); // Mise à jour du prix
  });
});
