module.exports = {
  env: {
    es6: true,
    mocha: true,
    node: true,
    mongo: true
  },
  rules: {
    "no-console": "warn",
    "comma-spacing": "error",
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
  extends: [
    "eslint:recommended",
  ],
  parser: "babel-eslint"
};
