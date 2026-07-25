import importX from "eslint-plugin-import-x";

export default [
  {
    files: ["**/*.js"],
    plugins: {
      "import-x": importX,
    },
    rules: {
      "import-x/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
          fix: true,
        },
      ],
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
