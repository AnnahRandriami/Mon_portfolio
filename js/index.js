let eyes = document.getElementsByClassName("eye");
let mounth = document.getElementsByClassName("mounth");
let glass = document.getElementsByClassName("glass");
let ball = document.getElementsByClassName("ball");
const navButtons = document.querySelectorAll(".nav");
const navButtonsLeft = document.querySelectorAll(".right");
const addContentLeft = document.querySelector(".content-modal-right");
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

// Parcourir tous les boutons partie droite
navButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    const icon = button.querySelector(".icon");
    const text = button.querySelector(".text");

    if (icon) {
      icon.style.visibility = "hidden";
      text.style.visibility = "visible";
    }
  });

  button.addEventListener("mouseleave", () => {
    const icon = button.querySelector(".icon");
    if (icon) {
      icon.style.visibility = "visible";
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

//Recupération, affichage et gestion du texte pour chaque bouton droit
navButtonsLeft.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    if (navButtonsLeft) {
      addContentLeft.style.visibility = "visible";
      addContentLeft.textContent = button.getAttribute("data-text");
    }
  });
  button.addEventListener("mouseleave", () => {
    if (addContentLeft) {
      addContentLeft.style.visibility = "hidden";
    }
  });
});

//Gestion du loader
document.addEventListener("DOMContentLoaded", function () {
  let loader = document.querySelector(".loader");
  let animationElement = document.querySelector(".animation");
  let myTools = document.querySelector(".my-tools");
  let buttons = document.querySelectorAll(".nav");
  let head = document.querySelector(".head");
  let globeA = document.querySelector(".globe-a");
  let globeB = document.querySelector(".globe-b");

  setTimeout(() => {
    // Cache le loader et affiche l'animation principale
    loader.classList.add("hidden");
    animationElement.style.visibility = "visible";
    animationElement.style.opacity = 1;

    // 🛠️ Apparition progressive de my-tools après 500ms
    setTimeout(() => {
      myTools.classList.add("show");
    }, 500);

    setTimeout(() => {
      head.classList.add("show");
      globeA.classList.add("show");
      globeB.classList.add("show");
    }, 2000);

    // 🎯 Apparition des boutons un par un
    buttons.forEach((btn, index) => {
      setTimeout(() => {
        btn.classList.add(`show-btn-${index + 1}`);
      }, index * 200); // Délai progressif entre chaque bouton
    });
  }, 2000); // Temps du loader (2s)
});

//Modal left
document.addEventListener("DOMContentLoaded", function () {
  const modalLeft = document.querySelector(".content-modal-left");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.querySelector(".close-modal");
  let timer;
  let seconds = 0;

  // Affichage du timer en  les secondes dans l'élément de la modale
  function updateTimerDisplay() {
    const timerElement = document.getElementById("timeDisplay");
    if (timerElement) {
      timerElement.textContent = `Timer : ${seconds} s`;
    }
  }

  // Gestion de l'ouverture de la modale et recupération du html pour chaque boutton
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
    if (gameOverMessage && gameOverMessage.style.display !== "none") {
      clearInterval(timer);
      console.log("Le jeu est terminé, timer arrêté !");
    } else {
      console.log("le jeu continue");
    }
  }
});
