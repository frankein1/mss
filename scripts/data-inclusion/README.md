# Data Inclusion v0 → v1 migration

One-shot scripts to backfill `partner_organization.data_inclusion_id_v1` from the existing `data_inclusion_id` (v0).

## Full migration sequence

Run the three scripts in order. Each is idempotent and safe to rerun.

### 0. Export v1 structures (optional debug utility)

Dumps all `DataInclusionStructureV1` rows to `v1-structures.json` for offline inspection.

```sh
npx tsx scripts/data-inclusion/export-v1-structures.ts
```

### 1. First pass — ID-based matching

Matches partner orgs to v1 structures by extracting the v0 suffix from v1 IDs (`{source}--{v0Id}`) and from their `doublons` arrays.

```sh
# Dry run first
npx tsx scripts/data-inclusion/migrate-data-inclusion-v1.ts --env=prod --dry-run

# Check the report for ambiguous entries, add overrides if needed
# (see Override files section below)

# Apply
npx tsx scripts/data-inclusion/migrate-data-inclusion-v1.ts --env=prod
```

Report fields:

| Field             | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `matched`         | Updated automatically (1:1 match)                              |
| `overrideApplied` | Resolved via `ambiguousOverrides`                              |
| `ambiguous`       | Multiple v1 candidates — add to `ambiguousOverrides` and rerun |
| `unmatched`       | No v1 candidate found by ID — handled by second pass           |

### 2. Second pass — name+zipcode / SIRET matching

Handles orgs that still have no `dataInclusionIdV1` after the first pass.

```sh
# Dry run first
npx tsx scripts/data-inclusion/migrate-data-inclusion-v1-unmatched.ts --env=prod --dry-run

# Review report, add overrides for ambiguous/suspicious SIRET matches
# (see Override files section below)

# Apply
npx tsx scripts/data-inclusion/migrate-data-inclusion-v1-unmatched.ts --env=prod
```

Report fields:

| Field                    | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `matchedByName`          | Trusted auto-match (normalized name + zipcode)                       |
| `matchedBySiretFallback` | **Not applied** — needs manual confirmation via `ambiguousOverrides` |
| `overrideApplied`        | Resolved via `ambiguousOverrides`                                    |
| `ambiguousByName`        | Multiple v1 structures share the same name+zipcode                   |
| `ambiguousBySiret`       | Multiple v1 structures share the same SIRET                          |
| `noV0Structure`          | Partner org has a v0 ID but the v0 structure row is missing          |
| `noMatch`                | No v1 candidate found by either method                               |
| `invalidOverrides`       | Overrides referencing a v1 ID not in `DataInclusionStructureV1`      |

### Done criteria

The migration is complete when:

- `ambiguous` (first pass) = 0
- `ambiguousByName` + `ambiguousBySiret` (second pass) = 0
- `matchedBySiretFallback` entries have been reviewed and either added to `ambiguousOverrides` or accepted as `noMatch`
- Remaining `noMatch` entries are accepted (the v0 org no longer exists in v1)

---

## Prerequisites

- `DataInclusionStructureV1` table must be populated (run the structure import first)
- `DATABASE_URL` must point to the target environment's database
- `--env=<dev|demo|prod>` is **required** — the script refuses to run without it

Both scripts leave `dataInclusionId` (v0) untouched and are safe to rerun.

## Override files

Ambiguous matches are resolved by creating a **per-environment** override file (gitignored via `*.ignore.*`).
Copy the example template, replacing `{env}` with the target environment, fill in your entries, and rerun the script.

**First pass:**

```sh
cp scripts/data-inclusion/migrate-data-inclusion-v1.overrides.\{env\}.example.ts \
   scripts/data-inclusion/migrate-data-inclusion-v1.overrides.prod.ignore.ts
```

**Second pass:**

```sh
cp scripts/data-inclusion/migrate-data-inclusion-v1-unmatched.overrides.\{env\}.example.ts \
   scripts/data-inclusion/migrate-data-inclusion-v1-unmatched.overrides.prod.ignore.ts
```

Replace `prod` with `dev` or `demo` as needed. Each environment has its own override file because partner organizations differ across environments.

Each file exports a single `ambiguousOverrides` map:

```ts
export const ambiguousOverrides: Record<string, string> = {
  '<partnerOrgId>': '<v1-structure-id>'
}
```

If no override file exists for the given environment, the script falls back to an empty map and continues normally.

---

## Reviewing SIRET fallback matches

Each entry in `matchedBySiretFallbackDetails` includes:

| Field          | Description                                 |
| -------------- | ------------------------------------------- |
| `partnerOrgId` | The partner org being matched               |
| `name`         | Partner org name                            |
| `v0Siret`      | SIRET from the v0 structure used for lookup |
| `v0Zipcode`    | Zipcode from the v0 structure               |
| `v1Id`         | The v1 structure it matched to              |
| `v1Name`       | Name of the matched v1 structure            |
| `v1Zipcode`    | Zipcode of the matched v1 structure         |

Red flags to look for:

- **Name divergence** — `name` and `v1Name` don't look like the same entity
- **Zipcode mismatch** — `v0Zipcode` and `v1Zipcode` are in different départements

Suspicious entries should be added to `ambiguousOverrides` with the correct v1 id, or left out to fall into `noMatch`.
