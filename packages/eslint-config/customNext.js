const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "airbnb-base",
    "next/core-web-vitals", // Needed to avoid warning in next.js build: 'The Next.js plugin was not detected in your ESLint configuration'
    "plugin:prettier/recommended",
    "eslint-config-turbo",
    "plugin:tailwindcss/recommended",
    "airbnb",
    "airbnb-typescript",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        doubleQuote: true,
        endOfLine: "auto",
      },
    ], // Avoid conflict rule between Prettier and Airbnb Eslint
    "import/extensions": "off", // Avoid missing file extension errors, TypeScript already provides a similar feature
    "react/function-component-definition": "off", // Disable Airbnb's specific function type
    "react/destructuring-assignment": "off", // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    "react/require-default-props": "off", // Allow non-defined react props as undefined
    "react/jsx-props-no-spreading": "off", // _app.tsx uses spread operator and also, react-hook-form
    "@typescript-eslint/comma-dangle": "off", // Avoid conflict rule between Eslint and Prettier
    "@typescript-eslint/consistent-type-imports": "error", // Ensure `import type` is used when it's necessary
    "no-restricted-syntax": [
      "error",
      "ForInStatement",
      "LabeledStatement",
      "WithStatement",
    ], // Overrides Airbnb configuration and enable no-restricted-syntax
    "import/prefer-default-export": "off", // Named export is easier to refactor automatically
    "simple-import-sort/imports": "error", // Import configuration for `eslint-plugin-simple-import-sort`
    "simple-import-sort/exports": "error", // Export configuration for `eslint-plugin-simple-import-sort`
    "import/order": "off", // Avoid conflict rule between `eslint-plugin-import` and `eslint-plugin-simple-import-sort`
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    quotes: "off",
    "@typescript-eslint/quotes": "off",
    "linebreak-style": "off",
    "no-confusing-arrow": "off",
    "implicit-arrow-linebreak": "off",
    "react/jsx-curly-newline": "off",
    "function-paren-newline": "off",
    "react/jsx-indent": "off",
    "@typescript-eslint/indent": "off",
    "react/jsx-one-expression-per-line": "off",
    "operator-linebreak": "off",
    "no-param-reassign": ["error", { props: false }],
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: [
    // "only-warn",
    "@typescript-eslint",
    "unused-imports",
    "tailwindcss",
    "simple-import-sort",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    ".next/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
