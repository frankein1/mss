function buildOptions(labels: Record<string, string>) {
  return new Map(Object.entries(labels))
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

export { buildKeys }
