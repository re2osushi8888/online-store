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
      // "no-restricted-syntax": [
      //   "error",
      //   {
      //     "selector": "VariableDeclarator[id.name='abcdefg']",
      //     "message": "変数名 'abcdefg' は使用できません。より意味のある名前を使用してください。"
      //   },
      //   {
      //     "selector": "Identifier[name='abcdefg']",
      //     "message": "識別子 'abcdefg' は使用できません。より意味のある名前を使用してください。"
      //   }
      // ],
    },
  },
);
