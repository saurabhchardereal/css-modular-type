const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

/** @type {import('@types/eslint').Linter.FlatConfig} */
module.exports = [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2021,
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsEslintPlugin.configs.recommended.rules,
      ...tsEslintPlugin.configs["recommended-requiring-type-checking"].rules,
    },
  },
];
