module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [
    "@babel/transform-runtime",
    "@babel/plugin-syntax-bigint",
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          test: "./test",
        },
      },
    ],
  ],
};
