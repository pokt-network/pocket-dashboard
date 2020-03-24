module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    "no-console": "warn",
    "comma-spacing": "error",
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
  extends: [
    "react-app",
    "plugin:react/recommended",
  ]
};
