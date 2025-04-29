import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],

    languageOptions: {
      parser: svelte.parser,
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/", "static/yivi/"],
  },
  {
    plugins: {
      "@typescript-eslint": ts.plugin,
    },
  },
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
);
