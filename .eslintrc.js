module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
    // 开启一些 TS 规则
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    // 开启 prettier 自动修复功能
    'prettier/prettier': 'error',
    'vue/valid-template-root': 'off',
    'no-debugger': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
