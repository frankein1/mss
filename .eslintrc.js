module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier'],
  rules: {
    'curly': ['error', 'multi-line'],
    'no-else-return': ['error', { allowElseIf: false }]
  }
}
