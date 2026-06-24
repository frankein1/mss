import type { GeoJsonProperties, MultiPolygon } from 'geojson'
import { point } from '@turf/helpers'
import { booleanPointInPolygon } from '@turf/turf'

import rawEtblissementsCreteilWithAddress from './fr-en-adresse-et-geolocalisation-etablissements-premier-et-second-degre – CRETEIL.json'
import rawEtblissementsCreteilEp from './fr-en-etablissements-ep - CRETEIL.json'
// import rawEtblissementsCreteil from './fr-en-annuaire-education - CRETEIL.json'
// import rawGeojsonData from './QP2024_France_hexagonale_LB93.json'
import rawGeojsonData from './qpv-2024.json'

interface Position {
  lon: number
  lat: number
}

type EtablissementBase = {
  code_departement: string
  code_region: string
  code_academie: string
  code_commune: string
  libelle_departement: string
  libelle_region: string
  libelle_academie: string
  position: Position
  latitude: number
  longitude: number
}

type EtablissementWithAddress = EtablissementBase & {
  numero_uai: string
  appellation_officielle: string
  denomination_principale: string
  patronyme_uai: string
  secteur_public_prive_libe: string
  adresse_uai: string
  lieu_dit_uai: string | null
  boite_postale_uai: string | null
  code_postal_uai: string
  localite_acheminement_uai: string
  libelle_commune: string
  coordonnee_x: number
  coordonnee_y: number
  epsg: string
  appariement: string
  localisation: string
  nature_uai: number
  nature_uai_libe: string
  etat_etablissement: number
  etat_etablissement_libe: string
  secteur_prive_code_type_contrat: number
  secteur_prive_libelle_type_contrat: string
  code_ministere: string
  libelle_ministere: string
  date_ouverture: string
  sigle: string
  rnb: string
}

type EtablissementWithEp = EtablissementBase & {
  uai: string
  ep_2022_2023: string
  nom_etablissement: string
  type_etablissement: string
  statut_public_prive: string
  nom_commune: string
  uai_tete_de_reseau: string
  qp_a_proximite_o_n: string
  qp_a_proximite: string
  nom_du_qp: string
  nombre_d_eleves: number | null
  code_postal: string
  libelle_nature: string
  code_nature: number
}

// type Etablissement = EtablissementBase & {
//   identifiant_de_l_etablissement: string
//   nom_etablissement: string
//   type_etablissement: string
//   statut_public_prive: string
//   adresse_1: string
//   adresse_2: string | null
//   adresse_3: string
//   code_postal: string
//   nom_commune: string
//   ecole_maternelle: number
//   ecole_elementaire: number
//   voie_generale: number | null
//   voie_technologique: number | null
//   voie_professionnelle: number | null
//   telephone: string
//   fax: string | null
//   web: string | null
//   mail: string
//   restauration: number
//   hebergement: number
//   ulis: number
//   apprentissage: number | null
//   segpa: number | null
//   section_arts: number | null
//   section_cinema: number | null
//   section_theatre: number | null
//   section_sport: number | null
//   section_internationale: number | null
//   section_europeenne: number | null
//   lycee_agricole: number | null
//   lycee_militaire: number | null
//   lycee_des_metiers: number | null
//   post_bac: number | null
//   appartenance_education_prioritaire: string | null
//   greta: string | null
//   siren_siret: string
//   fiche_onisep: string | null
//   type_contrat_prive: string
//   coordx_origine: number
//   coordy_origine: number
//   epsg_origine: string
//   nom_circonscription: string
//   precision_localisation: string
//   date_ouverture: string
//   date_maj_ligne: string
//   etat: string
//   ministere_tutelle: string
//   multi_uai: number
//   rpi_concentre: number
//   rpi_disperse: number | null
//   code_nature: number
//   libelle_nature: string
//   code_type_contrat_prive: string
//   pial: string | null
//   etablissement_mere: string | null
//   type_rattachement_etablissement_mere: string | null
//   code_circonscription: string
//   code_zone_animation_pedagogique: string | null
//   libelle_zone_animation_pedagogique: string | null
//   code_bassin_formation: string | null
//   libelle_bassin_formation: string | null
// }

interface GeoJSONCollection {
  type: 'FeatureCollection'
  features: {
    type: 'Feature'
    properties: GeoJsonProperties
    geometry: MultiPolygon
  }[]
}

const etblissementsCreteilWithAddress =
  rawEtblissementsCreteilWithAddress as EtablissementWithAddress[]
const etblissementsCreteilEp =
  rawEtblissementsCreteilEp as EtablissementWithEp[]

const findFeatureAtPosition = (
  position: Position,
  collection: GeoJSONCollection
) => {
  const pt = point([position.lon, position.lat])
  return collection.features.find(feature => booleanPointInPolygon(pt, feature))
}

function comparePositions() {
  const addressByUai = new Map(
    etblissementsCreteilWithAddress.map(e => [e.numero_uai, e])
  )
  let nonPositionMatchingcount = 0
  let notFoundInGeojson = 0
  let horsQpvFoundInGeojson = 0
  let etablissementsFoundInGeojson = 0

  const etablissementsQpv = etblissementsCreteilEp.filter(
    et => et.qp_a_proximite !== 'Hors QP'
  )
  const etablissementsHorsQpv = etblissementsCreteilEp.filter(
    et => et.qp_a_proximite === 'Hors QP'
  )

  for (const ep of etblissementsCreteilEp) {
    // position is in QPV geojson
    if (ep.qp_a_proximite != 'Hors QP') {
      // Doit être en QPV !
      const feature = findFeatureAtPosition(
        ep.position,
        rawGeojsonData as GeoJSONCollection
      )
      if (feature == undefined) {
        notFoundInGeojson++
      }
    }

    // établisement non QPV qui serait dans le geojson
    if (ep.qp_a_proximite === 'Hors QP') {
      // ne doit pas être en qpv !
      const feature = findFeatureAtPosition(
        ep.position,
        rawGeojsonData as GeoJSONCollection
      )
      if (feature) {
        horsQpvFoundInGeojson++
      }
    }

    // Etablissements du fichiers adresse
    const feature = findFeatureAtPosition(
      ep.position,
      rawGeojsonData as GeoJSONCollection
    )
    if (feature) {
      etablissementsFoundInGeojson++
    }

    // check if EP as same position compare to EtblissementsWithAddress data
    const match = addressByUai.get(ep.uai)
    if (!match) {
      continue
    }
    if (
      match.position.lon !== ep.position.lon ||
      match.position.lat !== ep.position.lat
    ) {
      nonPositionMatchingcount++
      console.log(
        `Position différente pour "${ep.nom_etablissement}" (${ep.uai}):`,
        `\n  WithEp:      lon=${ep.position.lon}, lat=${ep.position.lat}`,
        `\n  WithAddress: lon=${match.position.lon}, lat=${match.position.lat}`
      )
    }
  }
  console.log(
    `🤔 Nombre d'établissements dont les positions sont différentes : ${nonPositionMatchingcount}/${etblissementsCreteilEp.length}`
  )
  console.log(
    `🤔 Nombre d'établissements Ep marqué en QPV non retrouvé dans le Geojson : ${notFoundInGeojson}/${etablissementsQpv.length}`
  )
  console.log(
    `🤔 Nombre d'établissements Ep marqué Hors QPV mais trouvé dans le Geojson : ${horsQpvFoundInGeojson}/${etablissementsHorsQpv.length}`
  )
  console.log(
    `✅ Nombre d'établissements trouvé dans le Geojson : ${etablissementsFoundInGeojson}/${etblissementsCreteilWithAddress.length}`
  )
}

comparePositions()

// ** Quelques notes ** \\
// - aucun établisement EP retrouvé dans le fichier QP2024_France_hexagonale_LB93.geojson (source https://static.data.gouv.fr/resources/quartiers-prioritaires-de-la-politique-de-la-ville-qpv/20260109-162140/qpv-2024.zip)
// - Seulement 286/741 établisements QPV retrouvés dans le fichier qpv-2024.json (source https://gitlab.com/incubateur-territoires/startups/deveco/anct-simulateur-qpv/-/blob/main/public/data/qpv-2024.geojson?ref_type=heads)
// - 42/271 établisements Hors QPV trouvés dans le fichier qpv-2024.json
// - ✅ Nombre d'établissements en QPV trouvé dans le Geojson : 497/3625
