# REST API Specification

## Access

- Local base URL: `http://localhost:4000`
- Interactive Swagger UI: `http://localhost:4000/docs`
- Machine-readable contract: [`openapi.yaml`](openapi.yaml)
- Media type: `application/json`
- Authentication: none (current single-player test application)

Import `openapi.yaml` into Apidog, Postman, Swagger Editor, or another OpenAPI 3.0-compatible tool to inspect and exercise the contract.

## Endpoint summary

| Method | Path                          | Success | Purpose                                  |
| ------ | ----------------------------- | ------- | ---------------------------------------- |
| `GET`  | `/health`                     | `200`   | Service health probe                     |
| `GET`  | `/player`                     | `200`   | Current score and descending histories   |
| `POST` | `/game/play`                  | `201`   | Generate and persist one random score    |
| `POST` | `/rewards/{checkpoint}/claim` | `201`   | Claim one eligible reward                |
| `POST` | `/reset`                      | `201`   | Clear current player score and histories |

NestJS returns `201 Created` for successful `POST` handlers unless explicitly overridden.

## Examples

### Get player state

```http
GET /player HTTP/1.1
Host: localhost:4000
```

```json
{
  "id": 1,
  "score": 5300,
  "updatedAt": "2026-06-20T08:30:00.000Z",
  "plays": [{ "id": 4, "score": 3000, "createdAt": "2026-06-20T08:30:00.000Z", "playerId": 1 }],
  "rewards": [
    {
      "id": 1,
      "checkpoint": 5000,
      "rewardName": "รางวัล A",
      "createdAt": "2026-06-20T08:31:00.000Z",
      "playerId": 1
    }
  ]
}
```

The frontend deliberately consumes only a subset of the returned record fields. Removing `id`, `updatedAt`, or `playerId` is still a contract change for other clients.

### Play

```http
POST /game/play HTTP/1.1
Host: localhost:4000
Content-Length: 0
```

```json
{ "earned": 1000, "score": 6300 }
```

The request has no body. The server selects `earned`; clients must never supply it.

### Claim

```http
POST /rewards/5000/claim HTTP/1.1
Host: localhost:4000
Content-Length: 0
```

```json
{
  "id": 1,
  "checkpoint": 5000,
  "rewardName": "รางวัล A",
  "createdAt": "2026-06-20T08:31:00.000Z",
  "playerId": 1
}
```

Valid path values are `5000`, `7500`, and `10000`.

### Reset

```http
POST /reset HTTP/1.1
Host: localhost:4000
Content-Length: 0
```

```json
{ "score": 0 }
```

## Error envelope

Errors use NestJS's standard JSON shape:

```json
{
  "statusCode": 409,
  "message": "Reward has already been claimed",
  "error": "Conflict"
}
```

| Operation | Status | Condition                                                              |
| --------- | ------ | ---------------------------------------------------------------------- |
| Claim     | `400`  | Path is not an integer, checkpoint is unsupported, or score is too low |
| Claim     | `409`  | Checkpoint was already claimed                                         |
| Play      | `409`  | Total score is already 10,000                                          |
| Any       | `500`  | Unexpected application/database failure                                |

## Contract change policy

- Adding an optional response field is backward compatible; removing/renaming a field or changing its type is not.
- Adding a new required request field or changing status behavior is breaking.
- Keep `openapi.yaml`, controller Swagger metadata, `frontend/lib/api.ts`, and tests synchronized.
- Introduce a versioned route before shipping a breaking contract once external consumers exist.
