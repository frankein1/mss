import { booleanPointInPolygon, point } from '@turf/turf'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import type { BanResponse } from '~/components/VeeForm/types'

export interface QpvFeatureProperties {
  id: string
  nom: string
}

type QpvFeature = Feature<Polygon | MultiPolygon, QpvFeatureProperties>

let qpvFeaturesPromise: Promise<QpvFeature[]> | undefined

function loadQpvFeatures(): Promise<QpvFeature[]> {
  qpvFeaturesPromise ??= $fetch<
    FeatureCollection<Polygon | MultiPolygon, QpvFeatureProperties>
  >('/data/qpv-2024.geojson')
    .then(geojson => geojson.features)
    .catch((error: unknown) => {
      qpvFeaturesPromise = undefined
      throw error
    })
  return qpvFeaturesPromise
}

function findQpv(
  lat: number,
  lon: number,
  qpvFeatures: QpvFeature[]
): QpvFeatureProperties | null {
  const pt = point([lon, lat])
  for (const feature of qpvFeatures) {
    if (booleanPointInPolygon(pt, feature)) {
      return feature.properties
    }
  }
  return null
}

export function useQpvResolution() {
  async function resolveQpv(
    coordinates: [number, number]
  ): Promise<QpvFeatureProperties | null> {
    const [lon, lat] = coordinates
    const qpvFeatures = await loadQpvFeatures()
    return findQpv(lat, lon, qpvFeatures)
  }

  // Geocodes an address that has no known coordinates yet (e.g. an existing
  // beneficiary's saved address) before resolving whether it falls in a QPV.
  async function resolveQpvFromAddress(
    street: string,
    zipCode: string
  ): Promise<QpvFeatureProperties | null> {
    const response = await $fetch<BanResponse>(
      'https://data.geopf.fr/geocodage/search/',
      { params: { q: street, postcode: zipCode, limit: 1 } }
    )
    const feature = response.features[0]
    if (!feature) {
      return null
    }
    return resolveQpv(feature.geometry.coordinates)
  }

  return { resolveQpv, resolveQpvFromAddress }
}
