---
paths:
  - server/integrations/**
  - server/plugins/**
  - server/api/**
  - server/services/rdvsp/**
  - plugins/**
---

## Key External Integrations

### ProConnect (French Government SSO)

- **Purpose**: Single sign-on for agents
- **Authentication**: OAuth2 + OIDC
- **Config**: Client ID, Client Secret in environment variables
- **Flow**: Initiate → Authorize → Callback → Session Creation
- **Location**: `server/lib/proconnect.client.ts`, `server/api/proconnect/**`

### RDV Service Public (Appointment Booking)

- **Purpose**: External appointment scheduling system
- **Integration**: OAuth2 callback for appointment confirmation
- **Data Sync**: Appointments synced to MSS SocialSupport model
- **Location**: `/server/lib/rdvsp-oauth.client.ts`, `server/services/rdvsp/**`

### Brevo (Email Service)

- **Purpose**: Template-based email delivery
- **Features**: Email queuing, delivery tracking, bounce handling
- **API Client**: Configured in /server/lib/brevo.client.ts
- **Integration**: /server/integrations/brevo/, /server/email/
- **Usage**: Email cron scheduler runs email queue processing

### Data Inclusion (French Social Services Directory)

- **Purpose**: Catalog of potential partner organizations by region and support topic
- **Features**: Partner organization search and enrichment
- **API Integration**: `server/integrations/data-inclusion/`
- **Storage**: DataInclusionStructure model stores imported catalog data

### Matomo (Analytics)

- **Purpose**: Privacy-friendly website analytics
- **Configuration**: Host URL, Site ID via environment variables
- **Tracking**: Page views, user interactions
- **Plugin**: /plugins/matomo.client.ts

### Sentry (Error Tracking)

- **Purpose**: Error monitoring and alerting
- **Integration**: Both Vue client and Node.js server
- **Features**: Error grouping, release tracking, performance monitoring
- **Configuration**: DSN, environment, trace sample rate via env vars
- **Plugins**: `plugins/sentry.client.ts` and `server/plugins/sentry.ts`
