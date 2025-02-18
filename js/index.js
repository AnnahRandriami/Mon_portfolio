let eyes = document.getElementsByClassName("eye");
let mounth = document.getElementsByClassName("mounth");
let glass = document.getElementsByClassName("glass");
let ball = document.getElementsByClassName("ball");
let mouseMoveTimeout;
const delay = 1000;

document.onmousemove = function () {
  let x = (event.clientX * 100) / window.innerWidth + "%";
  let y = (event.clientY * 100) / window.innerHeight + "%";

  for (let i = 0; i < 2; i++) {
    eyes[i].style.left = x;
    eyes[i].style.top = y;
    eyes[i].style.transform = "translate(-" + x + ",-" + y + ")";
  }
  for (let i = 0; i < mounth.length; i++) {
    mounth[i].style.borderRadius = "50%";
    mounth[i].style.height = "20px";
    mounth[i].style.width = "20px";
    mounth[i].style.borderTop = "solid 5px black";
  }
  for (let i = 0; i < glass.length; i++) {
    glass[i].style.height = "";
    glass[i].style.backgroundColor = "";
    glass[i].style.top = "";
    glass[i].style.clipPath = "";
    glass[i].style.borderRadius = "";
  }
  for (let i = 0; i < ball.length; i++) {
    ball[i].style.backgroundColor = "";
  }
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(() => {
    for (let i = 0; i < mounth.length; i++) {
      mounth[i].style.borderRadius = "";
      mounth[i].style.height = "";
      mounth[i].style.width = "";
      mounth[i].style.borderTop = "";
    }
    for (let i = 0; i < glass.length; i++) {
      glass[i].style.height = "20px";
      glass[i].style.backgroundColor = "black";
      glass[i].style.top = "20px";
      glass[i].style.borderRadius = "50px";
      glass[i].style.clipPath =
        "polygon(30% 0%, 70% 0%, 100% 30%, 76% 12%, 63% 5%, 37% 5%, 25% 12%, 0% 30%)";
    }
    for (let i = 0; i < ball.length; i++) {
      ball[i].style.backgroundColor = "black";
    }
  }, delay);
};

const navButtons = document.querySelectorAll(".nav");

// Parcourir tous les boutons de navigation
navButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    const icon = button.querySelector(".icon");
    const text = button.querySelector(".text");

    if (icon) {
      icon.style.visibility = "hidden";
      text.style.visibility = "visible"; // Cache l'icône
    }
  });

  // Quand la souris quitte : afficher l'icône
  button.addEventListener("mouseleave", () => {
    const icon = button.querySelector(".icon");
    if (icon) {
      icon.style.visibility = "visible";
      // Rétablit la visibilité
    }
  });
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const icon = button.querySelector(".icon");
    const animation = document.querySelector(".animation");
    if (icon) {
      animation.classList.toggle("mooveContent");
    }
  });
});

const navButtonsLeft = document.querySelectorAll(".right");
const addContentLeft = document.querySelector(".content-modal-right");

navButtonsLeft.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    if (navButtonsLeft) {
      addContentLeft.style.visibility = "visible";
      addContentLeft.textContent = button.getAttribute("data-text"); // Récupère le texte du bouton
    }
  });
  button.addEventListener("mouseleave", () => {
    if (addContentLeft) {
      addContentLeft.style.visibility = "hidden"; // Cache la boîte quand la souris part
    }
  });
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".loader").classList.add("hidden");
  }, 2000);
});

//left-modal
document.addEventListener("DOMContentLoaded", function () {
  const modalLeft = document.querySelector(".content-modal-left");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close-modal");
  let timer; // Variable pour stocker le timer
  let seconds = 0; // Variable pour compter les secondes

  // Fonction pour afficher les secondes dans l'élément de la modale
  function updateTimerDisplay() {
    const timerElement = document.getElementById("timeDisplay");
    if (timerElement) {
      timerElement.textContent = `Timer : ${seconds} s`;
    }
  }

  // Gestion de l'ouverture de la modale
  document.querySelectorAll(".open-modal").forEach((icon) => {
    icon.addEventListener("click", function () {
      const parentDiv = this.closest("[data-js]"); // Récupérer l'élément parent

      if (!parentDiv) {
        console.error("Aucun élément parent avec 'data-js' trouvé.");
        return;
      }

      const dataFile = parentDiv.getAttribute("data-js");

      if (dataFile) {
        import(`./${dataFile}`)
          .then((module) => {
            modalText.innerHTML = module.modalContent; // Insérer le contenu
            modalLeft.classList.add("show"); // Afficher la modale

            // Initialiser et démarrer le timer dès l'ouverture de la modale
            seconds = 0; // Réinitialiser le compteur de secondes
            updateTimerDisplay(); // Mettre à jour l'affichage du timer
            timer = setInterval(() => {
              seconds++; // Incrémenter les secondes
              updateTimerDisplay();
              checkGameOver(); // Mettre à jour l'affichage du timer
            }, 1000);

            if (module.startGame) {
              module.startGame(); // Démarre le jeu si présent
            }
          })
          .catch((error) =>
            console.error("Erreur de chargement du fichier :", error)
          );
      }
    });
  });

  // Fermeture de la modale via le bouton de fermeture
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modalLeft.classList.remove("show"); // Masquer la modale
      clearInterval(timer); // Stopper le timer si la modale est fermée
    });
  }

  function checkGameOver() {
    // Vérifie si le message "Game Over" est visible
    if (gameOverMessage && gameOverMessage.style.display !== "none") {
      clearInterval(timer); // Arrêter le timer si le message de fin de jeu est affiché
      console.log("Le jeu est terminé, timer arrêté !");
    }
  }
});
