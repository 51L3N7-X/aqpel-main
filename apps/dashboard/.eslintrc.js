/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@repo/eslint-config/customNext.js",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  parserOptions: {
    project: true,
  },
};
