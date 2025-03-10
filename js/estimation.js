function showForm() {
  let method = document.getElementById("method").value;
  let formContainer = document.getElementById("form-container");
  let formHTML = "";

  switch (method) {
    case "ratio":
      formHTML = `
              <h3>Estimation par ratio</h3>
              <label>Effort de développement (heures) :</label>
              <input type="number" id="dev_effort">
              <label>Ratio test/dev (%) :</label>
              <input type="number" id="ratio">
              <button onclick="calculateRatio()">Calculer</button>
          `;
      break;
    case "extrapolation":
      formHTML = `
              <h3>Extrapolation</h3>
              <label>Effort de test d'un projet similaire (heures) :</label>
              <input type="number" id="past_effort">
              <label>Taille relative du projet (%) :</label>
              <input type="number" id="project_size">
              <button onclick="calculateExtrapolation()">Calculer</button>
          `;
      break;
    case "delphi":
      formHTML = `
              <h3>Delphi large bande</h3>
              <label>Estimation expert 1 :</label>
              <input type="number" id="expert1">
              <label>Estimation expert 2 :</label>
              <input type="number" id="expert2">
              <label>Estimation expert 3 :</label>
              <input type="number" id="expert3">
              <button onclick="calculateDelphi()">Calculer</button>
          `;
      break;
    case "three_point":
      formHTML = `
              <h3>Estimation à trois points</h3>
              <label>Estimation optimiste :</label>
              <input type="number" id="optimistic">
              <label>Estimation pessimiste :</label>
              <input type="number" id="pessimistic">
              <label>Estimation la plus probable :</label>
              <input type="number" id="likely">
              <button onclick="calculateThreePoint()">Calculer</button>
          `;
      break;
  }

  formContainer.innerHTML = formHTML;
}

function calculateRatio() {
  let devEffort = parseFloat(document.getElementById("dev_effort").value);
  let ratio = parseFloat(document.getElementById("ratio").value);
  let testEffort = (devEffort * ratio) / 100;
  document.getElementById("result").innerText =
    "Effort de test estimé : " + testEffort + " heures";
}

function calculateExtrapolation() {
  let pastEffort = parseFloat(document.getElementById("past_effort").value);
  let projectSize = parseFloat(document.getElementById("project_size").value);
  let testEffort = (pastEffort * projectSize) / 100;
  document.getElementById("result").innerText =
    "Effort de test estimé : " + testEffort + " heures";
}

function calculateDelphi() {
  let expert1 = parseFloat(document.getElementById("expert1").value);
  let expert2 = parseFloat(document.getElementById("expert2").value);
  let expert3 = parseFloat(document.getElementById("expert3").value);
  let testEffort = (expert1 + expert2 + expert3) / 3;
  document.getElementById("result").innerText =
    "Effort de test estimé : " + testEffort + " heures";
}

function calculateThreePoint() {
  let optimistic = parseFloat(document.getElementById("optimistic").value);
  let pessimistic = parseFloat(document.getElementById("pessimistic").value);
  let likely = parseFloat(document.getElementById("likely").value);
  let testEffort = (optimistic + 4 * likely + pessimistic) / 6;
  document.getElementById("result").innerText =
    "Effort de test estimé : " + testEffort + " heures";
}
