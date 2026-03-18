// eslint.config.cjs
const tseslint = require('typescript-eslint');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'build'], // replaces .eslintignore
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'prettier/prettier': 'error',
    },
  }
);
