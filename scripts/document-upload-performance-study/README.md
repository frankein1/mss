# Document Upload Performance Study

Benchmarks the document upload pipeline (KMS key generation, encryption, S3 upload) to measure throughput and latency at various concurrency levels. Produces per-upload CSV data and a JSON summary with percentile breakdowns, useful for capacity planning and estimating bulk migration times.

## Prerequisites

- **Node/tsx** — the script is a `.mts` file, run with `tsx`
- **Sample files** — place 5-10 PDF or image files (200 KB - 2 MB each) in `ignore/samples/`
- **Environment variables** — S3 and KMS credentials (see below)

## Environment Variables

### S3 (required)

| Variable                    | Description          |
| --------------------------- | -------------------- |
| `NUXT_S3_ACCESS_KEY_ID`     | S3 access key        |
| `NUXT_S3_SECRET_ACCESS_KEY` | S3 secret key        |
| `NUXT_S3_REGION`            | S3 region            |
| `NUXT_S3_BUCKET`            | Target bucket        |
| `NUXT_S3_ENDPOINT`          | S3 endpoint URL      |
| `NUXT_S3_FORCE_PATH_STYLE`  | Set `true` for MinIO |

### KMS / OpenBao (required)

| Variable                 | Description             |
| ------------------------ | ----------------------- |
| `NUXT_KMS_ACCESS_KEY_ID` | KMS access key          |
| `NUXT_KMS_SECRET_KEY`    | KMS secret key          |
| `NUXT_KMS_API_URL`       | OpenBao / Vault API URL |
| `NUXT_KMS_KEY_ID`        | Transit key ID          |
| `NUXT_KMS_PROJECT_ID`    | Project ID (optional)   |

## Usage

```bash
npx tsx scripts/document-upload-performance-study/run.mts \
  --concurrency <1|5|10|20|50> \
  --total <number>            \
  --cleanup
```

| Flag            | Description                                           | Default |
| --------------- | ----------------------------------------------------- | ------- |
| `--concurrency` | Number of parallel workers (1, 5, 10, 20, or 50)      | —       |
| `--total`       | Total number of uploads to perform                    | 100     |
| `--cleanup`     | Delete uploaded objects from S3 when the run finishes | false   |

### Example

```bash
npx tsx scripts/document-upload-performance-study/run.mts --concurrency 10 --total 200 --cleanup
```

## Output

Results are written to `ignore/results/`:

- **`results-<concurrency>-<timestamp>.csv`** — one row per upload with timing breakdown (KMS, encrypt, upload, total) and error classification
- **`summary-<concurrency>-<timestamp>.json`** — aggregate stats: throughput (docs/sec, MB/sec), latency percentiles (p50/p95/p99), error counts, and a 350 GB migration time estimate

A summary table is also printed to the console.

## How It Works

For each upload the script:

1. Generates a data encryption key via KMS (OpenBao Transit)
2. Encrypts the file content (AES-256-GCM)
3. Uploads the ciphertext to S3 with encryption metadata

Each phase is timed independently using `AsyncLocalStorage` to capture KMS latency inside the encrypt call. Errors are classified by type (KMS rate-limit, DNS, S3 timeout, etc.) for easy triage.
