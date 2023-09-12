function buildOptions(map: Record<string, string>) {
  return Object.keys(map).map(value => {
    const label = map[value]
    return {
      label,
      value
    }
  })
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
