module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    'curly': ['error', 'all'],
    'no-else-return': ['error', { allowElseIf: false }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '_', varsIgnorePattern: '_' }
    ]
  }
}
