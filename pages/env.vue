<template>
  <div class="fr-container">
    <h1>Variables d'environnement</h1>
    <section>
      <h2>Variables publiques</h2>
      <ul>
        <li>
          <span class="env-label fr-pr-2w">URL</span><span>{{ appUrl }}</span>
        </li>
        <li>
          <span class="env-label fr-pr-2w">Environnement</span
          ><span>{{ mssEnvironment }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'landing'
  })
  const config = useRuntimeConfig()
  const { appUrl, mssEnvironment } = config.public

  if (process.server) {
    const { s3, auth, email } = config
    // eslint-disable-next-line no-console
    console.log('s3:', JSON.stringify(s3, undefined, 2))
    // eslint-disable-next-line no-console
    console.log('auth:', JSON.stringify(auth, undefined, 2))
    // eslint-disable-next-line no-console
    console.log('email:', JSON.stringify(email, undefined, 2))
    // eslint-disable-next-line no-console
    console.log('database:', process.env.DATABASE_URL)
  }
</script>

<style lang="scss" scoped>
  .env-label {
    font-weight: bold;
  }
</style>
