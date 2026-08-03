// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

/**
 * Interactive-transaction ancestor selector.
 *
 * Matches any node inside a `.$transaction(async (tx) => { ... })` callback,
 * regardless of the callback parameter name.
 *
 * Scoped to the interactive form (arg 0 is a function) so it doesn't double-fire
 * on the array form `.$transaction([...])`, whose inner calls are already covered
 * by the receiver-anchored selectors (prismaClient.* / *Repo.* / *Repo.prisma.*).
 */
const INTERACTIVE_TX_ANCESTOR =
  'CallExpression[callee.property.name="$transaction"][arguments.0.type=/FunctionExpression$/]'

const prismaIncludeSelectors = [
  // Matches prismaClient.<model>.<method>({include: {...}})
  'CallExpression[callee.object.object.name="prismaClient"] Property[key.name="include"]',
  // Matches *Repo.<method>({include: {...}})
  'CallExpression[callee.object.name=/Repo$/] Property[key.name="include"]',
  // Matches *Repo.prisma.<method>({include: {...}})
  'CallExpression[callee.object.object.name=/Repo$/][callee.object.property.name="prisma"] Property[key.name="include"]',
  // Matches *.$transaction(async (tx) => {include: {...}})
  `${INTERACTIVE_TX_ANCESTOR} Property[key.name="include"]`
]

/**
 * Prevent Prisma `include`, favor `select` to avoid overfetching.
 *
 * Matches: prismaClient.<model>.<method>(...), *Repo.<method>(...),
 * *Repo.prisma.<method>(...), and any call inside an interactive $transaction.
 */
const prismaIncludeRestrictions = prismaIncludeSelectors.map(selector => ({
  selector,
  message:
    'Avoid `include` on Prisma queries — use `select` and enumerate only the fields you need. If you have a genuinely new legitimate case, add an `eslint-disable-next-line no-restricted-syntax` comment with a one-line justification and flag it for review.'
}))

const encryptedDataKeySelectors = [
  'CallExpression[callee.object.object.name="prismaClient"] Property[key.name="select"] Property[key.name="encryptedDataKey"]',
  'CallExpression[callee.object.name=/Repo$/] Property[key.name="select"] Property[key.name="encryptedDataKey"]',
  'CallExpression[callee.object.object.name=/Repo$/][callee.object.property.name="prisma"] Property[key.name="select"] Property[key.name="encryptedDataKey"]',
  `${INTERACTIVE_TX_ANCESTOR} Property[key.name="select"] Property[key.name="encryptedDataKey"]`,
  'CallExpression[callee.object.object.name="prismaClient"] Property[key.name="omit"] Property[key.name="encryptedDataKey"]',
  'CallExpression[callee.object.name=/Repo$/] Property[key.name="omit"] Property[key.name="encryptedDataKey"]',
  'CallExpression[callee.object.object.name=/Repo$/][callee.object.property.name="prisma"] Property[key.name="omit"] Property[key.name="encryptedDataKey"]',
  `${INTERACTIVE_TX_ANCESTOR} Property[key.name="omit"] Property[key.name="encryptedDataKey"]`
]

/**
 * Forbid access to Document.encryptedDataKey for security reasons.
 *
 * The Prisma client omits it by default (see server/prisma/prismaClient.ts).
 * These rules block the two ways to re-expose it:
 * - `select: { encryptedDataKey: true }`
 * - `omit: { encryptedDataKey: false }`
 *
 * across four call shapes: prismaClient.*, *Repo.*, *Repo.prisma.*,
 * and any call inside an interactive $transaction.
 *
 * Not covered: raw queries (`$queryRaw`, `$queryRawUnsafe`, `$executeRaw*`)
 */
const encryptedDataKeyRestrictions = encryptedDataKeySelectors.map(
  selector => ({
    selector,
    message:
      'Access to Document.encryptedDataKey is forbidden. The Prisma client omits this field by default (server/prisma/prismaClient.ts). Do not `select` it or `omit: false` it. If you have a genuinely new legitimate case, add an `eslint-disable-next-line no-restricted-syntax` comment with a one-line justification and flag it for security review.'
  })
)

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
      'no-restricted-syntax': [
        'warn',
        ...prismaIncludeRestrictions,
        ...encryptedDataKeyRestrictions
      ]
    }
  }
)
