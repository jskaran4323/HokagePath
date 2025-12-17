import { defineConfig } from "eslint/config";

export default defineConfig([
  // JS + React
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
      globals: { window: true, document: true },
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    rules: {},
    settings: {
      react: { version: "detect" },
    },
  },

  // TS + React
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
    },
    // Instead of importing plugin, just use the recommended rules via extends
    extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
    settings: {
      react: { version: "detect" },
    },
  },
]);
