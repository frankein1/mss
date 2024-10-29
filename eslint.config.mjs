// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['**/playwright-report/'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    'vue/html-self-closing': 'off',
    'vue/return-in-computed-property': 'off',
    'nuxt/prefer-import-meta': 'off',
    // rules set
    'no-console': 'warn',
    'import/no-named-as-default-member': 'error',
    'curly': ['error', 'all'],
    'no-else-return': ['error', { allowElseIf: false }]
  }
})
