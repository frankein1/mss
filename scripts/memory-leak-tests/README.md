# Docker Memory Leak Investigation

Local Docker setup for monitoring MSS memory usage under controlled conditions.  
The app container is limited to **512 MB** to surface leaks faster.

## Structure

```
scripts/memory-leak-tests/
├── Dockerfile                          Multi-stage build (builder → production runtime)
├── compose.yaml                        postgres + app with 512m memory limit
├── modal-memory-leak.perf.spec.ts      Playwright E2E heap-growth test
├── perf_export_followups_david.ts      Followup export perf benchmark
├── .env.docker                         Runtime env vars (secrets, DB URL) — not in git
└── README.md                           This file

# At project root:
.dockerignore       Excludes tests, docs, .env files from build context
```

### How it works

- **Build time**: only `NUXT_PUBLIC_*` vars are baked into the client bundle. A dummy `DATABASE_URL` satisfies `prisma generate`.
- **Runtime**: real env vars (`DATABASE_URL`, `NUXT_AUTH_*`, etc.) are injected from `.env.docker` via `env_file` in compose.
- **Postgres** runs on host port **5433** (to avoid conflict with the dev compose on 5432). Inside the Docker network, the app connects to `postgres:5432`.

## Quick start

All commands are run from the project root.

```bash
# 1. Create .env.docker in scripts/memory-leak-tests/ (see template below or copy from .env.docker.example)
#    The defaults work out of the box for local testing.

# 2. Build and start
docker compose -f scripts/memory-leak-tests/compose.yaml up --build -d

# 3. Check logs
docker compose -f scripts/memory-leak-tests/compose.yaml logs -f app

# 4. Seed the database (optional, from host)
DATABASE_URL=postgresql://mss:password@localhost:5433/mss pnpm prisma migrate reset
```

## Memory monitoring

Record memory stats to CSV while using the app:

```bash
echo "timestamp,mem_usage,mem_pct,cpu_pct" > mem-stats.csv && \
while true; do
  docker stats mss-app --no-stream \
    --format "$(date +%s),{{.MemUsage}},{{.MemPerc}},{{.CPUPerc}}" \
    >> mem-stats.csv
  sleep 1
done
```

Then open the app at http://localhost:3000 and perform actions (navigate pages, open modals, create beneficiaries, etc.).

Stop the recording with `Ctrl+C`. The CSV can be plotted with any tool:

```bash
# Plot to PNG
gnuplot -e "
  set terminal png size 1200,600;
  set output 'mem-stats.png';
  set datafile separator ',';
  set xlabel 'seconds';
  set ylabel 'MB';
  plot 'mem-stats.csv' using (\$1-$(head -2 mem-stats.csv | tail -1 | cut -d, -f1)):(\$2/1024/1024) with lines title 'Memory'
"
# then open mem-stats.png
```

## Playwright heap-growth test

`modal-memory-leak.perf.spec.ts` opens/closes a modal 20 times and asserts JS heap growth stays under 2 MB:

```bash
pnpm playwright test e2e/modal-memory-leak.perf.spec.ts
```

## Rebuild / reset

```bash
# Full rebuild (no cache)
docker compose -f scripts/memory-leak-tests/compose.yaml down -v && \
docker compose -f scripts/memory-leak-tests/compose.yaml up --build -d

# Just restart app (keeps postgres data)
docker compose -f scripts/memory-leak-tests/compose.yaml up --build -d app
```

## Troubleshooting

| Symptom                       | Fix                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `pnpm install` fails in build | Check pnpm version in Dockerfile matches `package.json` `packageManager` field    |
| App can't reach postgres      | Verify `DATABASE_URL` in `.env.docker` uses hostname `postgres` (not `localhost`) |
| Port 5433 already in use      | Stop dev compose: `docker compose -f docker-compose.dev.yml down`                 |
| OOM killed (exit code 137)    | That's the 512m limit doing its job — you found a leak                            |
