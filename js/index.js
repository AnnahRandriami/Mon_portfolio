let eyes = document.getElementsByClassName("eye");
let mounth = document.getElementsByClassName("mounth");
let glass = document.getElementsByClassName("glass");
let ball = document.getElementsByClassName("ball");
const navButtons = document.querySelectorAll(".nav");
const navButtonsLeft = document.querySelectorAll(".right");
const addContentLeft = document.querySelector(".content-modal-right");
const myName = document.querySelector(".name");
const head = document.querySelector(".head");

let mouseMoveTimeout;
const delay = 1000;
//Animation tete flottante
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

// Sélectionner tous les boutons de navigation
navButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    const icon = button.querySelector(".icon");
    const text = button.querySelector(".text");

    if (icon && text) {
      icon.style.opacity = "0";
      text.style.opacity = "1";
      text.style.visibility = "visible";
    }
  });

  button.addEventListener("mouseleave", () => {
    const icon = button.querySelector(".icon");
    const text = button.querySelector(".text");

    if (icon && text) {
      icon.style.opacity = "1";
      text.style.opacity = "0";
      text.style.visibility = "hidden";
    }
  });

  button.addEventListener("click", () => {
    const animation = document.querySelector(".animation");
    if (animation) {
      animation.classList.toggle("mooveContent");
    }
  });
});

//Recupération, affichage et gestion du texte pour chaque bouton droit
const elements = [...navButtonsLeft, document.querySelector(".head")];
elements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    if (navButtonsLeft) {
      head.style.scale = "1.22";
      addContentLeft.style.visibility = "visible";
      myName.style.visibility = "hidden";
      addContentLeft.textContent = element.getAttribute("data-text");
    }
  });
  element.addEventListener("mouseleave", () => {
    if (addContentLeft) {
      addContentLeft.style.visibility = "hidden";
      myName.style.visibility = "";
      head.style.scale = "";
    }
  });
});

//Modal left
document.addEventListener("DOMContentLoaded", function () {
  const modalLeft = document.querySelector(".content-modal-left");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.querySelector(".close-modal");
  let timer;
  let seconds = 0;

  //changement de couleur de font

  // Sélectionne tous les éléments avec la classe .open-modal
  const openModals = document.querySelectorAll(".open-modal");

  // Appliquer un écouteur d'événements sur chaque élément
  openModals.forEach((modal) => {
    modal.addEventListener("mouseenter", () => {
      // Change la couleur de l'icône en blanc
      const icon = modal.querySelector(".font"); // ou modal.querySelector("i"), selon ton HTML
      if (icon) {
        icon.style.color = "white";
        icon.style.fontSize = "2em";
      }
    });

    modal.addEventListener("mouseleave", () => {
      // Remet la couleur de l'icône à sa couleur d'origine (par exemple noir)
      const icon = modal.querySelector(".font"); // ou modal.querySelector("i"), selon ton HTML
      if (icon) {
        icon.style.color = "";
        icon.style.fontSize = "";
      }
    });
  });

  // Affichage du timer en  les secondes dans l'élément de la modale
  function updateTimerDisplay() {
    const timerElement = document.getElementById("timeDisplay");
    if (timerElement) {
      timerElement.textContent = `Timer : ${seconds} s`;
    }
  }

  // Gestion de l'ouverture de la modale et récupération du HTML pour chaque bouton
  document.querySelectorAll(".open-modal").forEach((icon) => {
    icon.addEventListener("click", function () {
      const parentDiv = this.closest("[data-js]");

      if (!parentDiv) {
        console.error("Aucun élément parent avec 'data-js' trouvé.");
        return;
      }

      const dataFile = parentDiv.getAttribute("data-js");

      if (dataFile) {
        import(`./${dataFile}`)
          .then((module) => {
            modalContent.innerHTML = module.modalContent;
            modalLeft.classList.add("show");
            seconds = 0;
            updateTimerDisplay();
            timer = setInterval(() => {
              seconds++;
              updateTimerDisplay();
              checkGameOver();
            }, 1000);

            // Si data-js est tetris.js, changer l'image de fond
            const modalElement = document.querySelector(".content-modal-left"); // Cibler la modale, ajustez la classe si nécessaire
            if (modalElement) {
              if (dataFile === "tetris.js") {
                modalElement.style.backgroundImage =
                  "url('./image/pixel-art-7512999_1280.png')";
                modalElement.style.backgroundSize = "cover";
                modalElement.style.backgroundPosition = "center";
              } else {
                // Si ce n'est pas tetris.js, ne rien mettre en fond
                modalElement.style.backgroundImage = "none";
              }
            }

            if (module.startGame) {
              module.startGame();
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
      modalLeft.classList.remove("show");
      clearInterval(timer);
    });
  }

  //Affichage gameOver pour un jeu
  function checkGameOver() {
    const gameOverMessage = document.getElementById("gameOverMessage"); // Vérifie s'il existe

    if (gameOverMessage && gameOverMessage.style.display !== "none") {
      clearInterval(timer);
      console.log("Le jeu est terminé, timer arrêté !");
    }
  }
});

// Fonction pour afficher la date locale
function displayDate() {
  const currentDate = new Date();
  // Options pour afficher la date (jour de la semaine, mois, jour, année)
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = currentDate.toLocaleDateString("fr-FR", dateOptions);
  document.getElementById("date-time").textContent = `${formattedDate}`;
}
displayDate();

document.addEventListener("DOMContentLoaded", function () {
  const loader = document.querySelector(".loader");
  const animationElement = document.querySelector(".animation");
  const myTools = document.querySelector(".my-tools");
  const buttons = document.querySelectorAll(".nav");
  const head = document.querySelector(".head");
  const globeA = document.querySelector(".globe-a");
  const globeB = document.querySelector(".globe-b");
  const today = new Date().toLocaleDateString();
  const lastVisit = localStorage.getItem("lastVisitDate");

  /**
   * Afficher les éléments progressivement avec un délai
   * @param {Array} elements -
   * @param {number} delayBase 
   * @param {number} interval 
   */
  function showElementsWithDelay(elements, delayBase = 1000, interval = 200) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("show"); 
      }, delayBase + index * interval);
    });
  }

  function showContent() {
    animationElement.style.visibility = "visible";
    animationElement.style.opacity = 1;

    setTimeout(() => {
      loader.classList.add("hidden");
      myTools.classList.add("show");
    }, 1000);

    showElementsWithDelay([head, globeA, globeB], 2000);
    showElementsWithDelay(buttons, 2000, 200);
  }

  if (lastVisit === today) {
    // Si l'utilisateur a déjà visité aujourd'hui → pas de loader, on affiche directement
    loader.classList.add("hidden");
    showContent();
  } else {
    // Première visite → affichage du loader puis du contenu
    loader.classList.add("show");

    setTimeout(() => {
      showContent();
      localStorage.setItem("lastVisitDate", today);
    }, 2000); // On cache le loader après 2 secondes
  }
});


