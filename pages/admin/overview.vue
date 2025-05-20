<template>
  <PageContainer>
    <PageTitle :title="routes.admin.AdminOverview.title" />
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-2">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <span>{{ data.users }}</span>
              </h3>
              <div>Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-2">
        <div class="fr-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <span>{{ data.structures }}</span>
              </h3>
              <div>Structures</div>
            </div>
          </div>
        </div>
      </div>

      <div class="fr-col-12">
        <form
          novalidate
          @submit.prevent="migrate"
        >
          <div>
            <label for="structure-id">Identifiant de la structure</label>
            <input
              v-model="structureId"
              class="fr-input"
              name="structure-id"
            />
          </div>

          <div>
            <input
              v-model="migrateAll"
              type="checkbox"
              name="migrate-all"
            />
            <label for="migrate-all">Migrer tous les champs</label>
          </div>

          <div>
            <input
              v-model="migrateBirthDate"
              type="checkbox"
              name="migrate-birth-date"
            />
            <label for="migrate-birth-date"
              >Migrer champ date de naissance</label
            >
          </div>

          <div>
            <input
              v-model="migrateBirthDateAndFileOpeningDate"
              type="checkbox"
              name="migrate-birth-date-file-opening-date"
            />
            <label for="migrate-birth-date-file-opening-date"
              >Migrer champ date de naissance et date d'ouverture du
              dossier</label
            >
          </div>

          <button
            class="fr-btn fr-btn--secondary"
            type="submit"
          >
            Migration des dates de la structure
          </button>
        </form>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
  import { routes } from '~/utils/routes'

  definePageMeta({
    name: routes.admin.AdminOverview.name
  })

  const data = await useTrpcClient().admin.getOverview.query()

  const structureId = ref('')
  const migrateAll = ref(false)
  const migrateBirthDate = ref(false)
  const migrateBirthDateAndFileOpeningDate = ref(false)

  async function migrate() {
    console.log(
      'in migrate',
      structureId.value,
      migrateAll.value,
      migrateBirthDate.value,
      migrateBirthDateAndFileOpeningDate.value
    )
    await $fetch(`/api/migrate`, {
      method: 'POST',
      body: {
        structureId: structureId.value,
        migrateAll: migrateAll.value,
        migrateBirthDate: migrateBirthDate.value,
        migrateBirthDateAndFileOpeningDate:
          migrateBirthDateAndFileOpeningDate.value
      }
    })
  }
</script>
