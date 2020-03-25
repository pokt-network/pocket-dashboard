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
    eqeqeq: "error",
    "no-alert": "error",
    curly: "error",
    "brace-style": ["error", "1tbs"],
    "object-curly-spacing": ["error", "never"],
    "function-call-argument-newline": ["error", "never"],
    "one-var-declaration-per-line": ["error", "always"],
    "padding-line-between-statements": ["error",
      {blankLine: "always", prev: ["const", "let", "var"], next: "*"},
      {blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]}
    ]
  },
  extends: [
    "react-app",
    "plugin:react/recommended",
  ]
};
