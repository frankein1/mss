---
paths:
  - server/api/proconnect/**
  - server/api/auth/**
  - server/middleware/**
  - server/lib/**
  - server/trpc/createContext.ts
  - composables/useAuth.ts
  - composables/useAuthState.ts
---

## Authentication & Security

### ProConnect Integration (Primary)

- OAuth2 + OIDC
- Token validation: signature (HS256), audience, issuer, nonce
- State/nonce mechanism for CSRF protection

### JWT Token Structure

- Payload includes: firstName, lastName, id, email, role, status, structureId, CGUHistoryVersion, structureType
- HS256 signature verified server-side
- 60-minute default expiration (configurable)
- Secure HttpOnly cookie prevents XSS token theft

### Data Isolation

- Structure-based multi-tenancy: Users can only access data from their structure
- Repository constraints automatically filter queries by structure and role

### Security Configuration

- Rate limiting: 600 tokens per 5 minutes global
- Request size: 1MB standard, 20MB for file uploads
- Content Security Policy: Enabled in production
- CORS: Configured for frontend domains
- Sensitive endpoints: Additional rate limits (2-5 calls per minute)

### Audit & Compliance

- UserActivity tracking: LOGIN, CREATE, UPDATE, DELETE, VIEW, ARCHIVE, EXPORT
- GDPR support: Data archiving and anonymization workflows
- CGU versioning: Track acceptance history and enforce updates
- RGAA accessibility: DSFR component library compliance
