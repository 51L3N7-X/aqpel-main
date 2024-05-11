/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/customNext.js"],
  parserOptions: {
    project: true,
  },
  rules: {
    "no-confusing-arrow": "off",
    "implicit-arrow-linebreak": "off",
    "react/jsx-curly-newline": "off",
    "function-paren-newline": "off",
    "react/jsx-indent": "off",
    "@typescript-eslint/indent": "off",
    "react/jsx-one-expression-per-line": "off",
  },
};
