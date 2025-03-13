export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        console: "readonly",
        event: "readonly", // Ajout de 'event'
        setTimeout: "readonly", // Ajout de 'setTimeout'
        clearTimeout: "readonly", // Ajout de 'clearTimeout'
        setInterval: "readonly", // Ajout de 'setInterval'
        clearInterval: "readonly", // Ajout de 'clearInterval'
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      eqeqeq: "warn",
    },
  },
];
