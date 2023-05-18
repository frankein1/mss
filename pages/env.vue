<template>
  <div class="fr-container">
    <h1>Variables d'environnement</h1>
    <section>
      <h2>Variables publiques</h2>
      <ul>
        <li>
          <div>
            <span class="env-label fr-pr-2w">URL</span><span>{{ appUrl }}</span>
          </div>
        </li>
      </ul>
      <h2>Inclusion Connect</h2>
      <ul>
        <li>
          <div>
            <span class="env-label fr-pr-2w">Client</span
            ><span>{{ clientId }}</span>
          </div>
        </li>
        <li>
          <div>
            <span class="env-label fr-pr-2w">Issuer</span
            ><span>{{ issuer }}</span>
          </div>
        </li>
        <li>
          <div>
            <span class="env-label fr-pr-2w">Provider</span
            ><span>{{ provider }}</span>
          </div>
        </li>
        <li>
          <div>
            <span class="env-label fr-pr-2w">Type</span><span>{{ type }}</span>
          </div>
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
  const {
    appUrl,
    inclusionConnect: { clientId, issuer, provider, type }
  } = config.public

  if (process.server) {
    // eslint-disable-next-line no-console
    console.log('JWT_KEY:', config.jwtKey)
    // eslint-disable-next-line no-console
    console.log('IC_CLIENT_SECRET:', config.inclusionConnectSecret)
    // eslint-disable-next-line no-console
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
  }
</script>

<style lang="scss" scoped>
  .env-label {
    font-weight: bold;
  }
</style>
