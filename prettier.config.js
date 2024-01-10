// prettier.config.js
module.exports = {
  plugins: ["prettier-plugin-solidity"],
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: "*.sol",
      options: {
        tabWidth: 4
      }
    }
  ]
};
