import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    name: "ignore-globally",
    ignores: [
      "**/node_modules",
      "**/.turbo",
      "**/dist",
    ],
  },
  ...tseslint.configs.recommended,
  {
    name: "apps/api",
    files: [
      "apps/api/src/**/*.ts",
      "apps/api/test/**/*.ts",
    ],
    languageOptions: {
      parserOptions: {
        project: "./apps/api/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
);
