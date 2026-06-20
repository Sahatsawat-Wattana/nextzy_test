# Engineering Documentation

This directory is the shared technical reference for the Nextzy Rewards application. It documents the system as implemented; product requirements remain in [`../instruction.md`](../instruction.md).

## Start here

| Document                               | Use it for                                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [System architecture](architecture.md) | Runtime boundaries, data flow, key workflows, and design constraints                               |
| [Frontend guide](frontend.md)          | Routes, React components, client state, API integration, and frontend file structure               |
| [Backend guide](backend.md)            | NestJS layers, business rules, persistence model, transactions, and backend file structure         |
| [API specification](api/README.md)     | Endpoint behavior, examples, errors, and compatibility rules                                       |
| [OpenAPI document](api/openapi.yaml)   | Machine-readable REST contract for import into Swagger Editor, Apidog, Postman, or code generators |
| [Team collaboration](collaboration.md) | Ownership, change workflow, definition of done, and review checklist                               |

## Source of truth

When documents disagree, use this order:

1. `docs/api/openapi.yaml` for the public HTTP contract.
2. Prisma migrations for the deployed database structure.
3. Application source for current runtime behavior.
4. These explanatory documents for intent and team conventions.

Update the relevant document in the same pull request whenever a public API, database model, business rule, route, component responsibility, environment variable, or operational command changes.
