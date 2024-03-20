function buildOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ label, value }))
}

function buildKeys(byKey: Record<string, string>) {
  return {
    byKey,
    keys: Object.keys(byKey),
    options: buildOptions(byKey),
    values: Object.values(byKey),
    value: (key: string | null | undefined) => {
      return key ? byKey[key] : null
    }
  }
}

type Keys = ReturnType<typeof buildKeys>

function mergeKeys(keys1: Keys, keys2: Keys) {
  const byKey1 = keys1.byKey
  const byKey2 = keys2.byKey
  const byKey = { ...byKey1, ...byKey2 }
  return buildKeys(byKey)
}

export { buildKeys, mergeKeys }
