export const modalContent = `
  <h2 class="entete">Test Management</h2>
    <ul>
        <li><a class="clickable" data-url="https://github.com/AnnahRandriami/Mon_portfolio/issues">Test de fonctionnalité de mon portfolio</a></li>
        <li><a class="clickable" data-url="https://github.com/AnnahRandriami/shopify-automation-tests/issues">Test de fonctionnalité du site Shopify</a></li>
        <li><a class="clickable" data-url="https://trello.com/b/3HhyIjkA">Test de fonctionnalité du jeu Tetris avec Trello</a></li>
    </ul>
`;

//popup
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("clickable")) {
    event.preventDefault();
    const url = event.target.getAttribute("data-url");

    if (url) {
      console.log("Ouverture du popup :", url);
      window.open(url, "popupWindow", "width=900,height=500,left=900,top=100");
    }
  }
});
