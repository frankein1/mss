// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['**/playwright-report/'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      'vue/html-self-closing': 'off',
      'vue/return-in-computed-property': 'off',
      'nuxt/prefer-import-meta': 'off',
      // rules set
      'no-console': 'warn',
      'curly': ['error', 'all'],
      'no-else-return': ['error', { allowElseIf: false }],
      'vue/require-default-prop': 'warn',
      'vue/no-required-prop-with-default': 'error',
      'vue/no-unused-emit-declarations': 'warn',
      'vue/no-unused-properties': 'warn',
      'no-warning-comments': [
        'warn',
        { terms: ['todo', 'fixme'], location: 'anywhere' }
      ]
    }
  },
  {
    files: ['server/**/*.ts', 'scheduler/**/*.ts'],
    rules: {
      /** Prisma writing rules */
      'no-restricted-syntax': [
        'warn',
        {
          // Disallow include selector for use in queries like prismaClient.user.findMany({...})
          selector:
            'CallExpression[callee.object.object.name="prismaClient"] Property[key.name="include"]',
          message:
            'Avoid `include` on Prisma queries. Please use `select` instead to avoid overfetching and performance issues.'
        },
        {
          // Disallow include selector for use in queries like UserRepo.findMany({...})
          selector:
            'CallExpression[callee.object.name=/Repo$/] Property[key.name="include"]',
          message:
            'Avoid `include` on Prisma queries. Please use `select` instead to avoid overfetching and performance issues.'
        },
        {
          // Disallow include selector for use in queries like UserRepo.prisma.findMany({...})
          selector:
            'CallExpression[callee.object.object.name=/Repo$/][callee.object.property.name="prisma"] Property[key.name="include"]',
          message:
            'Avoid `include` on Prisma queries. Please use `select` instead to avoid overfetching and performance issues.'
        }
      ]
    }
  }
)
