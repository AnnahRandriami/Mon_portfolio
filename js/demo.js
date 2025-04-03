export const modalContent = `
  <h2 class="entete">Test automatisé de mon portfolio</h2>
    <ul>
       <li><a class="clickable" data-url="./pages_html/demoESLINT.html">Test statique avec ESLint</a></li>
       <li><a class="clickable" data-url="./pages_html/demoTetris.html">Test de fonctionnalité du jeu Tetris en Selenium</a></li>
       <li><a class="clickable" data-url="./pages_html/demoEstimation.html">Test de fonctionnalité de l'estimation de l'effort de test en Selenium</a></li>
    </ul>
  <h2 class="entete">Test des fonctionnalités du site Shopify</h2>
    <ul>
       <li><a class="clickable" data-url="./pages_html/demoShopify.html">Test de fonctionnalité connexion/inscription sur Selenium</a></li>
    </ul>
      <h2 class="entete">Mes projets</h2>
    <ul>
       <li><a class="clickable" data-url="https://github.com/AnnahRandriami">Lien vers mon compte gitHub</a></li>
    </ul>
`;

//popup
function openPopup(event) {
  event.preventDefault();
  const url = event.target.getAttribute("data-url");

  if (url) {
    console.log("Ouverture du popup :", url);
    window.open(url, "popupWindow", "width=900,height=500,left=900,top=100");
  }
}
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("clickable")) {
    openPopup(event);
  }
});

const observer = new MutationObserver(() => {
  console.log("Nouveaux éléments détectés, mise à jour des événements.");
});
observer.observe(document.body, { childList: true, subtree: true });
