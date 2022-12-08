module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // contains rules that specifically require type information
    // "plugin:@next/next/recommended",
    // "next", // https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/package.json
    // "next/core-web-vitals",
  ],
  settings: {
    propWrapperFunctions: [
      "forbidExtraProps",
      {
        property: "freeze",
        object: "Object",
      },
      {
        property: "myFavoriteWrapper",
      },
    ],
    linkComponents: [
      "Hyperlink",
      {
        name: "Link",
        linkAttribute: "to",
      },
    ],
    react: {
      version: "detect",
    },
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "prettier/prettier": "error",
    "react/display-name": 0,
    "react/prop-types": "off",
  },
  ignorePatterns: [
    ".eslintrc.js",
    "jest.config.js",
    "next.config.js",
    "tailwind.config.js",
    "prettier.config.js",
    "postcss.config.js",
  ],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {},
}
