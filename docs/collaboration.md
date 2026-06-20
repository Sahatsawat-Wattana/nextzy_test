# Team Collaboration Guide

## Ownership and communication boundaries

| Change                   | Primary area                          | Required communication                                           |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------- |
| UI layout or interaction | `frontend/app`, `frontend/components` | Screenshot/recording and affected responsive widths              |
| Client/API integration   | `frontend/lib/api.ts`                 | Link to OpenAPI diff and handling for each error status          |
| Game or reward rule      | `backend/src/game.*`                  | State examples, edge cases, and matching frontend display update |
| REST contract            | Controller + `docs/api/openapi.yaml`  | Breaking/non-breaking classification and consumer migration note |
| Database model           | `backend/prisma`                      | Migration name, deployment order, rollback/forward-fix plan      |
| Runtime/configuration    | Docker/env/deployment files           | New variables, defaults, and environment-specific rollout steps  |

## Change workflow

1. State the user-visible behavior and acceptance cases before implementation.
2. For API work, edit the OpenAPI contract first or in the same commit so frontend and backend can work against one definition.
3. Keep backend validation and domain rules authoritative; treat frontend checks as usability only.
4. Add tests at the lowest useful layer and integration tests at persistence/API boundaries.
5. Update affected documents and examples in the same pull request.
6. Run root checks: `npm run lint`, `npm test`, and `npm run build`.

## API change handoff template

```text
Operation: POST /example
Reason: <user/business outcome>
Compatibility: backward compatible | breaking
Request change: <fields, validation, example>
Response change: <status, fields, example>
Error cases: <status and trigger>
Frontend impact: <api method, UI states>
Database impact: none | <migration>
Verification: <commands and scenarios>
```

## Pull request checklist

- Behavior and out-of-scope decisions are explicit.
- API fields and statuses match `docs/api/openapi.yaml`.
- Business rules are enforced on the server, including invalid and concurrent requests.
- Schema changes include a migration and deployment note.
- Loading, empty, success, error, locked, claimed, and max-score UI states are considered.
- Tests cover score accumulation/cap, checkpoint boundaries, duplicate claim, reset, and history ordering where relevant.
- UI changes include Home/Game screenshots at representative mobile and tablet widths.
- No secret or real credential is committed; example environment files stay sanitized.

## Definition of done

A change is done when implementation, automated checks, contract/schema updates, documentation, and observable UI/API verification agree. A backend endpoint without a client contract, or a frontend assumption not guaranteed by the API, is incomplete.
