postdeploy: pnpm prisma migrate deploy
web: NODE_OPTIONS="--max-old-space-size-percentage=80" node .output/server/index.mjs
scheduler: node .output-scheduler/index.mjs
