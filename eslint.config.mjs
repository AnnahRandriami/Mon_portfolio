export default [
  {
    languageOptions: {
      ecmaVersion: "latest", // Utilise la dernière version d'ECMAScript
      sourceType: "module", // Permet l'utilisation des modules ES6
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
        event: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        navigator: "readonly",
        process: "readonly", // Ajout de 'process'
      },
    },
    rules: {
      "no-undef": "error", // Erreur pour les variables non définies
      "no-unused-vars": "warn", // Avertissement pour les variables inutilisées
      semi: ["error", "always"], // Utilise des points-virgules
      quotes: ["error", "double"], // Utilise des guillemets doubles
      eqeqeq: "warn", // Avertissement sur l'utilisation de "==" au lieu de "==="
    },
  },
];
