import { booleanPointInPolygon, point } from '@turf/turf'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

export interface QpvFeatureProperties {
  id: string
  nom: string
}

type QpvFeature = Feature<Polygon | MultiPolygon, QpvFeatureProperties>

let qpvFeaturesPromise: Promise<QpvFeature[]> | undefined

function loadQpvFeatures(): Promise<QpvFeature[]> {
  qpvFeaturesPromise ??= $fetch<
    FeatureCollection<Polygon | MultiPolygon, QpvFeatureProperties>
  >('/data/qpv-2024.geojson').then(geojson => geojson.features)
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

  return { resolveQpv }
}
