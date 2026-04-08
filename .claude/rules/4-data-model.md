---
paths:
  - prisma/**
  - server/database/**
---

## Key Data Models

### Core Entities

| Model                  | Purpose                         | Key Fields                                             |
| ---------------------- | ------------------------------- | ------------------------------------------------------ |
| **User**               | System user with roles          | id, firstName, lastName, email, role, status           |
| **Structure**          | Organization (CCAS, CIAS, etc.) | id, name, type, address, phone                         |
| **Beneficiary**        | Citizen receiving support       | id, firstName, lastName, gender, dob, 70+ fields       |
| **FamilyFile**         | Groups beneficiaries            | id, name, structure, status                            |
| **SocialSupport**      | Unified container               | id, beneficiary, subject, status                       |
| **Followup**           | Case notes                      | id, date, medium, description                          |
| **HelpRequest**        | Financial aid request           | id, description, status, amount                        |
| **HousingHelpRequest** | Housing aid request             | id, askedHousing, housingType, reason, fileInstruction |
| **Budget**             | Family financial status         | id, familyFile                                         |
| **Document**           | Stored files                    | id, file, type, beneficiary                            |
| **Notification**       | System alerts                   | id, type, user, read                                   |
| **Workshop**           | Group activities                | id, workshopName, status, date                         |

### Related Models

- **BeneficiaryRelative**: Family members and associates
- **Account**: OAuth provider integration
- **Comment**: Discussion threads on social supports
- **FileInstruction**: Processing status for help requests
- **Appointment**: Scheduled meetings
- **ArchivedBeneficiary**: Historical records with archive dates
- **PartnerOrganization**: External organization contacts
- **DataInclusionStructure**: Catalog of potential partner organizations by region and support topic

### Key Features

- **Multi-tenancy**: Structure-based isolation via repository constraints
- **Audit Trail**: UserActivity model logs all mutations
- **Soft Deletes**: Status field (Active/Archived) instead of hard deletion
- **Customization**: Custom workshop names and social support subjects per structure
- **Relationships**: 40+ models with complex interdependencies
