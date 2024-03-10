const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
    "airbnb-typescript",
  ],
  plugins: [
    "jest",
    "jest-formatting",
    "security",
    "prettier",
    "@typescript-eslint",
  ],
  parserOptions: {
    project,
  },
  rules: {
    "no-console": "error",
    "func-names": "off",
    "no-underscore-dangle": "off",
    "consistent-return": "off",
    "jest/expect-expect": "off",
    "security/detect-object-injection": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "import/no-default-export": "off",
  },
  files: ["**/*.ts"],
};
