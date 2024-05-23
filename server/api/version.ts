export default defineEventHandler(() => {
  const version = process.env.NUXT_PUBLIC_VERSION_COMMIT_SHA

  return { version }
})
