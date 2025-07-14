import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.config.*'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },
  prettierConfig,
];
