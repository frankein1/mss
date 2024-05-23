export default defineEventHandler(() => {
  // const version = process.env.NUXT_PUBLIC_VERSION_COMMIT_SHA
  const version = process.env.SOURCE_VERSION

  return { version }
})
