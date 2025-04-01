function showForm() {
  let method = document.getElementById("method").value;
  let formContainer = document.getElementById("form-container");
  let formHTML = "";

  switch (method) {
    case "ratio":
      formHTML = `
              <h3>Estimation par ratio</h3>
              <p class="definition">Selon, ISTQB, cette technique basée sur des métriques, des chiffres sont
              collectés à partir de projets antérieurs au sein de l'organisation, ce qui permet de déduire des ratios
              "standards" pour des projets similaires. Les ratios des projets propres à une organisation (par exemple, à
              partir de données historiques) sont généralement la meilleure source à utiliser dans le processus
              d'estimation. Ces ratios standards peuvent ensuite être utilisés pour estimer l'effort de test pour le
              nouveau projet. </p>
              <label>Effort de développement dernier projet/itération (personnes/jours) :</label>
              <input type="number" id="dev_effort">
              <label>Effort de test dernier projet/itération (personnes/jours) :</label>
              <input type="number" id="test_effort">
              <button onclick="calculateRatio()">Calculer le ratio et estimer l'effort de test</button>
              <h4>Effort de test estimé pour le projet actuel :</h4>
              <label>Effort de développement projet/itération actuel (personnes/jours) :</label>
              <input type="number" id="current_dev_effort">
              <button onclick="calculateTestEffortForCurrentProject()">Estimer l'effort de test pour le projet actuel</button>
              <h4>Résultat :</h4>
              <p id="result"></p>
              <p id="current_test_effort_result"></p>
          `;
      break;
    case "extrapolation":
      formHTML = `
              <h3>Extrapolation</h3>
              <p class="definition">
                Dans cette technique basée sur les métriques, des mesures sont effectuées le plus tôt
                possible dans le projet en cours afin de recueillir les données. Lorsque l'on dispose de suffisamment
                d'observations, l'effort requis pour le reste du travail peut être estimé en extrapolant ces données.
                Cette méthode convient parfaitement aux cycles de vie de développement du logiciel itératifs.
              </p>
              <div id="iterations-container">
                <label>Effort de la première itération (heures) :</label>
                <input type="number" class="iteration-effort">
              </div>
              <button onclick="addIteration()">Ajouter une itération</button>
              <button onclick="calculateExtrapolation()">Calculer</button>
              <p id="result"></p>
          `;
      break;
    case "delphi":
      formHTML = `
              <h3>Delphi large bande</h3>
               <p class="definition">Dans cette technique itérative, basée sur l'expertise, des experts font des
                estimations basées sur l'expérience. Chaque expert, de manière isolée, évalue l'effort. Les résultats sont
                collectés et s'il y a des écarts par rapport aux limites convenues, les experts discutent de leurs
                estimations actuelles. Chaque expert est alors invité à faire une nouvelle estimation sur la base de ce
                feedback, toujours de manière isolée. Ce processus est répété jusqu'à ce qu'un consensus soit atteint. Le
                planning poker est une variante du Delphi large bande, couramment utilisé dans le développement
                logiciel Agile. Dans le Planning Poker, les estimations sont généralement réalisées à l'aide de cartes sur
                lesquelles figurent des chiffres représentant l'ampleur de l'effort.</p>
              <div id="experts-container">
                 <label>Estimation expert 1 :</label>
                 <input type="number" class="expert-input">
                 <label>Estimation expert 2 :</label>
                 <input type="number" class="expert-input">
                 <label>Estimation expert 3 :</label>
                 <input type="number" class="expert-input">
              </div>
               <button onclick="addExpert()">Ajouter un expert</button>
               <button onclick="calculateDelphi()">Calculer</button>
               <p id="result" style="font-weight: bold; color: red;"></p>
          `;
      break;
    case "three_point":
      formHTML = `
              <h3>Estimation à trois points</h3>
                <p class="definition">Dans cette technique basée sur l'expertise, trois estimations sont faites par
                des experts : l'estimation la plus optimiste (a), l'estimation la plus probable (m) et l'estimation la plus
                pessimiste (b). L'estimation finale (E) est leur moyenne arithmétique pondérée. Dans la version la plus
                répandue de cette technique, l'estimation est calculée comme suit : E = (a + 4*m + b) / 6. L'avantage de
                cette technique est qu'elle permet aux experts de calculer l'erreur de mesure : SD = (b - a) / 6. </p>
              <label>Estimation optimiste (a) :</label>
            <input type="number" id="optimistic">
            <label>Estimation pessimiste (b) :</label>
            <input type="number" id="pessimistic">
            <label>Estimation la plus probable (m) :</label>
            <input type="number" id="likely">
            <label>Voulez-vous calculer l'erreur de mesure (SD) ?</label>
            <select id="calculateSD">
              <option value="no">Non</option>
              <option value="yes">Oui</option>
            </select>
            <button onclick="calculateThreePoint()">Calculer</button>
            <p id="result" style="font-weight: bold;"></p>
          `;
      break;
  }

  formContainer.innerHTML = formHTML;
}
//calcul du ratio
function calculateRatio() {
  let devEffort = parseFloat(document.getElementById("dev_effort").value);
  let testEffort = parseFloat(document.getElementById("test_effort").value);

  if (devEffort && testEffort) {
    let ratio = (testEffort / devEffort) * 100;
    let resultText = `Le ratio de test / développement pour le dernier projet est de : ${ratio.toFixed(
      2
    )}%`;

    document.getElementById("result").innerText = resultText;
  } else {
    document.getElementById("result").innerText =
      "Veuillez entrer les valeurs valides pour l'effort de développement et l'effort de test.";
  }
}
//mise en page si recalcule de ration

// Estimation de l'effort de test pour le projet actuel
function calculateTestEffortForCurrentProject() {
  let currentDevEffort = parseFloat(
    document.getElementById("current_dev_effort").value
  );
  let ratio = parseFloat(
    document.getElementById("result").innerText.split(": ")[1].split("%")[0]
  );
  if (currentDevEffort && ratio) {
    let testEffortForCurrentProject = (currentDevEffort * ratio) / 100;
    // Arrondir à deux décimales
    testEffortForCurrentProject = testEffortForCurrentProject.toFixed(2);

    document.getElementById("current_test_effort_result").innerText =
      "Effort de test estimé pour le projet actuel : " +
      testEffortForCurrentProject +
      " personnes-jours";
  } else {
    document.getElementById("current_test_effort_result").innerText =
      "Veuillez entrer un effort de développement pour le projet actuel et calculer d'abord le ratio.";
  }
}

//calcul par extrapolation
function addIteration() {
  let container = document.getElementById("iterations-container");
  let iterationCount =
    container.getElementsByClassName("iteration-effort").length + 1;

  let newLabel = document.createElement("label");
  newLabel.textContent = `Effort de l'itération ${iterationCount} (heures) :`;

  let newInput = document.createElement("input");
  newInput.type = "number";
  newInput.className = "iteration-effort";

  container.appendChild(newLabel);
  container.appendChild(newInput);
}

function calculateExtrapolation() {
  let efforts = document.querySelectorAll(".iteration-effort");
  let totalEffort = 0;
  let count = 0;

  efforts.forEach((input) => {
    let value = parseFloat(input.value);
    if (!isNaN(value)) {
      totalEffort += value;
      count++;
    }
  });

  if (count === 0) {
    document.getElementById("result").innerText =
      "Veuillez entrer au moins une itération.";
    return;
  }

  let estimatedEffort = totalEffort / count;
  estimatedEffort = Math.round(estimatedEffort * 100) / 100; // Arrondi à 2 décimales

  document.getElementById("result").innerText =
    "Effort de test estimé pour la prochaine itération : " +
    estimatedEffort +
    " heures";
}

//deplphi range
function addExpert() {
  let container = document.getElementById("experts-container");
  let expertCount = container.getElementsByClassName("expert-input").length + 1;

  let newLabel = document.createElement("label");
  newLabel.textContent = `Estimation expert ${expertCount} :`;

  let newInput = document.createElement("input");
  newInput.type = "number";
  newInput.className = "expert-input";

  container.appendChild(newLabel);
  container.appendChild(newInput);
}

function calculateDelphi() {
  let expertInputs = document.querySelectorAll(".expert-input");
  let estimates = [];

  expertInputs.forEach((input) => {
    let value = parseFloat(input.value);
    if (!isNaN(value)) {
      estimates.push(value);
    }
  });

  if (estimates.length < 3) {
    document.getElementById("result").innerText =
      "Erreur : Au moins 3 experts sont requis pour l'estimation.";
    document.getElementById("result").style.color = "red";
    return;
  }

  let maxDiff = Math.max(...estimates) - Math.min(...estimates);

  if (maxDiff <= 5) {
    // Seuil de consensus ajustable
    let finalEstimate = (
      estimates.reduce((a, b) => a + b, 0) / estimates.length
    ).toFixed(2);
    document.getElementById("result").innerText =
      "✅ Consensus atteint ! Effort estimé : " + finalEstimate + " heures";
    document.getElementById("result").style.color = "green";
  } else {
    document.getElementById("result").innerText =
      "⚠️ Pas encore de consensus. Ajustez vos estimations et refaites le calcul.";
    document.getElementById("result").style.color = "orange";
  }
}

//Calcul à trois points
function calculateThreePoint() {
  let optimistic = parseFloat(document.getElementById("optimistic").value);
  let pessimistic = parseFloat(document.getElementById("pessimistic").value);
  let likely = parseFloat(document.getElementById("likely").value);
  let calculateSD = document.getElementById("calculateSD").value;

  if (isNaN(optimistic) || isNaN(pessimistic) || isNaN(likely)) {
    document.getElementById("result").innerText =
      "⚠️ Erreur : Veuillez remplir tous les champs avec des valeurs numériques.";
    document.getElementById("result").style.color = "red";
    return;
  }

  // Convertir en nombre pour éviter les erreurs
  let testEffort = parseFloat(
    ((optimistic + 4 * likely + pessimistic) / 6).toFixed(2)
  );
  let resultText = `Effort de test estimé : ${testEffort} heures`;

  if (calculateSD === "yes") {
    let sd = parseFloat(((pessimistic - optimistic) / 6).toFixed(2));
    let minEffort = parseFloat((testEffort - sd).toFixed(2));
    let maxEffort = parseFloat((testEffort + sd).toFixed(2));

    resultText += `\nErreur de mesure (SD) : ±${sd} heures\nIntervalle estimé : entre ${minEffort} et ${maxEffort} heures.`;
  }

  document.getElementById("result").innerText = resultText;
  document.getElementById("result").style.color = "green";
}
