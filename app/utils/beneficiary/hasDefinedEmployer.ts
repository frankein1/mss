export function hasDefinedEmployer(b: {
  employer: string | null
}): b is { employer: string } {
  return b.employer !== null
}
