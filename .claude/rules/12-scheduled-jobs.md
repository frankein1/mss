---
paths:
  - scheduler/**
  - server/scheduler/**
  - cron.json
---

# Scheduled Jobs

## Job registry

All scheduled jobs are defined in `scheduler/jobs.ts`. Each key has a JSDoc comment describing its purpose and cron schedule. The scheduler is started from `scheduler/index.ts` using `croner`.

When adding or modifying a job, update both:

- `scheduler/jobs.ts` — job definition and JSDoc
- `scheduler/index.ts` — cron schedule registration

## Legacy jobs (cron.json)

Two historical jobs still live in `cron.json` and run as standalone scripts via `server/scheduler/notifications/`. They have not been migrated into the main scheduler yet:

- `scheduler:archive-notifications` — creates notifications for beneficiaries to be archived and exported in 1 month (`server/scheduler/notifications/archive-notifications.ts`). Runs daily at 02:45.
- `scheduler:archive-reminders-notifications` — creates notifications for beneficiaries to be archived and exported in 7 days and today (`server/scheduler/notifications/archive-reminders-notifications.ts`). Runs daily at 03:45.

These are candidates for migration into `scheduler/jobs.ts` once the RuntimeConfig issue is resolved and `lastActivity` has been migrated.
