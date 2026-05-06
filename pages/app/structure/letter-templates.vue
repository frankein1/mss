<template>
  <div>
    <div class="fr-container content fr-pb-5w">
      <AtomBreadcrumb
        :links="breadcrumbs.structure.AppStructureLetterTemplates()"
      />

      <PageTitle title="Configurer les courriers automatiquement pré-remplis" />

      <!-- Explications -->
      <section class="feature-section fr-mb-4w">
        <div class="fr-p-4w">
          <h2 class="fr-h5 title-blue fr-mb-2w">
            Qu'est-ce que c'est ? Comment faire ?
          </h2>
          <p class="fr-text--bold fr-mb-1w">
            Générez des courriers pré-remplis suite à l'acceptation ou le refus
            d'une instruction de dossier
          </p>
          <p class="fr-mb-3w">
            Ce sont des documents Word (.docx) qui sont automatiquement
            complétés avec les données issues de Mon Suivi Social (données des
            bénéficiaires et données indiquées dans l'instruction de dossier).
            Vous pouvez par exemple créer des courriers de notification
            d'acceptation ou de refus d'aides. Ils seront disponibles depuis
            l'aperçu de l'instruction dans l'historique du bénéficiaire.
          </p>

          <div class="fr-accordion">
            <h3 class="fr-accordion__title">
              <button
                class="fr-accordion__btn"
                type="button"
                aria-expanded="false"
                aria-controls="accordion-formatting"
              >
                Comment formater mon document
              </button>
            </h3>
            <div
              id="accordion-formatting"
              class="fr-collapse"
            >
              <p class="fr-mb-2w">
                Ouvrez le courrier que vous envoyez habituellement. Remplacez
                les termes qui ont besoin d'être pré-remplis (par exemple le nom
                du bénéficiaire, le montant de l'aide accordé…) avec les
                correspondances de formatage détaillées dans le fichier
                ci-dessous.
              </p>
              <ul class="fr-links-group">
                <li>
                  <a
                    class="fr-link fr-icon-download-line fr-link--icon-left"
                    href="/documents/fichier-de-formatage-courriers.docx"
                    download
                  >
                    Télécharger le fichier de formatage
                  </a>
                </li>
                <li>
                  <a
                    class="fr-link fr-icon-download-line fr-link--icon-left"
                    href="/documents/exemple-courrier-mss.docx"
                    download
                  >
                    Télécharger un exemple de courrier
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Documents de la structure -->
      <section class="feature-section fr-p-4w">
        <h2 class="fr-h5 title-blue fr-mb-3w">Les documents de ma structure</h2>

        <AtomLoader
          v-if="status === 'pending'"
          class="fr-mx-auto"
        />
        <AtomAlert
          v-else-if="error"
          :alert-type="AlertType.Error"
          message="Les modèles de courriers n'ont pas pu être chargés."
        />
        <LetterTemplateList
          v-else
          :templates="templates"
          @refresh="refresh"
        />
      </section>
    </div>

    <AtomActionsBar>
      <ul
        class="fr-btns-group fr-btns-group--lg fr-btns-group--inline-md fr-btns-group--right"
      >
        <li>
          <button
            class="fr-btn fr-btn--secondary"
            type="button"
            @click="onCancel"
          >
            Annuler
          </button>
        </li>
        <li>
          <NuxtLink
            class="fr-btn"
            :to="routes.structure.AppStructure.path()"
          >
            Valider
          </NuxtLink>
        </li>
      </ul>
    </AtomActionsBar>
  </div>
</template>

<script setup lang="ts">
  import { AlertType } from '~/utils/constants/alert'
  import { routes } from '~/utils/routes'
  import { breadcrumbs } from '~/utils/breadcrumbs'

  useHead({ title: routes.structure.AppStructureLetterTemplates.title })

  const trpcClient = useTrpcClient()

  const { data, error, status, refresh } =
    await trpcClient.letterTemplate.list.useQuery()

  const templates = computed(() => data.value ?? [])

  function onCancel() {
    navigateTo(routes.structure.AppStructure.path())
  }
</script>
