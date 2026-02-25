<script>
    // Données initiales
    let joueurs = [
      { id: 1, nom: "Joueur 1", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#ff6b6b" },
      { id: 2, nom: "Joueur 2", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#4ecdc4" },
      { id: 3, nom: "Joueur 3", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#ffe66d" },
      { id: 4, nom: "Joueur 4", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#a55eea" },
      { id: 5, nom: "Joueur 5", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#f78fb3" },
      { id: 6, nom: "Joueur 6", or: 5, influence: 3, connaissance: 2, corruption: 0, territoires: [], couleur: "#81ecec" }
    ];

    let territoires = [
      { id: "citadelle", nom: "Citadelle des Lamentations", controle: "neutre", etat: "intact", avantage: "+2 en défense", dilemme: "Les esprits demandent vengeance.", options: ["Aider (artefact)", "Bannir (hanté)"], risque: "", icone: "icones/citadelle.png", adjacents: ["foret", "montagnes"] },
      { id: "foret", nom: "Forêt des Murmures", controle: "neutre", etat: "intact", avantage: "Unités furtives", dilemme: "Un druide propose un pacte.", options: ["Accepter (+2 corruption)", "Refuser (hostile)"], risque: "", icone: "icones/foret.png", adjacents: ["citadelle", "marais", "plaines"] },
      // Ajoute les autres territoires ici...
    ];

    let phaseActuelle = 0;
    let tourActuel = 1;
    let evenementActuel = null;

    // Initialisation
    function initCampagne() {
      afficherJoueurs();
      afficherTerritoires();
      afficherRessourcesGlobales();
      majLog(`--- Tour ${tourActuel} : Début de la campagne ---`);
    }

    // Affichage des joueurs
    function afficherJoueurs() {
      const container = document.getElementById("joueurs");
      if (!container) return;
      container.innerHTML = "";
      joueurs.forEach(joueur => {
        const div = document.createElement("div");
        div.className = "joueur";
        div.style.borderLeft = `5px solid ${joueur.couleur}`;
        div.innerHTML = `
          <h3>${joueur.nom}</h3>
          <p><strong>Or:</strong> <span id="or-${joueur.id}">${joueur.or}</span></p>
          <p><strong>Influence:</strong> <span id="influence-${joueur.id}">${joueur.influence}</span></p>
          <p><strong>Connaissance:</strong> <span id="connaissance-${joueur.id}">${joueur.connaissance}</span></p>
          <p><strong>Corruption:</strong> <span id="corruption-${joueur.id}">${joueur.corruption}/10</span></p>
          <p><strong>Territoires:</strong> <span id="territoires-${joueur.id}">${joueur.territoires.length}</span></p>
        `;
        container.appendChild(div);
      });
    }

    // Affichage des territoires
    function afficherTerritoires() {
      const container = document.getElementById("territoires");
      if (!container) return;
      container.innerHTML = "";
      territoires.forEach(territoire => {
        const div = document.createElement("div");
        div.id = territoire.id;
        div.className = `territoire ${territoire.controle}`;
        div.onclick = () => ouvrirDilemme(territoire.id); // Rendre cliquable
        div.innerHTML = `
          <h3>${territoire.nom}</h3>
          <img src="${territoire.icone}" alt="${territoire.nom}" class="icone-territoire">
          <p><strong>Contrôlé par:</strong> <span id="controle-${territoire.id}">${territoire.controle === "neutre" ? "Neutre" : `Joueur ${territoire.controle}`}</span></p>
          <p><strong>État:</strong> <span id="etat-${territoire.id}">${territoire.etat}</span></p>
          <div class="avantage">
            <input type="checkbox" id="avantage-${territoire.id}" ${territoire.etat === "actif" ? "checked" : ""} disabled>
            <label for="avantage-${territoire.id}">${territoire.avantage}</label>
          </div>
          <div class="dilemme">
            <p><strong>Dilemme:</strong> ${territoire.dilemme}</p>
            ${territoire.options.map((option, i) => `
              <button onclick="event.stopPropagation(); resoudreDilemme('${territoire.id}', ${i})" id="option-${territoire.id}-${i}">${option}</button>
            `).join("")}
          </div>
          <p class="risque" id="risque-${territoire.id}">${territoire.risque}</p>
        `;
        container.appendChild(div);
      });
    }

    // Ouvre le dilemme d'un territoire
    function ouvrirDilemme(territoireId) {
      alert(`Dilemme pour ${territoires.find(t => t.id === territoireId).nom}`);
    }

    // Résout un dilemme
    function resoudreDilemme(territoireId, optionIndex) {
      const territoire = territoires.find(t => t.id === territoireId);
      const joueurActuel = joueurs[0]; // À adapter selon le joueur actuel

      // Désactive les boutons
      territoire.options.forEach((_, i) => {
        const bouton = document.getElementById(`option-${territoireId}-${i}`);
        if (bouton) bouton.disabled = true;
      });

      // Applique l'effet du dilemme
      switch(territoireId) {
        case "citadelle":
          if (optionIndex === 0) {
            territoire.etat = "allié";
            territoire.risque = "Aucun.";
            joueurActuel.corruption += 0;
          } else {
            territoire.etat = "hanté";
            territoire.risque = "Unité spectrale chaque tour.";
            joueurActuel.corruption += 1;
          }
          break;
        // Ajoute les autres cas ici...
      }

      // Met à jour le contrôle
      territoire.controle = joueurActuel.id;
      joueurActuel.territoires.push(territoireId);

      // Met à jour l'affichage
      document.getElementById(`controle-${territoireId}`).textContent = `Joueur ${joueurActuel.id}`;
      document.getElementById(`etat-${territoireId}`).textContent = territoire.etat;
      document.getElementById(`risque-${territoireId}`).textContent = territoire.risque;
      document.getElementById(`territoires-${joueurActuel.id}`).textContent = joueurActuel.territoires.length;
    }

    // Mise à jour du log
    function majLog(message) {
      const log = document.getElementById("log");
      if (!log) return;
      log.innerHTML += `<p>> ${message}</p>`;
      log.scrollTop = log.scrollHeight;
    }

    // Initialisation au chargement
    window.onload = initCampagne;
  </script>

