postdeploy: CI=true pnpm prisma migrate deploy
web: bin/run & NITRO_UNIX_SOCKET=/tmp/nginx.sock NODE_OPTIONS="--max-old-space-size-percentage=80" node .output/server/index.mjs
scheduler: node .output-scheduler/index.mjs
